<template>
  <div class="flex flex-col h-full overflow-hidden select-none"
       style="background: radial-gradient(ellipse at 50% 50%, rgba(26,74,139,0.08) 0%, transparent 70%);">

    <!-- Top: enemy info + hand -->
    <div class="flex-shrink-0 px-3 pt-2 pb-1">
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-2">
          <span class="font-cinzel text-red-400 text-xs tracking-widest uppercase">
            {{ npc?.nameEn ?? npc?.name ?? 'Enemy' }}
          </span>
          <span v-if="b.enemyThinking"
                class="text-[10px] text-game-text-muted font-cinzel animate-pulse">
            {{ L.battle.thinking }}
          </span>
        </div>
        <div class="flex items-center gap-1.5 font-mono text-sm">
          <span class="text-red-400 font-bold">{{ liveEnemyScore }}</span>
          <span class="text-game-text-muted text-xs">vs</span>
          <span class="text-blue-400 font-bold">{{ livePlayerScore }}</span>
        </div>
      </div>

      <!-- Enemy hand -->
      <div class="flex gap-1.5 justify-center min-h-[60px] items-center">
        <div v-for="(cardId, i) in b.enemyHand" :key="i">
          <CardItem :card="getCard(cardId)" :size="cardSize" owner="enemy" />
        </div>
        <!-- Placeholder slots for placed cards -->
        <div v-for="i in 5 - b.enemyHand.length - (b.phase === 'result' ? 0 : enemyPlaced)" :key="'ep'+i"
             class="opacity-0"
             :style="cardSizeStyle" />
      </div>
    </div>

    <!-- Turn indicator -->
    <div class="flex-shrink-0 flex items-center justify-center gap-3 py-1">
      <div class="w-12 h-0.5 rounded-full transition-all duration-300"
           :style="{ background: b.currentTurn === 'enemy' ? '#c0392b' : 'rgba(192,57,43,0.2)' }" />
      <span class="font-cinzel text-[10px] tracking-widest uppercase"
            :class="b.currentTurn === 'player' ? 'text-blue-400' : 'text-red-400'">
        {{ b.currentTurn === 'player' ? L.battle.yourTurn : L.battle.enemyTurn }}
      </span>
      <div class="w-12 h-0.5 rounded-full transition-all duration-300"
           :style="{ background: b.currentTurn === 'player' ? '#3498db' : 'rgba(52,152,219,0.2)' }" />
    </div>

    <!-- 3×3 Board -->
    <div class="flex-shrink-0 flex items-center justify-center px-3 py-1">
      <div class="grid grid-cols-3 gap-1.5" :style="boardStyle">
        <div
          v-for="(cell, idx) in b.board"
          :key="idx"
          class="board-cell"
          :class="{
            droppable: canPlace(idx),
          }"
          :style="cellStyle"
          @click="handleCellClick(idx)"
        >
          <!-- Placed card -->
          <CardItem
            v-if="cell"
            :card="getCard(cell.cardId)"
            :owner="cell.owner"
            :size="cardSize"
            :class="{ capturing: b.justCaptured.includes(idx), 'card-placed': true }"
          />

          <!-- Empty droppable hint -->
          <div v-else-if="canPlace(idx)"
               class="font-cinzel text-game-gold text-xl opacity-40">+</div>
        </div>
      </div>
    </div>

    <!-- Selected card indicator -->
    <div class="flex-shrink-0 flex items-center justify-center gap-2 py-0.5 min-h-[20px]">
      <template v-if="b.selectedCard">
        <span class="text-[10px] font-cinzel text-game-gold tracking-wider animate-pulse">
          {{ L.battle.placed(getCard(b.selectedCard)?.name ?? '') }}
        </span>
        <button @click="store.battle.selectedCard = null"
                class="text-[10px] text-game-text-muted hover:text-red-400 font-cinzel">
          {{ L.battle.cancelSelect }}
        </button>
      </template>
      <template v-else-if="b.currentTurn === 'player' && b.phase === 'playing'">
        <span class="text-[10px] font-cinzel text-game-text-muted tracking-wider">
          {{ L.battle.selectCard }}
        </span>
      </template>
    </div>

    <!-- Player hand -->
    <div class="flex-shrink-0 px-3 pb-2 pt-1">
      <div class="flex gap-1.5 justify-center min-h-[60px] items-center">
        <div
          v-for="(cardId, i) in b.playerHand"
          :key="i"
          class="cursor-pointer"
          @click="handleCardSelect(cardId)"
        >
          <CardItem
            :card="getCard(cardId)"
            :size="cardSize"
            owner="player"
            :selected="b.selectedCard === cardId"
          />
        </div>
      </div>

      <!-- Player label -->
      <div class="text-center mt-1">
        <span class="font-cinzel text-blue-400 text-[10px] tracking-widest uppercase">
          {{ L.battle.yourHand }}
        </span>
      </div>
    </div>

    <!-- Give-up button -->
    <div class="flex-shrink-0 text-center pb-2">
      <button @click="confirmForfeit = true"
              class="text-[10px] font-cinzel text-game-text-muted hover:text-red-400 transition-colors tracking-wider">
        {{ L.battle.forfeit }}
      </button>
    </div>

    <!-- Forfeit confirm -->
    <div v-if="confirmForfeit" class="overlay-backdrop" @click.self="confirmForfeit = false">
      <div class="bg-game-surface border border-game-border rounded-xl p-6 mx-4 text-center max-w-xs">
        <p class="heading-gold text-base mb-2">{{ L.battle.confirmForfeit }}</p>
        <p class="text-game-text-dim text-xs mb-5 font-noto">{{ L.battle.forfeitWarning }}</p>
        <div class="flex gap-3 justify-center">
          <button class="btn-crimson text-xs" @click="forfeit">{{ L.battle.forfeit }}</button>
          <button class="btn-gold text-xs" @click="confirmForfeit = false">{{ L.battle.continueFight }}</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCard } from '../data/cards.js'
