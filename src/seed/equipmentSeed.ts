import { createDucatsCost, createGloryPointsCost } from '../models/cost'
import type { Equipment } from '../models/equipment'

// Define melee weapons
const meleeWeapons: Equipment[] = [
  {
    id: 'unarmed',
    name: 'Unarmed',
    type: 'Special',
    description: 'Fighting without weapons',
    range: 'Melee',
    cost: createDucatsCost(0),
    modifiers: ['-1D to Hit/Injuries'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Models suffer -1 DICE when fighting unarmed, both to see if the attack hits and when rolling on the Injury Chart. Note that you can never fight with unarmed as an Off-Hand weapon to get an additional attack in melee. These rules simply cover all instances where the model fights unarmed and has no other Melee Actions in their profile.',
    ],
  },
  {
    id: 'knife-dagger',
    name: 'Knife/Dagger',
    type: 'Melee Weapon',
    description: 'A small blade for close combat',
    range: 'Melee',
    cost: createDucatsCost(2),
    modifiers: ['-1D to Hit'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Add -1 DICE every time you use a knife to see if the attack hits.'],
  },
  {
    id: 'trench-club',
    name: 'Trench Club',
    type: 'Melee Weapon',
    description: 'A crude bludgeon often made from scavenged materials',
    range: 'Melee',
    cost: createDucatsCost(3),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [],
  },
  {
    id: 'sword-axe',
    name: 'Sword/Axe',
    type: 'Melee Weapon',
    description: 'A larger bladed weapon for close combat',
    range: 'Melee',
    cost: createDucatsCost(5),
    modifiers: [],
    keywords: ['CRITICAL'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [],
  },
  {
    id: 'bayonet',
    name: 'Bayonet',
    type: 'Melee Weapon',
    description: 'A blade that attaches to the end of a rifle',
    range: 'Melee',
    cost: createDucatsCost(3),
    modifiers: [],
    keywords: ['CUMBERSOME'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: true },
    rules: [
      "Bayonets can only be attached to weapons fitted with a 'Bayonet lug' (indicated in each Warband's Armoury). They do not count towards the maximum melee weapons a model can carry.",
    ],
  },
  {
    id: 'sacrificial-knife',
    name: 'Sacrificial Knife',
    type: 'Melee Weapon',
    description: 'A ornate ritual blade imbued with dark powers',
    range: 'Melee',
    cost: createDucatsCost(6),
    modifiers: ['+2 on Injury results'],
    keywords: ['RISKY'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'The Sacrificial Knife adds +2 to all rolls on the Injury Chart. For example, a roll of 7 on the Injury Chart becomes 9 when using the Sacrificial Knife.',
    ],
  },
  {
    id: 'blasphemous-staff',
    name: 'Blasphemous Staff',
    type: 'Melee Weapon',
    description: 'A staff inscribed with heretical sigils',
    range: 'Melee',
    cost: createDucatsCost(7),
    modifiers: [],
    keywords: ['FIRE', 'CRITICAL'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [],
  },
]

// Define ranged weapons
const rangedWeapons: Equipment[] = [
  {
    id: 'pistol-revolver',
    name: 'Pistol/revolver',
    type: 'Ranged Weapon',
    description: 'A basic sidearm with moderate range',
    range: '12"/Melee',
    cost: createDucatsCost(6),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'A model armed with a pistol can use it in melee as well as ranged combat (using Ranged Characteristic), including as an off-hand weapon to execute an additional melee attack.',
    ],
  },
  {
    id: 'automatic-pistol',
    name: 'Automatic Pistol',
    type: 'Ranged Weapon',
    description: 'A rapid-firing sidearm with automatic capability',
    range: '12"/Melee',
    cost: createDucatsCost(20),
    modifiers: ['-1D to injury', '2 attacks'],
    keywords: ['ASSAULT'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'A model armed with an automatic pistol can use it in melee as well as ranged combat (using Ranged Characteristic), including as an off-hand weapon to execute an additional melee attack. You can make two Attack ACTIONS with the automatic pistol instead of one if used as a ranged weapon. They can be against the same target or two different ones.',
    ],
  },
  {
    id: 'bolt-action-rifle',
    name: 'Bolt Action Rifle',
    type: 'Ranged Weapon',
    description: 'The workhorse of the Great War. Sturdy, highly reliable and reasonably accurate.',
    range: '24"',
    cost: createDucatsCost(10),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: true, shieldCombo: false },
    rules: [],
  },
]

// Define armor items
const armorItems: Equipment[] = [
  {
    id: 'trench-shield',
    name: 'Trench Shield',
    type: 'Armour',
    description: 'A portable shield providing protection in combat',
    cost: createDucatsCost(5),
    modifiers: ['-1 to injury rolls'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      "Always takes one hand to use in both melee and in ranged combat, and cannot be switched out. Grants -1 to all injury rolls against the model. This bonus stacks with any armour the model wears, unless otherwise indicated. For the purposes of wielding a 2-handed weapon with the 'Shield Combo' indicator, the Trench Shield does not take a hand to wield but still functions as normal.",
    ],
  },
  {
    id: 'standard-armour',
    name: 'Standard Armour',
    type: 'Armour',
    description: 'Basic protective armor offering moderate protection',
    cost: createDucatsCost(7),
    modifiers: ['-1 to all Injury Chart rolls'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['-1 to all Injury Chart rolls against the model. Can be combined with any shield.'],
  },
  {
    id: 'reinforced-armour',
    name: 'Reinforced Armour',
    type: 'Armour',
    description: 'Heavy armor offering substantial protection',
    cost: createDucatsCost(15),
    modifiers: ['-2 modifier to all injury rolls'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Grants a -2 modifier to all injury rolls against the model wearing this armour.'],
  },
]

// Define general equipment
const equipmentItems: Equipment[] = [
  {
    id: 'combat-helmet',
    name: 'Combat Helmet',
    type: 'Equipment',
    description: 'A helmet protecting the wearer from overhead dangers',
    cost: createDucatsCost(3),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Ignores additional BLOOD MARKERS caused by the Keyword SHRAPNEL.'],
  },
  {
    id: 'medi-kit',
    name: 'Medi-kit',
    type: 'Equipment',
    description: 'Field medical supplies for treating injuries',
    cost: createDucatsCost(5),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Models with a Medi-kit can take a RISKY ACTION to remove one BLOOD MARKER from any one friendly model (including themselves) within 1" range or allow one friendly model (including themselves) that is Down to regain their footing.',
    ],
  },
  {
    id: 'gas-mask',
    name: 'Gas Mask',
    type: 'Equipment',
    description: 'Protects against poisonous gases used in warfare',
    cost: createDucatsCost(4),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Negates the extra BLOOD MARKER from attacks with the keyword GAS. Any such attacks suffer -1 DICE penalty to all injury rolls.',
    ],
  },
  {
    id: 'holy-relic',
    name: 'Holy Relic',
    type: 'Equipment',
    description: 'A blessed item that provides divine protection',
    cost: createGloryPointsCost(1),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['This model starts each game with +1 BLESSING MARKER.'],
  },
  {
    id: 'sniper-scope',
    name: 'Sniper Scope',
    type: 'Equipment',
    description: 'An optical sight that increases accuracy at range',
    cost: createDucatsCost(7),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Negates the penalty for Long Range if the model has not moved during this Activation. Only usable with rifles (i.e. weapons which have the Keyword rifle in their name).',
    ],
  },
  {
    id: 'shovel',
    name: 'Shovel',
    type: 'Equipment',
    description: 'A trench tool that can provide cover and be used as a weapon',
    cost: createDucatsCost(2),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'A model equipped with a shovel always starts the game in cover if deployed on ground level, even if placed in open terrain. As soon as the model moves, it is no longer in cover. A model that is covered in this way retains the benefit of Cover even if the attacking model has an unobstructed view of it. If a model equipped with a shovel has two hands free, it can use it in Melee Combat as if it were a Trench Club.',
    ],
  },
]

/**
 * Combined equipment data for seeding the Firestore database
 */
export const equipmentSeed: Equipment[] = [
  ...meleeWeapons,
  ...rangedWeapons,
  ...armorItems,
  ...equipmentItems,
]
