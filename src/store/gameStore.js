import { reactive } from 'vue'
import { ALL_CARDS, getCard, cardValue, shopPrice } from '../data/cards.js'
import { REGIONS } from '../data/regions.js'

const SAVE_KEY = 'nine-realms-v1'

// ─── Persistence ──────────────────────────────────────────────────────────────

function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function persistSave() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      cardLibrary:    store.cardLibrary,
      defeatedNPCs:   store.defeatedNPCs,
      defeatedBosses: store.defeatedBosses,
      coins:          store.coins,
    }))
  } catch { /* ignore */ }
}

const saved = loadSave()

// ─── Store ────────────────────────────────────────────────────────────────────

export const store = reactive({
  // Persisted game data
  cardLibrary:    saved?.cardLibrary    ?? [1, 2, 3, 4, 5],
  defeatedNPCs:   saved?.defeatedNPCs   ?? [],   // strings: "regionId-npcId"
  defeatedBosses: saved?.defeatedBosses ?? [],   // region ids (numbers)
  coins:          saved?.coins          ?? 0,

  // Navigation
  currentView:       'worldmap',  // 'worldmap' | 'town' | 'deckbuilder' | 'battle' | 'collection'
  selectedRegionId:  null,
  selectedNpcId:     null,

  // Merchant stock — refreshed each town visit
  merchantStock: [],  // [{ cardId, price, purchased }]

  // Battle runtime state (null when outside of battle)
  battle: null,

  // Populated after battle finishes
  lastResult: null,
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getCurrentRegion() {
  return store.selectedRegionId !== null ? REGIONS[store.selectedRegionId] : null
}

export function getCurrentNpc() {
  if (store.selectedRegionId === null || store.selectedNpcId === null) return null
  return REGIONS[store.selectedRegionId]?.npcs[store.selectedNpcId] ?? null
}

export function isRegionUnlocked(regionId) {
  if (regionId === 0) return true
  return store.defeatedBosses.includes(regionId - 1)
}

export function isBossDefeated(regionId) {
  return store.defeatedBosses.includes(regionId)
}

export function isNpcDefeated(regionId, npcId) {
  return store.defeatedNPCs.includes(`${regionId}-${npcId}`)
}

export function getPlayerCards() {
  return store.cardLibrary.map(id => getCard(id)).filter(Boolean)
}

// ─── Merchant helpers ─────────────────────────────────────────────────────────

function generateMerchantStock(regionLevel) {
  const minTier = Math.min(regionLevel + 1, 9)
  const maxTier = Math.min(regionLevel + 4, 9)
  const pool = ALL_CARDS.filter(c => c.tier >= minTier && c.tier <= maxTier)
  // Shuffle and take up to 5
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 5).map(c => ({
    cardId:    c.id,
    price:     shopPrice(c),
    purchased: false,
  }))
}

export function buyCard(cardId) {
  const item = store.merchantStock.find(s => s.cardId === cardId)
  if (!item || item.purchased) return false
  if (store.coins < item.price) return false
  store.coins -= item.price
  store.cardLibrary.push(cardId)
  item.purchased = true
  persistSave()
  return true
}

// ─── Navigation actions ───────────────────────────────────────────────────────

export function navigateTo(view, opts = {}) {
  store.currentView = view
  if (opts.regionId !== undefined) store.selectedRegionId = opts.regionId
  if (opts.npcId   !== undefined) store.selectedNpcId    = opts.npcId
}

export function goToWorldMap() {
  store.battle = null
  navigateTo('worldmap')
}

export function goToTown(regionId) {
  navigateTo('town', { regionId })
  const region = REGIONS[regionId]
  if (region) {
    store.merchantStock = generateMerchantStock(region.level)
  }
}

export function goToDeckBuilder(npcId) {
  store.selectedNpcId = npcId
  navigateTo('deckbuilder')
}

export function goToCollection() {
  store.lastView = store.currentView
  navigateTo('collection')
}

export function backFromCollection() {
  navigateTo(store.lastView ?? 'worldmap')
}

// ─── Battle actions ───────────────────────────────────────────────────────────

export function startBattle(playerDeckIds) {
  const npc = getCurrentNpc()
  if (!npc) return

  store.battle = {
    playerDeck:      [...playerDeckIds],
    enemyDeck:       [...npc.deckIds],
    board:           Array(9).fill(null),  // each cell: { cardId, owner:'player'|'enemy' } | null
    playerHand:      [...playerDeckIds],
    enemyHand:       [...npc.deckIds],
    selectedCard:    null,                 // card id the player has picked to place
    currentTurn:     'player',
    phase:           'playing',            // 'playing' | 'result'
    justCaptured:    [],                   // cell indices flashed last capture
    winner:          null,
    playerScore:     0,
    enemyScore:      0,
    loot:            [],
    enemyThinking:   false,
  }
  navigateTo('battle')
}

export function selectBattleCard(cardId) {
  const b = store.battle
  if (!b || b.phase !== 'playing' || b.currentTurn !== 'player') return
  b.selectedCard = b.selectedCard === cardId ? null : cardId
}

export function placeCard(position) {
  const b = store.battle
  if (!b || b.phase !== 'playing' || b.currentTurn !== 'player') return
  if (b.board[position] !== null) return
  if (!b.selectedCard) return

  const cardId = b.selectedCard
  const card   = getCard(cardId)
  if (!card) return

  // Place
  b.board[position] = { cardId, owner: 'player' }
  b.playerHand      = b.playerHand.filter(id => id !== cardId)
  b.selectedCard    = null

  // Capture
  const captured = computeCaptures(b.board, position, card, 'player')
  b.justCaptured = captured
  captured.forEach(pos => {
    b.board[pos] = { ...b.board[pos], owner: 'player' }
  })

  // Check board full (player goes on turns 1,3,5,7,9 → places 5 cards)
  if (b.board.every(c => c !== null)) {
    finishBattle()
    return
  }

  // Hand off to enemy
  b.currentTurn   = 'enemy'
  b.enemyThinking = true
  const isBoss = getCurrentNpc()?.type === 'boss'
  setTimeout(() => doEnemyTurn(isBoss), 1000 + Math.random() * 500)
}

function doEnemyTurn(isBoss) {
  const b = store.battle
  if (!b || b.phase !== 'playing') return

  const move = isBoss ? bestMove(b) : randomMove(b)
  if (!move) return

  const { cardId, position } = move
  const card = getCard(cardId)

  b.board[position]  = { cardId, owner: 'enemy' }
  b.enemyHand        = b.enemyHand.filter(id => id !== cardId)
  b.enemyThinking    = false

  const captured = computeCaptures(b.board, position, card, 'enemy')
  b.justCaptured = captured
  captured.forEach(pos => {
    b.board[pos] = { ...b.board[pos], owner: 'enemy' }
  })

  // After enemy's 4th move the board is full (5 player + 4 enemy = 9 cells)
  if (b.board.every(c => c !== null)) {
    finishBattle()
    return
  }

  b.currentTurn = 'player'
}

// ─── Battle helpers ───────────────────────────────────────────────────────────

function computeCaptures(board, position, card, owner) {
  const row = Math.floor(position / 3)
  const col = position % 3
  const captured = []

  function check(adjPos, myVal, theirVal) {
    const cell = board[adjPos]
    if (cell && cell.owner !== owner) {
      const adj = getCard(cell.cardId)
      if (adj && cardValue(myVal) > cardValue(theirVal(adj))) {
        captured.push(adjPos)
      }
    }
  }

  if (row > 0) check(position - 3, card.up,    a => a.down)
  if (row < 2) check(position + 3, card.down,  a => a.up)
  if (col > 0) check(position - 1, card.left,  a => a.right)
  if (col < 2) check(position + 1, card.right, a => a.left)

  return captured
}

function randomMove(b) {
  const empty = b.board.map((c, i) => c === null ? i : -1).filter(i => i >= 0)
  if (!empty.length || !b.enemyHand.length) return null
  return {
    cardId:   b.enemyHand[Math.floor(Math.random() * b.enemyHand.length)],
    position: empty[Math.floor(Math.random() * empty.length)],
  }
}

function bestMove(b) {
  const empty = b.board.map((c, i) => c === null ? i : -1).filter(i => i >= 0)
  if (!empty.length || !b.enemyHand.length) return null

  let best = -1
  let candidates = []

  for (const cardId of b.enemyHand) {
    const card = getCard(cardId)
    for (const pos of empty) {
      const n = computeCaptures(b.board, pos, card, 'enemy').length
      if (n > best) { best = n; candidates = [{ cardId, position: pos }] }
      else if (n === best) candidates.push({ cardId, position: pos })
    }
  }

  // Prefer center cell (index 4) among equal moves
  return (
    candidates.find(m => m.position === 4) ??
    candidates[Math.floor(Math.random() * candidates.length)]
  )
}

function finishBattle() {
  const b   = store.battle
  const npc = getCurrentNpc()

  const playerCells = b.board.filter(c => c?.owner === 'player').length
  // Enemy has 1 card remaining in hand (player places 5, enemy places 4)
  const enemyCells  = b.board.filter(c => c?.owner === 'enemy').length + b.enemyHand.length

  const winner =
    playerCells > enemyCells ? 'player' :
    playerCells < enemyCells ? 'enemy'  : 'draw'

  b.playerScore = playerCells
  b.enemyScore  = enemyCells
  b.winner      = winner
  b.phase       = 'result'

  let loot = []
  let coinsEarned = 0

  if (winner === 'player' && npc) {
    loot = npc.type === 'boss'
      ? [...b.enemyDeck]
      : [b.enemyDeck[Math.floor(Math.random() * b.enemyDeck.length)]]

    // Award coins — each region adds +2 on top of the base reward
    const regionBonus = (store.selectedRegionId ?? 0) * 2
    coinsEarned = (npc.type === 'boss' ? 5 : 2) + regionBonus
    store.coins += coinsEarned

    // Add new cards to library (allow duplicates as per game design)
    loot.forEach(id => store.cardLibrary.push(id))

    // Mark NPC defeated
    const key = `${store.selectedRegionId}-${npc.id}`
    if (!store.defeatedNPCs.includes(key)) store.defeatedNPCs.push(key)

    // Mark boss defeated
    if (npc.type === 'boss' && !store.defeatedBosses.includes(store.selectedRegionId)) {
      store.defeatedBosses.push(store.selectedRegionId)
    }

    persistSave()
  }

  b.loot = loot
  store.lastResult = {
    winner,
    playerScore: playerCells,
    enemyScore:  enemyCells,
    loot,
    coinsEarned,
    npcType:     npc?.type,
    npcName:     npc?.nameEn ?? npc?.name,
  }
}

export function exitBattle() {
  store.battle = null
  navigateTo('town')
}

export function retryBattle() {
  const npc = getCurrentNpc()
  if (!npc) return
  store.battle = null
  navigateTo('deckbuilder')
}

// ─── Reset ────────────────────────────────────────────────────────────────────

export function resetGame() {
  store.cardLibrary    = [1, 2, 3, 4, 5]
  store.defeatedNPCs   = []
  store.defeatedBosses = []
  store.coins          = 0
  store.merchantStock  = []
  store.battle         = null
  store.lastResult     = null
  localStorage.removeItem(SAVE_KEY)
  navigateTo('worldmap')
}
