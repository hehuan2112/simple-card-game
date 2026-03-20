<template>
  <div class="overlay-backdrop">
    <div class="relative max-w-sm w-full mx-4 animate-fade-up">

      <!-- Glow ring -->
      <div class="absolute -inset-1 rounded-2xl opacity-30 blur-lg pointer-events-none"
           :style="{ background: glowColor }" />

      <div class="relative bg-game-surface border rounded-2xl p-6 text-center overflow-hidden"
           :style="{ borderColor: borderColor }">

        <!-- Background shimmer for win -->
        <div v-if="result.winner === 'player'"
             class="absolute inset-0 pointer-events-none opacity-5"
             style="background: linear-gradient(105deg, transparent 40%, rgba(212,175,55,0.8) 50%, transparent 60%);
                    background-size: 200% 100%;
                    animation: shimmer 2.5s linear infinite;" />

        <!-- Icon + result text -->
        <div class="text-5xl mb-3">{{ resultIcon }}</div>
        <h2 class="heading-gold text-2xl font-bold mb-1">{{ resultTitle }}</h2>
        <p class="font-cinzel text-game-text-dim text-xs tracking-widest mb-4">
          {{ resultSubtitle }}
        </p>

        <!-- Score bar -->
        <div class="flex items-center gap-3 mb-5">
          <div class="flex-1 text-right">
            <div class="font-cinzel text-blue-400 text-xl font-bold">{{ result.playerScore }}</div>
            <div class="text-[10px] text-game-text-muted font-cinzel">{{ L.result.you }}</div>
          </div>
          <div class="font-cinzel text-game-text-muted text-sm">vs</div>
          <div class="flex-1 text-left">
            <div class="font-cinzel text-red-400 text-xl font-bold">{{ result.enemyScore }}</div>
            <div class="text-[10px] text-game-text-muted font-cinzel">{{ result.npcName }}</div>
          </div>
        </div>

        <!-- Score visual bar -->
        <div class="flex h-2 rounded-full overflow-hidden mb-5 gap-px">
          <div class="transition-all duration-1000 rounded-l-full"
               style="background: #3498db;"
               :style="{ flexGrow: result.playerScore }" />
          <div class="transition-all duration-1000 rounded-r-full"
               style="background: #c0392b;"
               :style="{ flexGrow: result.enemyScore }" />
        </div>

        <!-- Coins earned -->
        <div v-if="result.coinsEarned > 0"
             class="mb-3 font-cinzel text-game-gold text-sm animate-fade-up">
          {{ L.result.coinsEarned(result.coinsEarned) }}
        </div>

        <!-- Loot section -->
        <div v-if="result.winner === 'player' && result.loot?.length > 0" class="mb-5">
          <div class="gold-divider mb-3" />
          <p class="font-cinzel text-game-gold text-xs tracking-widest uppercase mb-3">
            {{ result.npcType === 'boss' ? L.result.allCards : L.result.cardReward }}
          </p>
          <div class="flex gap-2 justify-center flex-wrap">
            <div v-for="(cardId, i) in result.loot" :key="i"
                 class="flex flex-col items-center gap-1 animate-fade-up"
                 :style="{ animationDelay: `${i * 0.1}s` }">
              <CardItem :card="getCard(cardId)" size="md" owner="player" />
              <span class="text-[9px] font-cinzel text-game-gold max-w-[80px] text-center truncate">
                {{ getCard(cardId)?.name }}
              </span>
            </div>
          </div>
        </div>

        <div class="gold-divider mb-4" />

        <!-- Action buttons -->
        <div class="flex flex-col gap-2">
          <button class="btn-gold w-full" @click="handleReturn">
            {{ L.result.returnTown }}
          </button>
          <button class="btn-crimson w-full text-xs" @click="handleRetry">
            {{ L.result.rematch }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getCard }  from '../data/cards.js'
import { store, exitBattle, retryBattle } from '../store/gameStore.js'
import CardItem from './CardItem.vue'
import L from '../i18n/index.js'

const result = computed(() => store.lastResult ?? {})
const b      = computed(() => store.battle)

const glowColor = computed(() => {
  if (result.value.winner === 'player') return 'rgba(212,175,55,0.8)'
  if (result.value.winner === 'enemy')  return 'rgba(192,57,43,0.8)'
  return 'rgba(100,100,100,0.5)'
})

const borderColor = computed(() => {
  if (result.value.winner === 'player') return 'rgba(212,175,55,0.5)'
  if (result.value.winner === 'enemy')  return 'rgba(192,57,43,0.4)'
  return 'rgba(100,100,100,0.3)'
})

const resultIcon = computed(() => {
  if (result.value.winner === 'player') return result.value.npcType === 'boss' ? '👑' : '🏆'
  if (result.value.winner === 'enemy')  return '💀'
  return '🤝'
})

const resultTitle = computed(() => {
  if (result.value.winner === 'player') return result.value.npcType === 'boss' ? L.result.bossVictory : L.result.victory
  if (result.value.winner === 'enemy')  return L.result.defeat
  return L.result.draw
})

const resultSubtitle = computed(() => {
  if (result.value.winner === 'player')
    return result.value.npcType === 'boss' ? L.result.hintBoss : L.result.hintVictory
  if (result.value.winner === 'enemy')  return L.result.hintDefeat
  return L.result.hintDraw
})

function handleReturn() { exitBattle() }
function handleRetry()  { retryBattle() }
</script>
