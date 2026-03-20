<template>
  <div class="overlay-backdrop" @click.self="$emit('close')">
    <div class="bg-game-surface border border-game-gold rounded-2xl p-5 max-w-sm w-full mx-4"
         style="max-height: 90vh; overflow-y: auto;">

      <!-- Header -->
      <div class="flex items-start justify-between mb-1">
        <div>
          <h2 class="heading-gold text-lg font-bold">{{ L.shop.title }}</h2>
          <p class="font-cinzel text-game-text-dim text-[11px] tracking-wider">{{ L.shop.subtitle }}</p>
        </div>
        <div class="text-right ml-4">
          <div class="font-cinzel text-game-gold text-sm font-bold">
            {{ L.shop.balance(store.coins) }}
          </div>
        </div>
      </div>

      <div class="gold-divider my-3" />

      <h3 class="font-cinzel text-game-text-dim text-[10px] tracking-widest uppercase mb-3">
        {{ L.shop.stockTitle }}
      </h3>

      <!-- Stock list -->
      <div v-if="store.merchantStock.length > 0" class="flex flex-col gap-2">
        <div
          v-for="item in store.merchantStock"
          :key="item.cardId"
          class="flex items-center gap-3 p-2.5 rounded-xl border transition-colors"
          :class="item.purchased
            ? 'border-game-gold bg-game-elevated opacity-70'
            : 'border-game-border hover:border-game-gold-dim'"
        >
          <!-- Card preview -->
          <CardItem
            :card="getCard(item.cardId)"
            size="sm"
            :owner="item.purchased ? 'player' : null"
          />

          <!-- Card info -->
          <div class="flex-1 min-w-0">
            <div class="font-cinzel text-game-text text-xs font-semibold truncate">
              {{ getCard(item.cardId)?.name }}
            </div>
            <div class="font-cinzel text-game-text-muted text-[10px]">
              {{ L.shop.tierLabel(getCard(item.cardId)?.tier) }}
            </div>
          </div>

          <!-- Price + buy -->
          <div class="flex flex-col items-end gap-1 flex-shrink-0">
            <span class="font-cinzel text-game-gold text-xs font-bold">
              {{ L.shop.price(item.price) }}
            </span>
            <button
              v-if="!item.purchased"
              class="text-[10px] font-cinzel px-2.5 py-0.5 rounded border transition-colors"
              :class="store.coins >= item.price
                ? 'border-game-gold text-game-gold hover:bg-game-gold hover:text-game-bg cursor-pointer'
                : 'border-game-border text-game-text-muted cursor-not-allowed opacity-50'"
              :disabled="store.coins < item.price"
              @click="handleBuy(item)"
            >
              {{ store.coins >= item.price ? L.shop.buy : L.shop.needMore }}
            </button>
            <span v-else class="text-[10px] font-cinzel text-game-gold">
              {{ L.shop.purchased }}
            </span>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-8 font-cinzel text-game-text-muted text-sm">
        {{ L.shop.empty }}
      </div>

      <div class="gold-divider my-3" />

      <p class="text-center text-[10px] font-cinzel text-game-text-muted mb-3">
        {{ L.shop.refreshHint }}
      </p>

      <button class="btn-gold w-full text-xs" @click="$emit('close')">
        {{ L.shop.close }}
      </button>

    </div>
  </div>
</template>

<script setup>
import { getCard } from '../data/cards.js'
import { store, buyCard } from '../store/gameStore.js'
import CardItem from './CardItem.vue'
import L from '../i18n/index.js'

defineEmits(['close'])

function handleBuy(item) {
  if (item.purchased || store.coins < item.price) return
  buyCard(item.cardId)
}
</script>