import {
  store,
  getCurrentNpc,
  selectBattleCard,
  placeCard,
  exitBattle,
} from '../store/gameStore.js'
import CardItem from './CardItem.vue'
import L from '../i18n/index.js'

const npc            = computed(() => getCurrentNpc())
const b              = computed(() => store.battle)

// Live scores: count board cells per owner
const livePlayerScore = computed(() =>
  b.value?.board.filter(c => c?.owner === 'player').length ?? 0
)
const liveEnemyScore = computed(() =>
  b.value?.board.filter(c => c?.owner === 'enemy').length ?? 0
)
const confirmForfeit = ref(false)

const enemyPlaced = computed(() => {
  if (!b.value) return 0
  return b.value.board.filter(c => c?.owner === 'enemy').length
})

// ── Responsive sizing ──
const cardSize     = ref('sm')
const cardSizeStyle = computed(() => {
  const s = { xs: '48px', sm: '62px', md: '80px', lg: '96px' }
  return { width: s[cardSize.value], height: s[cardSize.value] }
})

const boardStyle = computed(() => ({
  width: '100%',
  maxWidth: '340px',
}))
const cellStyle = computed(() => ({
  aspectRatio: '4/5',
}))

onMounted(() => {
  updateSizing()
  window.addEventListener('resize', updateSizing)
})

function updateSizing() {
  const vw = window.innerWidth
  const vh = window.innerHeight
  // Available height for board area (subtract header ~110px, hands ~120px, indicators ~60px)
  const boardH = vh - 300
  // Each cell: boardH/3
  const cellH = boardH / 3
  if (cellH >= 90)      cardSize.value = 'md'
  else if (cellH >= 70) cardSize.value = 'sm'
  else                  cardSize.value = 'xs'
}

// ── Interaction ──
function canPlace(idx) {
  return (
    b.value?.phase === 'playing' &&
    b.value?.currentTurn === 'player' &&
    b.value?.selectedCard !== null &&
    b.value?.board[idx] === null
  )
}

function handleCardSelect(cardId) {
  if (b.value?.currentTurn !== 'player') return
  selectBattleCard(cardId)
}

function handleCellClick(idx) {
  if (!canPlace(idx)) return
  placeCard(idx)
}

function forfeit() {
  confirmForfeit.value = false
  exitBattle()
}
</script>
