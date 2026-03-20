<template>
  <div v-if="region" class="panel-scroll h-full px-4 py-4 sm:px-6 sm:py-6">

    <!-- Back + title -->
    <div class="flex items-center gap-3 mb-5">
      <button @click="store.currentView = 'worldmap'"
              class="text-game-text-dim hover:text-game-gold transition-colors text-lg">←</button>
      <div>
        <div class="flex items-center gap-2">
          <span class="text-xl">{{ region.icon }}</span>
          <h2 class="heading-gold text-xl sm:text-2xl font-bold">{{ region.nameEn }}</h2>
          <span class="font-cinzel text-game-gold-dim text-xs tracking-widest ml-1">
            {{ L.map.level(region.level) }}
          </span>
        </div>
        <p class="font-cinzel text-game-text-dim text-[11px] tracking-wider">{{ region.name }}</p>
      </div>
    </div>

    <div class="gold-divider mb-5" />

    <!-- NPC cards -->
    <h3 class="heading-gold text-sm tracking-widest uppercase mb-3">{{ L.town.challengers }}</h3>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
      <div
        v-for="npc in region.npcs"
        :key="npc.id"
        class="npc-card"
        :class="{
          boss:     npc.type === 'boss',
          defeated: isNpcDefeated(region.id, npc.id),
        }"
        @click="handleNpcClick(npc)"
      >
        <!-- Header row -->
        <div class="flex items-start justify-between mb-2">
          <div>
            <div class="font-cinzel text-game-gold-dim text-[10px] tracking-widest uppercase mb-0.5">
              {{ npc.type === 'boss' ? L.town.lordType : L.town.villagerType }}
            </div>
            <div class="font-cinzel text-game-text font-semibold text-sm sm:text-base">
              {{ npc.nameEn ?? npc.name }}
            </div>
          </div>
          <div class="flex flex-col items-end gap-0.5">
            <span class="text-lg">{{ npc.type === 'boss' ? '👑' : '⚔' }}</span>
            <span v-if="isNpcDefeated(region.id, npc.id)"
                  class="text-game-gold text-[10px] font-cinzel">{{ L.town.defeated }}</span>
          </div>
        </div>

        <!-- Deck power preview: show tier distribution -->
        <div class="flex items-center gap-1 mb-3">
          <span class="text-game-text-dim text-[10px] font-cinzel">{{ L.town.deck }}:</span>
          <div v-for="cardId in npc.deckIds" :key="cardId" class="flex gap-px">
            <div class="w-4 h-1.5 rounded-sm"
                 :style="{ background: tierGradient(cardId) }" />
          </div>
        </div>

        <!-- Loot hint -->
        <div class="text-[10px] font-cinzel tracking-wider"
             :class="npc.type === 'boss' ? 'text-game-gold' : 'text-game-text-dim'">
          {{ npc.type === 'boss' ? L.town.bossReward(bossCoins) : L.town.normalReward(villagerCoins) }}
        </div>

        <!-- Battle button -->
        <button class="mt-3 w-full btn-gold text-xs py-1.5" @click.stop="handleNpcClick(npc)">
          {{ isNpcDefeated(region.id, npc.id) ? L.town.rematch : L.town.challenge }}
        </button>
      </div>
    </div>

    <!-- Hint about boss unlock -->
    <div v-if="!isBossDefeated(region.id) && region.id < 8"
         class="mt-6 text-center text-game-text-muted text-xs font-cinzel tracking-wider">
      {{ L.town.defeatLord }}
    </div>
    <div v-else-if="isBossDefeated(region.id) && region.id < 8"
         class="mt-6 text-center text-game-gold text-xs font-cinzel tracking-wider animate-glow-pulse">
      {{ L.town.nextUnlocked(REGIONS[region.id + 1].nameEn) }}
    </div>
    <div v-else-if="isBossDefeated(region.id) && region.id === 8"
         class="mt-6 text-center text-game-gold text-sm font-cinzel tracking-widest animate-glow-pulse">
      {{ L.town.allConquered }}
    </div>

    <div class="gold-divider my-6" />

    <!-- Traveling Merchant -->
    <div class="max-w-2xl">
      <div class="flex items-center justify-between mb-3">
        <div>
          <h3 class="heading-gold text-sm tracking-widest uppercase">{{ L.town.merchant }}</h3>
          <p class="font-cinzel text-game-text-dim text-[11px] mt-0.5">{{ L.town.merchantDesc }}</p>
        </div>
        <div class="text-right flex-shrink-0 ml-4">
          <div class="font-cinzel text-game-gold text-sm font-bold">{{ store.coins }} 🪙</div>
          <div class="font-cinzel text-game-text-muted text-[10px]">{{ L.app.coins }}</div>
        </div>
      </div>
      <button class="btn-gold text-xs px-5 py-2" @click="showShop = true">
        {{ L.town.visitShop }}
      </button>
    </div>

    <!-- Shop modal -->
    <ShopPanel v-if="showShop" @close="showShop = false" />

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { REGIONS }   from '../data/regions.js'
import { getCard }   from '../data/cards.js'
import {
  store,
  getCurrentRegion,
  isNpcDefeated,
  isBossDefeated,
  goToDeckBuilder,
} from '../store/gameStore.js'
import ShopPanel from './ShopPanel.vue'
import L from '../i18n/index.js'

const region       = computed(() => getCurrentRegion())
const showShop     = ref(false)
const villagerCoins = computed(() => 2 + (region.value?.id ?? 0) * 2)
const bossCoins     = computed(() => 5 + (region.value?.id ?? 0) * 2)

function tierGradient(cardId) {
  const card = getCard(cardId)
  if (!card) return '#1e2d4a'
  const t = card.tier
  const colors = ['#2d5a3a','#2a4a6a','#4a2a6a','#3a5a4a','#2a5a7a','#4a3a6a','#6a3a2a','#7a4a1a','#8a6a1a']
  return colors[t - 1] ?? '#1e2d4a'
}

function handleNpcClick(npc) {
  goToDeckBuilder(npc.id)
}
</script>
