<template>
  <div
    class="game-card"
    :class="[
      elemClass,
      tierClass,
      ownerClass,
      selectedClass,
      placedClass,
      sizeClass,
      { 'opacity-30 cursor-not-allowed': disabled },
    ]"
    :style="sizeStyle"
    @click="!disabled && $emit('click')"
  >
    <!-- Element watermark -->
    <div v-if="card.element"
         class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 text-5xl select-none"
         aria-hidden="true">
      {{ ELEMENT_LABELS[card.element]?.emoji }}
    </div>

    <!-- UP value -->
    <span class="card-val a-val" :class="isA(card.up) ? 'a-val' : ''"
          :style="valPos.top">{{ card.up }}</span>

    <!-- LEFT value -->
    <span class="card-val" :class="isA(card.left) ? 'a-val' : ''"
          :style="valPos.left">{{ card.left }}</span>

    <!-- CENTER: name + element badge -->
    <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-0.5"
         :style="{ paddingTop: paddingCenter, paddingBottom: paddingCenter }">
      <span v-if="card.element"
            class="text-[8px] sm:text-[9px] font-bold rounded px-1"
            :style="{ color: ELEMENT_LABELS[card.element]?.color, opacity: 0.9 }">
        {{ ELEMENT_LABELS[card.element]?.emoji }}{{ props.lang === 'zh' ? ELEMENT_LABELS[card.element]?.zh : ELEMENT_LABELS[card.element]?.en }}
      </span>
      <span class="font-noto text-center leading-tight opacity-60 truncate max-w-full px-1"
            :style="nameStyle">
        {{ props.lang === 'en' ? card.name : card.nameZh }}
      </span>
    </div>

    <!-- RIGHT value -->
    <span class="card-val" :class="isA(card.right) ? 'a-val' : ''"
          :style="valPos.right">{{ card.right }}</span>

    <!-- DOWN value -->
    <span class="card-val" :class="isA(card.down) ? 'a-val' : ''"
          :style="valPos.bottom">{{ card.down }}</span>

    <!-- Tier badge (top-left corner) -->
    <span v-if="size !== 'xs'"
          class="absolute top-0.5 left-1 text-[7px] font-cinzel opacity-40 select-none"
          :style="{ color: TIER_COLORS[card.tier] }">
      {{ 'Ⅰ Ⅱ Ⅲ Ⅳ Ⅴ Ⅵ Ⅶ Ⅷ Ⅸ'.split(' ')[card.tier - 1] }}
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ELEMENT_LABELS, TIER_COLORS } from '../data/cards.js'

const props = defineProps({
  card:     { type: Object, required: true },
  owner:    { type: String, default: null },    // 'player' | 'enemy' | null
  selected: { type: Boolean, default: false },
  placed:   { type: Boolean, default: false },  // triggers place animation
  disabled: { type: Boolean, default: false },
  size:     { type: String,  default: 'md' },   // 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  lang:     { type: String,  default: 'en' },   // 'zh' | 'en'
})

defineEmits(['click'])

function isA(v) { return v === 'A' }

const elemClass  = computed(() => `card-elem-${props.card.element ?? 'none'}`)
const tierClass  = computed(() => props.card.tier >= 7 ? `card-tier-${props.card.tier}` : '')
const ownerClass = computed(() => props.owner ? `owner-${props.owner}` : '')
const selectedClass = computed(() => props.selected ? 'selected' : '')
const placedClass   = computed(() => props.placed   ? 'card-placed' : '')

// Size definitions: [width, height, valFontSize, valOffset, nameFontSize, centerPad]
const SIZES = {
  xs: { w: 48,  h: 60,  vf: 10, vo: 3,  nf: 6,  cp: '14px' },
  sm: { w: 62,  h: 78,  vf: 13, vo: 4,  nf: 7,  cp: '18px' },
  md: { w: 80,  h: 100, vf: 16, vo: 5,  nf: 8,  cp: '22px' },
  lg: { w: 96,  h: 120, vf: 19, vo: 6,  nf: 9,  cp: '26px' },
  xl: { w: 116, h: 145, vf: 22, vo: 7,  nf: 10, cp: '30px' },
}
const S = computed(() => SIZES[props.size] ?? SIZES.md)

const sizeClass = computed(() => '') // handled by sizeStyle
const sizeStyle = computed(() => ({
  width:  `${S.value.w}px`,
  height: `${S.value.h}px`,
}))

const valPos = computed(() => {
  const { vf, vo } = S.value
  const fs = `${vf}px`
  const half = `${S.value.h / 2}px`
  return {
    top:    { top:    `${vo}px`, left: '50%', transform: 'translateX(-50%)', fontSize: fs },
    bottom: { bottom: `${vo}px`, left: '50%', transform: 'translateX(-50%)', fontSize: fs },
    left:   { left:   `${vo}px`, top: '50%',  transform: 'translateY(-50%)', fontSize: fs },
    right:  { right:  `${vo}px`, top: '50%',  transform: 'translateY(-50%)', fontSize: fs },
  }
})

const nameStyle    = computed(() => ({ fontSize: `${S.value.nf}px` }))
const paddingCenter = computed(() => S.value.cp)
</script>
