<template>
  <div class="panel-scroll h-full px-4 py-4 sm:px-6 sm:py-6">

    <!-- Header -->
    <div class="flex items-center gap-3 mb-5">
      <button @click="store.currentView = 'town'"
              class="text-game-text-dim hover:text-game-gold transition-colors text-lg">←</button>
      <div>
        <h2 class="heading-gold text-xl sm:text-2xl font-bold">{{ L.deck.title }}</h2>
        <p class="font-cinzel text-game-text-dim text-[11px] tracking-wider">
          {{ L.deck.vs }} {{ npc?.nameEn ?? npc?.name }} · {{ npc?.titleEn ?? npc?.title }}
        </p>
      </div>
    </div>

    <div class="gold-divider mb-4" />

    <!-- Selection counter + CTA -->
    <div class="flex items-center justify-between mb-4 gap-3 flex-wrap">
      <div class="flex items-center gap-2">
        <span class="font-cinzel text-game-text-dim text-sm">{{ L.deck.selected }}:</span>
        <div class="flex gap-1">
          <div v-for="i in 5" :key="i"
               class="w-6 h-6 rounded border flex items-center justify-center text-xs font-mono transition-all"
               :class="selected.length >= i
                 ? 'border-game-gold bg-game-gold text-game-bg font-bold'
                 : 'border-game-border text-game-text-muted'">
            {{ selected.length >= i ? '✓' : i }}
          </div>
        </div>
      </div>
      <button class="btn-gold text-xs px-4 py-1.5"
              :disabled="selected.length !== 5"
              @click="handleStart">
        {{ selected.length === 5 ? L.deck.start : L.deck.selectMore(5 - selected.length) }}
      </button>
    </div>

    <!-- Selected deck preview -->
    <div v-if="selected.length > 0" class="mb-4">
      <p class="text-game-text-muted text-[10px] font-cinzel tracking-widest uppercase mb-2">
        {{ L.deck.preview }}
      </p>
      <div class="flex gap-2 flex-wrap">
        <div v-for="cardId in selected" :key="cardId"
             class="relative group cursor-pointer"
             @click="toggleCard(cardId)">
          <CardItem :card="getCard(cardId)" size="sm" owner="player" />
          <div class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-800 text-white
                      text-[9px] flex items-center justify-center opacity-0 group-hover:opacity-100
                      transition-opacity font-bold">✕</div>
        </div>
      </div>
    </div>

    <div class="gold-divider mb-4" />

    <!-- Filter + sort row -->
    <div class="flex items-center gap-2 mb-4 flex-wrap">
      <button v-for="f in filters" :key="f.value"
              class="px-2 py-0.5 rounded text-[10px] font-cinzel tracking-wider border transition-colors"
              :class="activeFilter === f.value
                ? 'border-game-gold text-game-gold bg-game-elevated'
                : 'border-game-border text-game-text-muted hover:border-game-gold-dim hover:text-game-text'"
              @click="activeFilter = f.value">
        {{ f.label }}
      </button>
      <button class="ml-auto text-[10px] font-cinzel text-game-text-dim hover:text-game-gold transition-colors"
              @click="sortMode = sortMode === 'tier' ? 'id' : 'tier'">
        {{ sortMode === 'tier' ? L.deck.sortTier : L.deck.sortId }}
      </button>
    </div>

    <!-- Card grid -->
    <div v-if="filteredCards.length > 0"
         class="grid gap-3 pb-6"
         style="grid-template-columns: repeat(auto-fill, minmax(82px, 1fr));">
      <div v-for="card in filteredCards" :key="card.id"
           class="flex flex-col items-center gap-1 cursor-pointer group"
           @click="toggleCard(card.id)">
        <CardItem
          :card="card"
          size="md"
          :owner="isSelected(card.id) ? 'player' : null"
          :selected="isSelected(card.id)"
        />
        <span class="text-[9px] font-cinzel text-center leading-tight max-w-[82px] truncate
                     text-game-text-dim group-hover:text-game-text transition-colors">
          {{ card.name }}
        </span>
      </div>
    </div>

    <div v-else class="text-center py-12 text-game-text-muted font-cinzel text-sm">
      {{ L.deck.noCards }}
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getCard, ELEMENT_LABELS } from '../data/cards.js'
import { store, getCurrentNpc, startBattle } from '../store/gameStore.js'
import CardItem from './CardItem.vue'
import L from '../i18n/index.js'

const npc = computed(() => getCurrentNpc())

// ── Selection ──
const selected = ref([])

function isSelected(id) { return selected.value.includes(id) }

function toggleCard(id) {
  if (isSelected(id)) {
    selected.value = selected.value.filter(i => i !== id)
  } else if (selected.value.length < 5) {
    selected.value.push(id)
  }
}

// ── Filtering / sorting ──
const activeFilter = ref('all')
const sortMode     = ref('tier')

const filters = computed(() => [
  { value: 'all',   label: L.deck.filters.all },
  { value: 'fire',  label: L.deck.filters.fire },
  { value: 'water', label: L.deck.filters.water },
  { value: 'wind',  label: L.deck.filters.wind },
  { value: 'earth', label: L.deck.filters.earth },
  { value: 'ice',   label: L.deck.filters.ice },
  { value: 'none',  label: L.deck.filters.none },
])

const ownedCards = computed(() => {
  const ids = [...new Set(store.cardLibrary)]
  return ids.map(id => getCard(id)).filter(Boolean)
})

const filteredCards = computed(() => {
  let cards = [...ownedCards.value]
  if (activeFilter.value !== 'all') {
    const f = activeFilter.value === 'none' ? null : activeFilter.value
    cards = cards.filter(c => c.element === f)
  }
  cards.sort(sortMode.value === 'tier'
    ? (a, b) => b.tier - a.tier || b.id - a.id
    : (a, b) => a.id - b.id)
  return cards
})

// ── Start ──
function handleStart() {
  if (selected.value.length !== 5) return
  startBattle([...selected.value])
}
</script>
