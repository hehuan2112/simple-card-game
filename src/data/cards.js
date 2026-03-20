// 100 cards named after real-world locations
// Values: 1-9 and 'A' (= 10, the maximum)
// Elements: 'fire' | 'water' | 'wind' | 'earth' | 'ice' | null
// Tier: 1-9 determines which region the card belongs to

export const ALL_CARDS = [
  // ===== TIER 1 — Pacific micro-states, gentle islands =====
  { id: 1,  name: 'Nauru',          nameZh: '瑙鲁',        up: 1, down: 1, left: 2, right: 1, element: null,    tier: 1 },
  { id: 2,  name: 'Tuvalu',         nameZh: '图瓦卢',      up: 1, down: 2, left: 1, right: 1, element: 'water',  tier: 1 },
  { id: 3,  name: 'Palau',          nameZh: '帕劳',        up: 2, down: 1, left: 1, right: 2, element: 'water',  tier: 1 },
  { id: 4,  name: 'San Marino',     nameZh: '圣马力诺',    up: 2, down: 1, left: 2, right: 1, element: null,    tier: 1 },
  { id: 5,  name: 'Andorra',        nameZh: '安道尔',      up: 1, down: 2, left: 2, right: 2, element: 'earth',  tier: 1 },
  { id: 6,  name: 'Liechtenstein',  nameZh: '列支敦士登',  up: 2, down: 2, left: 1, right: 2, element: null,    tier: 1 },
  { id: 7,  name: 'Maldives',       nameZh: '马尔代夫',    up: 1, down: 3, left: 2, right: 1, element: 'water',  tier: 1 },
  { id: 8,  name: 'Kiribati',       nameZh: '基里巴斯',    up: 2, down: 2, left: 3, right: 1, element: 'water',  tier: 1 },
  { id: 9,  name: 'Tonga',          nameZh: '汤加',        up: 3, down: 1, left: 2, right: 2, element: null,    tier: 1 },
  { id: 10, name: 'Vanuatu',        nameZh: '瓦努阿图',    up: 2, down: 3, left: 1, right: 2, element: 'wind',   tier: 1 },

  // ===== TIER 2 — Small developing nations =====
  { id: 11, name: 'Fiji',           nameZh: '斐济',        up: 3, down: 2, left: 3, right: 3, element: 'water',  tier: 2 },
  { id: 12, name: 'Bhutan',         nameZh: '不丹',        up: 2, down: 4, left: 3, right: 3, element: 'earth',  tier: 2 },
  { id: 13, name: 'Laos',           nameZh: '老挝',        up: 4, down: 3, left: 2, right: 3, element: null,    tier: 2 },
  { id: 14, name: 'Cambodia',       nameZh: '柬埔寨',      up: 3, down: 4, left: 3, right: 3, element: null,    tier: 2 },
  { id: 15, name: 'Montenegro',     nameZh: '黑山',        up: 4, down: 2, left: 3, right: 4, element: null,    tier: 2 },
  { id: 16, name: 'Moldova',        nameZh: '摩尔多瓦',    up: 3, down: 4, left: 4, right: 2, element: null,    tier: 2 },
  { id: 17, name: 'Solomon Islands',nameZh: '所罗门群岛',  up: 3, down: 3, left: 2, right: 4, element: 'water',  tier: 2 },
  { id: 18, name: 'East Timor',     nameZh: '东帝汶',      up: 4, down: 2, left: 3, right: 2, element: null,    tier: 2 },
  { id: 19, name: 'Bolivia',        nameZh: '玻利维亚',    up: 3, down: 3, left: 4, right: 3, element: 'earth',  tier: 2 },
  { id: 20, name: 'Paraguay',       nameZh: '巴拉圭',      up: 4, down: 3, left: 3, right: 4, element: null,    tier: 2 },

  // ===== TIER 3 — Eastern Europe, Central Asia, small powers =====
  { id: 21, name: 'Albania',        nameZh: '阿尔巴尼亚',  up: 4, down: 3, left: 4, right: 4, element: null,    tier: 3 },
  { id: 22, name: 'Armenia',        nameZh: '亚美尼亚',    up: 5, down: 3, left: 4, right: 3, element: null,    tier: 3 },
  { id: 23, name: 'Georgia',        nameZh: '格鲁吉亚',    up: 4, down: 5, left: 3, right: 4, element: null,    tier: 3 },
  { id: 24, name: 'Ecuador',        nameZh: '厄瓜多尔',    up: 4, down: 4, left: 5, right: 4, element: 'earth',  tier: 3 },
  { id: 25, name: 'Uzbekistan',     nameZh: '乌兹别克斯坦',up: 5, down: 4, left: 4, right: 4, element: 'earth',  tier: 3 },
  { id: 26, name: 'Kyrgyzstan',     nameZh: '吉尔吉斯斯坦',up: 4, down: 4, left: 5, right: 4, element: 'wind',   tier: 3 },
  { id: 27, name: 'Panama',         nameZh: '巴拿马',      up: 4, down: 5, left: 5, right: 4, element: 'water',  tier: 3 },
  { id: 28, name: 'Costa Rica',     nameZh: '哥斯达黎加',  up: 5, down: 5, left: 4, right: 5, element: null,    tier: 3 },
  { id: 29, name: 'Myanmar',        nameZh: '缅甸',        up: 4, down: 3, left: 4, right: 5, element: null,    tier: 3 },
  { id: 30, name: 'Nepal',          nameZh: '尼泊尔',      up: 5, down: 3, left: 4, right: 4, element: 'earth',  tier: 3 },

  // ===== TIER 4 — Baltic, Balkans, South America =====
  { id: 31, name: 'Estonia',        nameZh: '爱沙尼亚',    up: 5, down: 5, left: 4, right: 5, element: null,    tier: 4 },
  { id: 32, name: 'Latvia',         nameZh: '拉脱维亚',    up: 6, down: 4, left: 5, right: 5, element: null,    tier: 4 },
  { id: 33, name: 'Lithuania',      nameZh: '立陶宛',      up: 5, down: 6, left: 5, right: 4, element: null,    tier: 4 },
  { id: 34, name: 'Slovenia',       nameZh: '斯洛文尼亚',  up: 5, down: 5, left: 6, right: 4, element: null,    tier: 4 },
  { id: 35, name: 'Croatia',        nameZh: '克罗地亚',    up: 5, down: 5, left: 5, right: 6, element: 'water',  tier: 4 },
  { id: 36, name: 'Bulgaria',       nameZh: '保加利亚',    up: 6, down: 5, left: 4, right: 5, element: null,    tier: 4 },
  { id: 37, name: 'Slovakia',       nameZh: '斯洛伐克',    up: 4, down: 5, left: 5, right: 6, element: null,    tier: 4 },
  { id: 38, name: 'Serbia',         nameZh: '塞尔维亚',    up: 5, down: 5, left: 5, right: 6, element: null,    tier: 4 },
  { id: 39, name: 'Uruguay',        nameZh: '乌拉圭',      up: 5, down: 4, left: 5, right: 5, element: null,    tier: 4 },
  { id: 40, name: 'Cuba',           nameZh: '古巴',        up: 6, down: 5, left: 5, right: 5, element: null,    tier: 4 },

  // ===== TIER 5 — Nordic, mid-size economies =====
  { id: 41, name: 'Denmark',        nameZh: '丹麦',        up: 6, down: 5, left: 6, right: 5, element: 'water',  tier: 5 },
  { id: 42, name: 'Norway',         nameZh: '挪威',        up: 5, down: 6, left: 6, right: 5, element: 'water',  tier: 5 },
  { id: 43, name: 'Finland',        nameZh: '芬兰',        up: 6, down: 6, left: 5, right: 5, element: 'ice',    tier: 5 },
  { id: 44, name: 'Portugal',       nameZh: '葡萄牙',      up: 6, down: 6, left: 5, right: 6, element: 'water',  tier: 5 },
  { id: 45, name: 'Ireland',        nameZh: '爱尔兰',      up: 5, down: 6, left: 6, right: 6, element: 'water',  tier: 5 },
  { id: 46, name: 'New Zealand',    nameZh: '新西兰',      up: 6, down: 6, left: 6, right: 5, element: null,    tier: 5 },
  { id: 47, name: 'Singapore',      nameZh: '新加坡',      up: 7, down: 5, left: 6, right: 6, element: null,    tier: 5 },
  { id: 48, name: 'Malaysia',       nameZh: '马来西亚',    up: 6, down: 6, left: 7, right: 5, element: null,    tier: 5 },
  { id: 49, name: 'Chile',          nameZh: '智利',        up: 5, down: 7, left: 5, right: 6, element: null,    tier: 5 },
  { id: 50, name: 'Peru',           nameZh: '秘鲁',        up: 6, down: 6, left: 5, right: 7, element: 'earth',  tier: 5 },

  // ===== TIER 6 — European powers, major economies =====
  { id: 51, name: 'Poland',         nameZh: '波兰',        up: 7, down: 6, left: 6, right: 6, element: null,    tier: 6 },
  { id: 52, name: 'Romania',        nameZh: '罗马尼亚',    up: 6, down: 7, left: 6, right: 6, element: null,    tier: 6 },
  { id: 53, name: 'Netherlands',    nameZh: '荷兰',        up: 6, down: 6, left: 7, right: 6, element: 'water',  tier: 6 },
  { id: 54, name: 'Belgium',        nameZh: '比利时',      up: 7, down: 6, left: 7, right: 5, element: null,    tier: 6 },
  { id: 55, name: 'Switzerland',    nameZh: '瑞士',        up: 6, down: 7, left: 5, right: 7, element: 'earth',  tier: 6 },
  { id: 56, name: 'Austria',        nameZh: '奥地利',      up: 6, down: 6, left: 7, right: 7, element: null,    tier: 6 },
  { id: 57, name: 'Greece',         nameZh: '希腊',        up: 7, down: 7, left: 6, right: 6, element: 'water',  tier: 6 },
  { id: 58, name: 'Czech Republic', nameZh: '捷克',        up: 7, down: 6, left: 6, right: 7, element: null,    tier: 6 },
  { id: 59, name: 'Colombia',       nameZh: '哥伦比亚',    up: 7, down: 7, left: 6, right: 7, element: null,    tier: 6 },
  { id: 60, name: 'Sweden',         nameZh: '瑞典',        up: 7, down: 7, left: 7, right: 6, element: 'ice',    tier: 6 },

  // ===== TIER 7 — Major nations =====
  { id: 61, name: 'Argentina',      nameZh: '阿根廷',      up: 7, down: 7, left: 7, right: 7, element: null,    tier: 7 },
  { id: 62, name: 'Mexico',         nameZh: '墨西哥',      up: 8, down: 6, left: 7, right: 7, element: null,    tier: 7 },
  { id: 63, name: 'Egypt',          nameZh: '埃及',        up: 7, down: 8, left: 7, right: 6, element: 'earth',  tier: 7 },
  { id: 64, name: 'Thailand',       nameZh: '泰国',        up: 7, down: 7, left: 8, right: 6, element: null,    tier: 7 },
  { id: 65, name: 'Vietnam',        nameZh: '越南',        up: 6, down: 7, left: 7, right: 8, element: null,    tier: 7 },
  { id: 66, name: 'Philippines',    nameZh: '菲律宾',      up: 7, down: 8, left: 7, right: 7, element: 'water',  tier: 7 },
  { id: 67, name: 'Indonesia',      nameZh: '印度尼西亚',  up: 7, down: 7, left: 8, right: 7, element: null,    tier: 7 },
  { id: 68, name: 'Pakistan',       nameZh: '巴基斯坦',    up: 8, down: 7, left: 7, right: 7, element: null,    tier: 7 },
  { id: 69, name: 'Ukraine',        nameZh: '乌克兰',      up: 8, down: 7, left: 7, right: 8, element: null,    tier: 7 },
  { id: 70, name: 'Taiwan',         nameZh: '台湾',        up: 7, down: 8, left: 8, right: 7, element: null,    tier: 7 },

  // ===== TIER 8 — World powers =====
  { id: 71, name: 'Spain',          nameZh: '西班牙',      up: 8, down: 8, left: 7, right: 8, element: null,    tier: 8 },
  { id: 72, name: 'Italy',          nameZh: '意大利',      up: 8, down: 7, left: 8, right: 8, element: null,    tier: 8 },
  { id: 73, name: 'Canada',         nameZh: '加拿大',      up: 7, down: 8, left: 8, right: 8, element: 'ice',    tier: 8 },
  { id: 74, name: 'Australia',      nameZh: '澳大利亚',    up: 8, down: 8, left: 8, right: 7, element: null,    tier: 8 },
  { id: 75, name: 'South Korea',    nameZh: '韩国',        up: 9, down: 7, left: 8, right: 8, element: null,    tier: 8 },
  { id: 76, name: 'Saudi Arabia',   nameZh: '沙特阿拉伯',  up: 8, down: 9, left: 7, right: 8, element: 'fire',   tier: 8 },
  { id: 77, name: 'Brazil',         nameZh: '巴西',        up: 8, down: 8, left: 9, right: 7, element: null,    tier: 8 },
  { id: 78, name: 'India',          nameZh: '印度',        up: 7, down: 8, left: 8, right: 9, element: 'earth',  tier: 8 },
  { id: 79, name: 'France',         nameZh: '法国',        up: 9, down: 8, left: 8, right: 8, element: null,    tier: 8 },
  { id: 80, name: 'Germany',        nameZh: '德国',        up: 8, down: 9, left: 8, right: 8, element: null,    tier: 8 },

  // ===== TIER 9 — Elite: capitals, world landmarks, superpowers =====
  { id: 81, name: 'United Kingdom', nameZh: '英国',        up: 9, down: 9, left: 8, right: 8, element: 'water',  tier: 9 },
  { id: 82, name: 'Japan',          nameZh: '日本',        up: 8, down: 9, left: 9, right: 8, element: 'water',  tier: 9 },
  { id: 83, name: 'Russia',         nameZh: '俄罗斯',      up: 9, down: 8, left: 8, right: 9, element: 'ice',    tier: 9 },
  { id: 84, name: 'China',          nameZh: '中国',        up: 9, down: 9, left: 9, right: 8, element: 'earth',  tier: 9 },
  { id: 85, name: 'USA',            nameZh: '美利坚',      up: 9, down: 8, left: 9, right: 9, element: null,    tier: 9 },
  { id: 86, name: 'New York',       nameZh: '纽约',        up: 9, down: 9, left: 9, right: 9, element: null,    tier: 9 },
  { id: 87, name: 'Beijing',        nameZh: '北京',        up: 'A', down: 9, left: 9, right: 9, element: 'earth', tier: 9 },
  { id: 88, name: 'Washington DC',  nameZh: '华盛顿',      up: 9, down: 'A', left: 9, right: 9, element: null,   tier: 9 },
  { id: 89, name: 'Tokyo',          nameZh: '东京',        up: 9, down: 9, left: 'A', right: 9, element: null,   tier: 9 },
  { id: 90, name: 'London',         nameZh: '伦敦',        up: 9, down: 9, left: 9, right: 'A', element: 'water', tier: 9 },
  { id: 91, name: 'Paris',          nameZh: '巴黎',        up: 'A', down: 'A', left: 8, right: 8, element: null,  tier: 9 },
  { id: 92, name: 'Moscow',         nameZh: '莫斯科',      up: 8, down: 8, left: 'A', right: 'A', element: 'ice', tier: 9 },
  // Special landmark cards — extra cost in shop
  { id: 93, name: 'North Pole',     nameZh: '北极',        up: 'A', down: 2, left: 'A', right: 'A', element: 'ice',   tier: 9 },
  { id: 94, name: 'South Pole',     nameZh: '南极',        up: 2, down: 'A', left: 'A', right: 'A', element: 'ice',   tier: 9 },
  { id: 95, name: 'Mt. Everest',    nameZh: '珠穆朗玛',    up: 'A', down: 1, left: 5, right: 5,   element: 'earth',  tier: 9 },
  { id: 96, name: 'Amazon',         nameZh: '亚马逊',      up: 5, down: 5, left: 'A', right: 'A', element: 'wind',   tier: 9 },
  { id: 97, name: 'Sahara',         nameZh: '撒哈拉',      up: 'A', down: 'A', left: 'A', right: 3, element: 'fire',  tier: 9 },
  { id: 98, name: 'Pacific Ocean',  nameZh: '太平洋',      up: 4, down: 4, left: 'A', right: 'A', element: 'water',  tier: 9 },
  { id: 99, name: 'Atlantic Ocean', nameZh: '大西洋',      up: 'A', down: 'A', left: 4, right: 4, element: 'water',  tier: 9 },
  { id: 100,name: 'Mariana Trench', nameZh: '马里亚纳海沟',up: 'A', down: 'A', left: 'A', right: 'A', element: 'water', tier: 9 },
]

