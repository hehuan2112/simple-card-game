<template>
  <div class="panel-scroll h-full px-4 py-4 sm:px-6 sm:py-6">

    <!-- Header -->
    <div class="flex items-center gap-3 mb-5">
      <button @click="backFromCollection()"
              class="text-game-text-dim hover:text-game-gold transition-colors text-lg">←</button>
      <div>
        <h2 class="heading-gold text-xl sm:text-2xl font-bold">{{ L.collection.title }}</h2>
        <p class="font-cinzel text-game-text-dim text-[11px] tracking-wider">
          {{ L.collection.subtitle(uniqueOwned) }}
        </p>
      </div>
    </div>

    <div class="gold-divider mb-4" />

    <!-- Progress -->
    <div class="mb-5 max-w-md">
      <div class="h-1.5 rounded-full bg-game-elevated overflow-hidden">
        <div class="h-full rounded-full transition-all duration-700"
             style="background: linear-gradient(to right, #7a6318, #d4af37);"
             :style="{ width: (uniqueOwned / 100 * 100) + '%' }" />
      </div>
    </div>

    <!-- Filter row -->
    <div class="flex items-center gap-2 mb-4 flex-wrap">
      <button v-for="f in filters" :key="f.value"
              class="px-2 py-0.5 rounded text-[10px] font-cinzel tracking-wider border transition-colors"
              :class="activeFilter === f.value
                ? 'border-game-gold text-game-gold bg-game-elevated'
                : 'border-game-border text-game-text-muted hover:border-game-gold-dim'"
              @click="activeFilter = f.value">
        {{ f.label }}
      </button>

      <!-- Tier filter -->
      <div class="flex items-center gap-1 ml-auto">
        <button v-for="t in [0,1,2,3,4,5,6,7,8,9]" :key="t"
                class="w-5 h-5 rounded text-[9px] font-cinzel border transition-colors"
                :class="activeTier === t
                  ? 'border-game-gold text-game-gold bg-game-elevated'
                  : 'border-game-border text-game-text-muted hover:border-game-gold-dim'"
                @click="activeTier = t">
          {{ t === 0 ? '∞' : t }}
        </button>
      </div>
    </div>

    <!-- Card grid — ALL 100 cards, dimmed if not owned -->
    <div class="grid gap-3 pb-6"
         style="grid-template-columns: repeat(auto-fill, minmax(82px, 1fr));">
      <div
        v-for="card in filteredCards"
        :key="card.id"
        class="flex flex-col items-center gap-1 group cursor-default"
        @click="selectCard(card)"
      >
        <div class="relative">
          <CardItem
            :card="card"
            size="md"
            :owner="isOwned(card.id) ? 'player' : null"
            :disabled="!isOwned(card.id)"
            :class="{ 'cursor-pointer': isOwned(card.id) }"
          />
          <!-- Count badge for duplicates -->
          <div v-if="countOwned(card.id) > 1"
               class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-game-gold text-game-bg
                      text-[9px] font-bold flex items-center justify-center">
            {{ countOwned(card.id) }}
          </div>
        </div>
        <span class="text-[9px] font-cinzel text-center leading-tight max-w-[82px] truncate transition-colors"
              :class="isOwned(card.id) ? 'text-game-text-dim group-hover:text-game-text' : 'text-game-text-muted'">
          {{ card.name }}
        </span>
      </div>
    </div>

    <!-- Card detail modal -->
    <div v-if="selectedCard" class="overlay-backdrop" @click.self="selectedCard = null">
      <div class="bg-game-surface border border-game-border rounded-2xl p-6 max-w-xs w-full mx-4 text-center">
        <div class="flex justify-center mb-4">
          <CardItem :card="selectedCard" size="xl" :owner="isOwned(selectedCard.id) ? 'player' : null" />
        </div>
        <h3 class="heading-gold text-lg font-bold mb-0.5">{{ selectedCard.name }}</h3>
        <p class="font-cinzel text-game-text-dim text-xs mb-3">{{ selectedCard.nameZh }}</p>

        <div class="grid grid-cols-3 gap-2 text-center mb-3">
          <div>
            <div class="text-[10px] text-game-text-muted font-cinzel">Up</div>
            <div class="font-mono font-bold text-game-text" :class="selectedCard.up === 'A' ? 'text-game-gold' : ''">
              {{ selectedCard.up }}
            </div>
          </div>
          <div>
            <div class="text-[10px] text-game-text-muted font-cinzel">L / R</div>
            <div class="font-mono font-bold text-game-text">
              <span :class="selectedCard.left === 'A' ? 'text-game-gold' : ''">{{ selectedCard.left }}</span>
              /
              <span :class="selectedCard.right === 'A' ? 'text-game-gold' : ''">{{ selectedCard.right }}</span>
            </div>
          </div>
          <div>
            <div class="text-[10px] text-game-text-muted font-cinzel">Down</div>
            <div class="font-mono font-bold text-game-text" :class="selectedCard.down === 'A' ? 'text-game-gold' : ''">
              {{ selectedCard.down }}
            </div>
          </div>
        </div>

        <div class="flex items-center justify-center gap-3 text-xs font-cinzel mb-4">
          <span class="text-game-text-dim">Tier {{ selectedCard.tier }}</span>
          <span v-if="selectedCard.element" class="text-game-text">
            {{ ELEMENT_LABELS[selectedCard.element]?.emoji }}
            {{ ELEMENT_LABELS[selectedCard.element]?.en }}
          </span>
          <span v-else class="text-game-text-muted">No Element</span>
        </div>

        <div class="text-xs font-cinzel text-game-text-muted mb-4">
          Owned: {{ countOwned(selectedCard.id) }}
        </div>

        <button class="btn-gold w-full text-xs" @click="selectedCard = null">
          {{ L.collection.close }}
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ALL_CARDS, ELEMENT_LABELS } from '../data/cards.js'
import { store, backFromCollection } from '../store/gameStore.js'
import CardItem from './CardItem.vue'
import L from '../i18n/index.js'

const activeFilter = ref('all')
const activeTier   = ref(0)
const selectedCard = ref(null)

const filters = computed(() => [
  { value: 'all',   label: L.collection.filterAll },
  { value: 'fire',  label: L.elements.fire.emoji  + ' ' + L.elements.fire.name },
  { value: 'water', label: L.elements.water.emoji + ' ' + L.elements.water.name },
  { value: 'wind',  label: L.elements.wind.emoji  + ' ' + L.elements.wind.name },
  { value: 'earth', label: L.elements.earth.emoji + ' ' + L.elements.earth.name },
  { value: 'ice',   label: L.elements.ice.emoji   + ' ' + L.elements.ice.name },
  { value: 'none',  label: 'No Element' },
])

const ownedSet = computed(() => new Set(store.cardLibrary))

function isOwned(id)   { return ownedSet.value.has(id) }
function countOwned(id) {
  return store.cardLibrary.filter(i => i === id).length
}

const uniqueOwned = computed(() => {
  return new Set(store.cardLibrary).size
})

const filteredCards = computed(() => {
  let cards = [...ALL_CARDS]
  if (activeFilter.value !== 'all') {
    const f = activeFilter.value === 'none' ? null : activeFilter.value
    cards = cards.filter(c => c.element === f)
  }
  if (activeTier.value !== 0) {
    cards = cards.filter(c => c.tier === activeTier.value)
  }
  return cards
})

function selectCard(card) {
  selectedCard.value = selectedCard.value?.id === card.id ? null : card
}
</script>
