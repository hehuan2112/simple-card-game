<template>
  <div class="game-shell">

    <!-- ── Header ── -->
    <header class="flex items-center justify-between px-4 py-3 border-b border-game-border flex-shrink-0"
            style="background: rgba(5,8,17,0.9); backdrop-filter: blur(8px);">

      <!-- Title -->
      <button @click="goHome" class="group flex flex-col leading-none">
        <span class="font-cinzel text-game-gold font-bold tracking-widest text-sm sm:text-base">
          {{ L.app.gameTitle }}
        </span>
        <span class="font-cinzel text-game-text-dim text-[9px] sm:text-[11px] tracking-widest uppercase">
          {{ L.app.gameSubtitle }}
        </span>
      </button>

      <!-- Breadcrumb -->
      <div class="hidden sm:flex items-center gap-2 text-xs text-game-text-dim font-cinzel tracking-widest uppercase">
        <template v-if="store.currentView === 'town' && currentRegion">
          <button @click="store.currentView = 'worldmap'" class="hover:text-game-gold transition-colors">
            {{ L.app.navMap }}
          </button>
          <span class="text-game-gold-dim">›</span>
          <span class="text-game-text">{{ currentRegion.nameEn }}</span>
        </template>
        <template v-else-if="store.currentView === 'deckbuilder'">
          <button @click="store.currentView = 'town'" class="hover:text-game-gold transition-colors">
            {{ currentRegion?.nameEn ?? 'Town' }}
          </button>
          <span class="text-game-gold-dim">›</span>
          <span class="text-game-text">{{ L.app.navDeck }}</span>
        </template>
        <template v-else-if="store.currentView === 'battle'">
          <span class="text-game-gold animate-glow-pulse">{{ L.app.inBattle }}</span>
        </template>
        <template v-else-if="store.currentView === 'collection'">
          <span class="text-game-text">{{ L.collection.title }}</span>
        </template>
      </div>

      <!-- Right controls -->
      <div class="flex items-center gap-3">

        <!-- Coin balance -->
        <div class="flex items-center gap-1 text-game-gold text-xs font-cinzel tracking-wider"
             :title="L.app.coinsHint">
          <span>🪙</span>
          <span class="font-bold">{{ store.coins }}</span>
        </div>

        <!-- Card count / collection toggle -->
        <button @click="toggleCollection"
                class="flex items-center gap-1.5 text-game-text-dim hover:text-game-gold transition-colors text-xs font-cinzel tracking-wider"
                :title="L.app.collectionHint">
          <span class="text-base">🃏</span>
          <span>{{ store.cardLibrary.length }}</span>
          <span class="hidden sm:inline text-[9px] text-game-text-muted">{{ L.app.cards }}</span>
        </button>

        <!-- Reset (small gear icon) -->
        <button @click="confirmReset"
                class="text-game-text-muted hover:text-red-400 transition-colors text-sm"
                :title="L.app.reset">⚙</button>
      </div>
    </header>

    <!-- ── Main view area ── -->
    <main class="flex-1 overflow-hidden relative">
      <Transition name="fade" mode="out-in">

        <WorldMap    v-if="store.currentView === 'worldmap'"    key="worldmap" />
        <TownPanel   v-else-if="store.currentView === 'town'"   key="town" />
        <DeckBuilder v-else-if="store.currentView === 'deckbuilder'" key="deckbuilder" />
        <BattleBoard v-else-if="store.currentView === 'battle'" key="battle" />
        <CardCollection v-else-if="store.currentView === 'collection'" key="collection" />

      </Transition>
    </main>

    <!-- ── Result dialog (overlays everything) ── -->
    <ResultDialog v-if="store.battle?.phase === 'result'" />

    <!-- ── Reset confirm modal ── -->
    <div v-if="showResetConfirm" class="overlay-backdrop" @click.self="showResetConfirm = false">
      <div class="bg-game-surface border border-red-800 rounded-xl p-8 max-w-sm mx-4 text-center">
        <div class="text-4xl mb-4">⚠️</div>
        <p class="heading-gold text-lg mb-2">{{ L.app.resetTitle }}</p>
        <p class="text-game-text-dim text-sm mb-6">{{ L.app.resetBody }}</p>
        <div class="flex gap-4 justify-center">
          <button class="btn-crimson" @click="doReset">{{ L.app.resetConfirm }}</button>
          <button class="btn-gold" @click="showResetConfirm = false">{{ L.app.cancel }}</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { store, getCurrentRegion, goToWorldMap, goToCollection, backFromCollection, resetGame } from './store/gameStore.js'
import WorldMap     from './components/WorldMap.vue'
import TownPanel    from './components/TownPanel.vue'
import DeckBuilder  from './components/DeckBuilder.vue'
import BattleBoard  from './components/BattleBoard.vue'
import ResultDialog from './components/ResultDialog.vue'
import CardCollection from './components/CardCollection.vue'
import L from './i18n/index.js'

const currentRegion    = computed(() => getCurrentRegion())
const showResetConfirm = ref(false)

function goHome() {
  if (store.currentView === 'battle' && store.battle?.phase === 'playing') return
  goToWorldMap()
}

function toggleCollection() {
  if (store.currentView === 'collection') backFromCollection()
  else goToCollection()
}

function confirmReset() { showResetConfirm.value = true }
function doReset() {
  showResetConfirm.value = false
  resetGame()
}
</script>