export function getCard(id) {
  return ALL_CARDS.find(c => c.id === id) ?? null
}

export function cardValue(v) {
  return v === 'A' ? 10 : Number(v)
}

// Both zh and en names kept here for card display
export const ELEMENT_LABELS = {
  fire:  { zh: '火', en: 'Fire',  emoji: '🔥', color: '#e74c3c' },
  water: { zh: '水', en: 'Water', emoji: '💧', color: '#3498db' },
  wind:  { zh: '风', en: 'Wind',  emoji: '🌪',  color: '#27ae60' },
  earth: { zh: '土', en: 'Earth', emoji: '🌍', color: '#e67e22' },
  ice:   { zh: '冰', en: 'Ice',   emoji: '❄',  color: '#74b9ff' },
}

export const TIER_COLORS = {
  1: '#4a6a4a', 2: '#4a5a6a', 3: '#5a4a6a', 4: '#3a5a4a',
  5: '#2a5a7a', 6: '#4a3a6a', 7: '#6a3a2a', 8: '#7a4a1a', 9: '#8a6a1a',
}

// ── Shop pricing per tier ──────────────────────────────────────────────────────
// Landmark cards (id 91-100) cost ×1.4 extra
export const TIER_PRICES = { 1: 2, 2: 4, 3: 7, 4: 12, 5: 18, 6: 26, 7: 36, 8: 48, 9: 65 }

export function shopPrice(card) {
  const base = TIER_PRICES[card.tier] ?? 10
  return card.id >= 91 ? Math.round(base * 1.4) : base
}
