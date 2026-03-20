<template>
  <div class="panel-scroll h-full px-4 py-4 sm:px-6 sm:py-6">

    <!-- Title -->
    <div class="text-center mb-6">
      <h1 class="heading-gold text-2xl sm:text-3xl font-bold mb-1">{{ L.map.title }}</h1>
      <p class="text-game-text-dim text-xs sm:text-sm font-cinzel tracking-widest uppercase">
        {{ L.map.subtitle }}
      </p>
      <div class="gold-divider mt-3 max-w-xs mx-auto" />
    </div>

    <!-- Progress bar -->
    <div class="max-w-md mx-auto mb-6 text-center">
      <p class="text-game-text-dim text-xs font-cinzel mb-2 tracking-wider">
        {{ L.map.conquered(store.defeatedBosses.length) }}
      </p>
      <div class="h-1.5 rounded-full bg-game-elevated overflow-hidden">
        <div class="h-full rounded-full transition-all duration-700"
             style="background: linear-gradient(to right, #7a6318, #d4af37);"
             :style="{ width: (store.defeatedBosses.length / 9 * 100) + '%' }" />
      </div>
    </div>

    <!-- Region grid -->
    <div class="grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto pb-4">
      <div
        v-for="region in REGIONS"
        :key="region.id"
        class="region-tile"
        :class="{
          locked:       !isRegionUnlocked(region.id),
          'boss-cleared': isBossDefeated(region.id),
        }"
        @click="handleRegionClick(region)"
      >
        <!-- Background gradient layer -->
        <div class="absolute inset-0 opacity-30 pointer-events-none"
             :style="{ background: `radial-gradient(ellipse at 30% 30%, ${region.color}, transparent 70%)` }" />

        <div class="relative p-3 sm:p-4 flex flex-col gap-1">

          <!-- Level + icon row -->
          <div class="flex items-center justify-between">
            <span class="font-cinzel text-game-gold-dim text-[10px] sm:text-xs tracking-widest">
              {{ L.map.level(region.level) }}
            </span>
            <span class="text-base sm:text-xl">
              <template v-if="isBossDefeated(region.id)">👑</template>
              <template v-else-if="!isRegionUnlocked(region.id)">🔒</template>
              <template v-else>{{ region.icon }}</template>
            </span>
          </div>

          <!-- Name -->
          <div class="font-noto font-semibold text-game-text text-sm sm:text-base leading-tight">
            {{ region.nameEn }}
          </div>
          <div class="font-cinzel text-game-text-dim text-[9px] sm:text-[11px] tracking-wider">
            {{ region.name }}
          </div>

          <!-- NPC completion dots -->
          <div class="flex gap-1 mt-1">
            <div v-for="(npc, i) in region.npcs" :key="i"
                 class="h-1.5 flex-1 rounded-full"
                 :class="isNpcDefeated(region.id, i)
                   ? 'bg-game-gold'
                   : (npc.type === 'boss' ? 'bg-red-900' : 'bg-game-border')"
            />
          </div>

        </div>
      </div>
    </div>

    <!-- Hint text -->
    <p class="text-center text-game-text-muted text-xs font-cinzel tracking-wider mt-2 pb-2">
      {{ L.map.unlockHint }}
    </p>

  </div>
</template>

<script setup>
import { REGIONS }  from '../data/regions.js'
import { store, isRegionUnlocked, isBossDefeated, isNpcDefeated, goToTown } from '../store/gameStore.js'
import L from '../i18n/index.js'

function handleRegionClick(region) {
  if (!isRegionUnlocked(region.id)) return
  goToTown(region.id)
}
</script>
