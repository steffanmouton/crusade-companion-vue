import { createDucatsCost } from '../models/cost'
import type { Equipment } from '../models/equipment'
import { HandednessType } from '../models/equipment'
import { EquipmentCategory } from '../models/equipment'

// Define melee weapons
const meleeWeapons: Equipment[] = [
  {
    id: 'tc-eq-unarmed',
    name: 'Unarmed',
    type: 'Special',
    description: 'Fighting without weapons',
    range: 'Melee',
    modifiers: ['-1D to Hit/Injuries'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Models suffer -1 DICE when fighting unarmed, both to see if the attack hits and when rolling on the Injury Chart. Note that you can never fight with unarmed as an Off-Hand weapon to get an additional attack in melee. These rules simply cover all instances where the model fights unarmed and has no other Melee Actions in their profile.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.MELEE_WEAPON
  },
  {
    id: 'tc-eq-knife-dagger',
    name: 'Knife/Dagger',
    type: 'Melee Weapon',
    description: 'Virtually all soldiers carry a trench knife, dagger or other kind of blade for close quarter engagements. It may lack the devastating power of a great maul or other heavier melee weapons, but this humble weapon has taken countless lives during the Great War.',
    range: 'Melee',
    modifiers: ['-1D to Hit'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Add -1 DICE every time you use a knife to see if the attack hits.'],
    handedness: HandednessType.ONE_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
  {
    id: 'tc-eq-trench-club',
    name: 'Trench Club',
    type: 'Melee Weapon',
    description: 'Trench Clubs are one of the most common weapons of the Great War, as melee combat is frequent and brutal. Usually made of wood with a metal tip from iron, lead or steel, trench clubs often feature spikes and hobnails. Most designs have some form of cord or leather strap at the end to wrap around the user\'s wrist.',
    range: 'Melee',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [],
    handedness: HandednessType.ONE_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
  {
    id: 'tc-eq-sword-axe',
    name: 'Sword/Axe',
    type: 'Melee Weapon',
    description: 'Because of the martial traditions of many proud nations and due to the advances in armour technology, swords and axes are extremely popular, especially amongst elite units and officers. They are supremely useful for finishing off downed opponents and causing profusely bleeding wounds.',
    range: 'Melee',
    modifiers: [],
    keywords: ['CRITICAL'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [],
    handedness: HandednessType.ONE_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
  {
    id: 'tc-eq-bayonet',
    name: 'Bayonet',
    type: 'Melee Weapon',
    description: 'Bayonets are blades in the form of spikes or daggers that can be fixed to the tip of a firearm and used in melee combat.',
    range: 'Melee',
    modifiers: [],
    keywords: ['CUMBERSOME'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: true },
    rules: [
      "Bayonets can only be attached to weapons fitted with a 'Bayonet lug' (indicated in each Warband's Armoury). They do not count towards the maximum melee weapons a model can carry.",
    ],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
  {
    id: 'tc-eq-sacrificial-knife',
    name: 'Sacrificial Knife',
    type: 'Melee Weapon',
    description: 'Terrifying blades blessed by the hand of a greater devil, these knives are used in Heretic rituals to sacrifice captives to the dark powers of Hell. They simply need to touch their opponents to cause indescribable pain and even the slightest wound often proves fatal from the agony alone. They are risky even to their wielders, as the merest scratch wounds friend and a foe alike.',
    range: 'Melee',
    modifiers: ['+2 on Injury results'],
    keywords: ['RISKY'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'The Sacrificial Knife adds +2 to all rolls on the Injury Chart. For example, a roll of 7 on the Injury Chart becomes 9 when using the Sacrificial Knife.',
    ],
    handedness: HandednessType.ONE_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
  {
    id: 'tc-eq-blasphemous-staff',
    name: 'Blasphemous Staff',
    type: 'Melee Weapon',
    description: 'A staff inscribed with heretical sigils',
    range: 'Melee',
    modifiers: [],
    keywords: ['FIRE', 'CRITICAL'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
]

// Define ranged weapons
const rangedWeapons: Equipment[] = [
  {
    id: 'tc-eq-pistol-revolver',
    name: 'Pistol/revolver',
    type: 'Ranged Weapon',
    description: 'A basic sidearm with moderate range',
    range: '12"/Melee',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'A model armed with a pistol can use it in melee as well as ranged combat (using Ranged Characteristic), including as an off-hand weapon to execute an additional melee attack.',
    ],
    handedness: HandednessType.ONE_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-automatic-pistol',
    name: 'Automatic Pistol',
    type: 'Ranged Weapon',
    description: 'A rapid-firing sidearm with automatic capability',
    range: '12"/Melee',
    modifiers: ['-1D to injury', '2 attacks'],
    keywords: ['ASSAULT'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'A model armed with an automatic pistol can use it in melee as well as ranged combat (using Ranged Characteristic), including as an off-hand weapon to execute an additional melee attack. You can make two Attack ACTIONS with the automatic pistol instead of one if used as a ranged weapon. They can be against the same target or two different ones.',
    ],
    handedness: HandednessType.ONE_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-bolt-action-rifle',
    name: 'Bolt Action Rifle',
    type: 'Ranged Weapon',
    description: 'The workhorse of the Great War. Sturdy, highly reliable and reasonably accurate.',
    range: '24"',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: true, shieldCombo: false },
    rules: [],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
]

// Define armor items
const armorItems: Equipment[] = [
  {
    id: 'tc-eq-trench-shield',
    name: 'Trench Shield',
    type: 'Armour',
    description: 'A portable shield providing protection in combat',
    modifiers: ['-1 to injury rolls'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      "Always takes one hand to use in both melee and in ranged combat, and cannot be switched out. Grants -1 to all injury rolls against the model. This bonus stacks with any armour the model wears, unless otherwise indicated. For the purposes of wielding a 2-handed weapon with the 'Shield Combo' indicator, the Trench Shield does not take a hand to wield but still functions as normal.",
    ],
    handedness: HandednessType.ONE_HAND_REQUIRED,
    category: EquipmentCategory.SHIELD
  },
  {
    id: 'tc-eq-standard-armour',
    name: 'Standard Armour',
    type: 'Armour',
    description: 'Basic protective armor offering moderate protection',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['-1 to all Injury Chart rolls against the model. Can be combined with any shield.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.ARMOUR
  },
  {
    id: 'tc-eq-reinforced-armour',
    name: 'Reinforced Armour',
    type: 'Armour',
    description: 'Heavy armor offering substantial protection',
    modifiers: ['-2 modifier to all injury rolls'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Grants a -2 modifier to all injury rolls against the model wearing this armour.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.ARMOUR
  },
]

// Define general equipment
const equipmentItems: Equipment[] = [
  {
    id: 'tc-eq-combat-helmet',
    name: 'Combat Helmet',
    type: 'Equipment',
    description: 'The simple combat helmet has proven its value on the battlefield time and again.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Ignores additional BLOOD MARKERS caused by the Keyword SHRAPNEL.'],
    category: EquipmentCategory.HEADGEAR,
    handedness: HandednessType.NO_HANDS
  },
  {
    id: 'tc-eq-iron-capirote',
    name: 'Iron Capirote',
    type: 'Equipment',
    description:
      'A conical helmet blessed by the Church and often containing a fragment of a relic. Iron Capirotes shield their wearers from the psychological horror of war and allow them to face creatures from the pits of Hell unflinchingly.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Negates the additional BLOOD MARKERS from weapons with SHRAPNEL Keyword. Makes the model immune to the effects of FEAR.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.HEADGEAR
  },
  {
    id: 'tc-eq-medi-kit',
    name: 'Medi-kit',
    type: 'Equipment',
    description:
      'Battlefield first aid has brought many soldiers back from the brink of death. Blessed ointments can seal fatal wounds completely, while the black blood of demons used by twisted heretic medics allows mangled troops to return to the fray.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Models with a Medi-kit can take a RISKY ACTION to remove one BLOOD MARKER from any one friendly model (including themselves) within 1" range or allow one friendly model (including themselves) that is Down to regain their footing.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-gas-mask',
    name: 'Gas Mask',
    type: 'Equipment',
    description:
      'Mustard Gas, phosgene, chlorine as well as noxious fumes from the bolgias of Hell plague the battlefield. The Gas Mask allows soldiers to withstand such attacks.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Negates the extra BLOOD MARKER from attacks with the keyword GAS. Any such attacks suffer -1 DICE penalty to all injury rolls.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.HEADGEAR
  },
  {
    id: 'tc-eq-holy-relic',
    name: 'Holy Relic',
    type: 'Equipment',
    description:
      'Due to the threat to all Creation, the churches, cathedrals and basilicas have emptied their reliquaries and distributed their relics to the frontline troops to aid them in their battle against the damned.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['This model starts each game with +1 BLESSING MARKER.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-armour-piercing-bullets',
    name: 'Armour-Piercing Bullets',
    type: 'Equipment',
    description:
      'Advanced armour technology has forced the armouries of the Great War to forge new types of bullets. Expensive and labour-intensive to produce, these hardened tungsten rounds are more effective against battlefield armour.',
    modifiers: [],
    keywords: ['CONSUMABLE'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Before the battle begins, a model may use this item to grant a rifle or pistol weapon that they are equipped with the following ability: Reduce the injury penalty from Armour and Shields by 1 until the end of the battle. Keyword: CONSUMABLE.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-dum-dum-bullets',
    name: 'Dum-Dum Bullets',
    type: 'Equipment',
    description:
      'These hollow-point bullets are far more likely to cause fatal wounds than standard ammunition.',
    modifiers: [],
    keywords: ['CONSUMABLE', 'CRITICAL'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Before the battle begins, a model may use this item to grant a rifle or pistol weapon that they are equipped with the CRITICAL keyword until the end of the battle. Keywords: CONSUMABLE, CRITICAL.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-incendiary-ammunition',
    name: 'Incendiary Ammunition',
    type: 'Equipment',
    description:
      'Developed by Aym, the Great Duke of Hell, these bullets set any target they hit on fire.',
    modifiers: [],
    keywords: ['FIRE', 'CONSUMABLE'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Before the battle begins, a model may use this item to grant a rifle or pistol weapon that they are equipped with the FIRE keyword until the end of the battle. Keywords: FIRE, CONSUMABLE.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-tracer-bullets',
    name: 'Tracer Bullets',
    type: 'Equipment',
    description: 'Tracer bullets allow soldiers to adjust their aim efficiently.',
    modifiers: [],
    keywords: ['CONSUMABLE'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Before the battle begins, a model may use this item to grant a rifle or pistol weapon that they are equipped with +1D to hit with ranged attacks until the end of the battle. Keywords: CONSUMABLE.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-sniper-scope',
    name: 'Sniper Scope',
    type: 'Equipment',
    description:
      'These optical aiming devices are favoured by Snipers to aid in their aiming at long distances.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Negates the penalty for Long Range if the model has not moved during this Activation. Only usable with rifles (i.e. weapons which have the Keyword rifle in their name).',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-shovel',
    name: 'Shovel',
    type: 'Equipment',
    description:
      'Battlefield shovel allows troops to dig in and fight from cover in virtually any battlefield.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'A model equipped with a shovel always starts the game in cover if deployed on ground level, even if placed in open terrain. As soon as the model moves, it is no longer in cover. A model that is covered in this way retains the benefit of Cover even if the attacking model has an unobstructed view of it. If a model equipped with a shovel has two hands free, it can use it in Melee Combat as if it were a Trench Club.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-troop-flag',
    name: 'Troop Flag',
    type: 'Equipment',
    description:
      'Most warbands and units carry banners, flags, standards, pennants or other symbols to rally the troops.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Grants +1 DICE for all Morale tests as long as the model with the flag is not Down or Out of Action. Requires one hand to use.',
    ],
    handedness: HandednessType.ONE_HAND_REQUIRED,
    category: EquipmentCategory.STANDARD
  },
  {
    id: 'tc-eq-martyrdom-pills',
    name: 'Martyrdom Pills',
    type: 'Equipment',
    description:
      'Martyrdom pills are a potent mixture of mind-altering drugs and chemicals that inure a soldier against all pain and injury. However, it takes a tremendous toll on the body.',
    modifiers: [],
    keywords: ['CONSUMABLE'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Before the battle begins, a model may use this item. If it does, injuries rolled against it suffer -1 DICE until the end of the battle and the model is not affected by FEAR. Keywords: CONSUMABLE.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-unholy-trinket',
    name: 'Unholy Trinket',
    type: 'Equipment',
    description: 'A small token infused with unholy power.',
    modifiers: [],
    keywords: ['CONSUMABLE'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'When a model equipped with an Unholy Trinket fails a RISKY ACTION, that model may use this item. If it does, its Activation is not ended. Keyword: CONSUMABLE.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-unholy-relic',
    name: 'Unholy Relic',
    type: 'Equipment',
    description:
      'An artefact bestowed with unholy power. Examples include Nephilim heads, desecrated splinters of the True Cross or mummified body parts of fallen saints and bishops.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'A model equipped with an Unholy relic radiates a truly malignant aura and causes FEAR.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-blessed-icon',
    name: 'Blessed Icon',
    type: 'Equipment',
    description:
      "Small icons of saints, great angels and holy warriors are a common sight amongst the Trench Pilgrims. They are hung on rosaries, belts, or attached to portable shrines carried on the Pilgrims' backs.",
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'When a model equipped with a Blessed Icon fails a RISKY ACTION, that model may use this item. If it does, its Activation is not ended. Can be used once per battle.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-infernal-brand-mark',
    name: 'Infernal Brand Mark',
    type: 'Equipment',
    description:
      'A Heretic who has made a Holy Pilgrimage into Hell itself is branded by their patron devil with an ever-burning mark. Mortal fire no longer has the power to harm them.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Negates the extra BLOOD MARKER from attacks with the keyword FIRE. Any such attacks suffer -1 DICE penalty to all injury rolls.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-field-shrine',
    name: 'Field Shrine',
    type: 'Equipment',
    description:
      'Holy reliquaries, blessed artefacts and sacred crosses are often carried to the battlefield to encourage the troops, while the Heretics bring idols of the Golden Calf, tortured captives or other wicked totems to bear.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Can be placed on the battlefield in your deployment zone. Acts as three models for Morale Tests. It has a base size of 40mm. Can be destroyed if any type of attack hits it.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-hellbound-soul-contract',
    name: 'Hellbound Soul Contract',
    type: 'Equipment',
    description:
      'An infernal contract signed by a Heretic and the devil who will come to collect the damned soul when death is close. The mortal signatory bursts into infernal flames when seriously wounded.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'When this model is taken Out of Action, any model in melee combat with them immediately suffers +1 BLOOD MARKER unless the model ignores damage from sources with the Keyword FIRE.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-binoculars',
    name: 'Binoculars',
    type: 'Equipment',
    description:
      'It is quite common for officers to carry finely-crafted battlefield binoculars with them on the battlefield to survey the land ahead, spot hidden enemy troops and observe any sign of movement.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Any enemy Infiltrator cannot be placed closer than 16" of this model.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-musical-instrument',
    name: 'Musical Instrument',
    type: 'Equipment',
    description:
      'Horns, drums, trumpets, whistles, bagpipes and many other types of instruments are used extensively in the battles of the Great War. They can bolster the hearts of those facing the horrors of Hell – or they can recite terrifying hymns praising the lords of the Inferno!',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Any friendly models within 4" of the musician who is not Down can add +1 DICE to their Dash ACTIONS. Musical Instruments take one hand to use at all times as if it were a weapon.',
    ],
    handedness: HandednessType.ONE_HAND_REQUIRED,
    category: EquipmentCategory.MUSICAL_INSTRUMENT
  },
  {
    id: 'tc-eq-mountaineer-kit',
    name: 'Mountaineer Kit',
    type: 'Equipment',
    description:
      'This kit includes ropes, carabiners, slings, mountaineering harness and pitons to aid a soldier in overcoming almost any vertical obstacle.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['A model with this kit adds +1 DICE to any Climbing ACTION rolls.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
]

const uniqueTroopEquipment: Equipment[] = [
  {
    id: 'tc-eq-chainmaw',
    name: 'Chainmaw',
    type: 'Equipment',
    description:
      'The War Wolf treats its Chainsaw Mouth as a melee weapon with the Keyword RISKY that grants a +1 DICE bonus to hit (for total of +3D). Additionally, the attack ignores any armour worn by the target and has a +1 DICE bonus to injure. The Chainsaw Mouth does not take any hands to wield.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'The War Wolf treats its Chainsaw Mouth as a melee weapon with the Keyword RISKY that grants a +1 DICE bonus to hit (for total of +3D). Additionally, the attack ignores any armour worn by the target and has a +1 DICE bonus to injure. The Chainsaw Mouth does not take any hands to wield.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.MELEE_WEAPON
  },
  {
    id: 'tc-eq-shredding-claws',
    name: 'Shredding Claws',
    type: 'Equipment',
    description:
      'The War Wolf treats its Shredding Claws as a two-handed melee weapon with the Keywords RISKY and CUMBERSOME. The Shredding Claws have a +1 DICE bonus to injure. Because the Shredding Claws are wielded alongside the Chainsaw Mouth, they are treated as an Off-Hand Weapon and suffer penalties accordingly.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'The War Wolf treats its Shredding Claws as a two-handed melee weapon with the Keywords RISKY and CUMBERSOME. The Shredding Claws have a +1 DICE bonus to injure. Because the Shredding Claws are wielded alongside the Chainsaw Mouth, they are treated as an Off-Hand Weapon and suffer penalties accordingly.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.MELEE_WEAPON
  },
]

export const uniqueWarbandVariantEquipment = [
  // KNIGHTS OF AVARICE (HERETIC LEGION)
  {
    id: 'tc-eq-coinhammer',
    name: 'Coin Hammer',
    type: '2-handed',
    range: 'Melee',
    description:
      "This double-handed hammer has the rune of mammon on its head. Its strikes leave a permanent, painful scar in the shape of Mammon's rune which burns through even the thickest armour. Mammon loves marking the innocent with his Rune, as it sows mistrust amongst his enemies.",
    modifiers: ['+1D to Injuries'],
    keywords: ['HEAVY'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Roll all injuries with +1 DICE. When you inflict a BLOOD MARKER in melee with this weapon, the model wielding the hammer gains one BLESSING MARKER.',
    ],
    onlyFor: { warbandVariant: 'Knights of Avarice' },
    costPerVariant: {
      'No Variant': createDucatsCost(20)
    },
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
  {
    id: 'tc-eq-tarnished-armour',
    name: 'Tarnished Armour',
    type: 'Armour',
    range: '-',
    description:
      'This suit of armour gilded with gleaming gold comes with a helmet often with a beautiful, cherub-like face warped or corrupted in some way. Despite its splendour the armour is always tarnished by blood, offal or other kind of corruption. Merely seeing it fills mortals with incredible greed and makes the wearer an immediate target of their wrath as they attempt to tear it from them.',
    modifiers: ['-2 to Injury rolls'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'The suit counts as Reinforced Armour, a helmet and a gas mask. When an enemy declares a charge, they must charge the model wearing this armour if it is visible, not in cover and within 12" of the wearer. The charging model must be able to reach this model without climbing, leaping or crossing dangerous terrain. If the wearer of the armour is already in melee combat, this power has no effect.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.ARMOUR
  },
  {
    id: 'tc-eq-standard-of-mammon',
    name: 'Standard of Mammon',
    type: 'Equipment',
    range: '-',
    description:
      'Battle Standards of Mammon are opulently decorated works of art, icons and banners done in mockery of the virtues of Charity and Temperance. Always made of the most expensive materials, each is a unique work of dark genius, often depicting saints performing vile sins or famous acts of Greed.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Grants +1 DICE for all Morale tests as long as the model with the Flag is not Down or Out of Action. Requires one hand to use as if it was a weapon, both in ranged and melee combat. Any enemy entering melee combat with the model carrying this banner must make a successful ACTION or the model goes Down and cannot get up as long as they are in melee combat with the bearer of the standard.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.STANDARD
  },
  {
    id: 'tc-eq-golden-calf-altar',
    name: 'Golden Calf Altar',
    type: 'Equipment',
    range: '-',
    description:
      'This portable altar of Mammon creates illusions of immense wealth in any form its target covets above all. Overcome by supernatural greed, those affected by the Curse of Mammon are forced to swoop down, feebly trying to pick up the objects of their desire.',
    modifiers: [],
    keywords: ['HEAVY', 'CONSUMABLE'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'The area within 3" of the altar is Difficult Terrain for all models in the opposing Warband. This affects even models that can Fly. The model carrying the altar may drop it at any point during their Activation. Once placed down, the Golden Calf Altar cannot be picked up again. It has a 25mm base.',
    ],
    handedness: HandednessType.NO_HANDS
  },

  // DIRGE OF THE GREAT HEGEMON (BLACK GRAIL)
  {
    id: 'tc-eq-broken-crown',
    name: 'Broken Crown',
    type: 'Equipment',
    range: '-',
    description:
      "Made from the twisted and torn remains of their Hegemon's shattered armour, this crown of barbs and thorns is a constant reminder to the Mourners of their failure.",
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'In the beginning of the Activation of the model wearing the Crown, it causes one INFECTION MARKER on each enemy model in melee combat with it. Despite its name, this item is not Headgear.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-urn-of-bitter-ashes',
    name: 'Urn of Bitter Ashes',
    type: 'Equipment',
    range: '-',
    description:
      'This black urn contains ashes left from the burned body of the fallen Hegemon, which still retain a faint echo of its hateful will. It swirls and churns in the air, all while sinister whispers emanate from within.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'All ranged attacks against a model carrying the Urn and any other models fully with 3" suffer a -1 DICE penalty against any ranged attack ACTION targeting them. This stacks with any other ranged modifiers such as Long Range. This applies even to weapons that ignore Cover such as Grenade Launchers.',
    ],
    handedness: HandednessType.NO_HANDS
  },
  {
    id: 'tc-eq-blunderbuss',
    name: 'Blunderbuss',
    type: '2-handed',
    range: '10"',
    description:
      'A relic firearm of a bygone era, this weapon is loaded with rusty nails, lead shot, grenade shrapnel and shell pieces, some Mourners carry this weapon and form an honour guard of sorts for the Procession.',
    modifiers: [],
    keywords: ['SHRAPNEL'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: true },
    rules: [],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },

  // PROCESSION OF THE SACRED AFFLICTION (TRENCH PILGRIMS)
  {
    id: 'tc-eq-holy-icon-armour',
    name: 'Holy Icon Armour',
    type: 'Armour',
    range: '-',
    description:
      'This suit of armour is made of blessed icons and scripture scrolls written with the blood of saints. This armour confers a -1 modifier to any injury rolls. This modifier applies even against attacks that ignore Armour.',
    modifiers: ['-1 to Injury rolls'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: true },
    rules: [
      'This modifier applies even against attacks that ignore Armour. Can be combined with a shield, including Holy Icon Shield.',
    ],
    handedness: HandednessType.ONE_HAND_REQUIRED,
    category: EquipmentCategory.ARMOUR
  },

  // CAVALCADE OF THE TENTH PLAGUE (TRENCH PILGRIMS)
  {
    id: 'tc-eq-sacrificial-lamb',
    name: 'Sacrificial Lamb',
    type: 'Equipment',
    range: '-',
    description:
      "Before the battle, this lamb is sacrificed to God's glory, and the pilgrim then anoints themselves with its blood, averting the wrath of Yahweh while fighting for His cause.",
    modifiers: [],
    keywords: ['CONSUMABLE'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['The model ignores the first BLOOD MARKER or INFECTION MARKER it suffers in combat.'],
    handedness: HandednessType.NO_HANDS
  },

  // WAR PILGRIMAGE OF SAINT METHODIUS (TRENCH PILGRIMS)
  {
    id: 'tc-eq-methodius-heavy-flamethrower',
    name: 'Heavy Flamethrower',
    type: '2-handed',
    range: '10"',
    description:
      'A massive variant of the standard flamethrower that can be mounted on Anchorite Shrines.',
    modifiers: [],
    keywords: ['HEAVY', 'FIRE'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Hits up to two models within range automatically with an Attack Action as long as they are within 6" of each other and within the Heavy Flamethrower range. Ignores armour. It also has the Keyword FIRE, so it causes an additional +1 BLOOD MARKER on enemies it hits, even if no other damage is caused.',
    ],
    handedness: HandednessType.TWO_HANDED
  },
  {
    id: 'tc-eq-methodius-anti-materiel-rifle',
    name: 'Anti-Materiel Rifle',
    type: '2-handed',
    range: '36"',
    description:
      'A powerful heavy rifle capable of penetrating thick armor and reinforced positions.',
    modifiers: ['+1D to Injury rolls'],
    keywords: ['HEAVY', 'CRITICAL'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Ignores armour. Add +1 DICE when rolling on the Injury Chart.'],
    handedness: HandednessType.TWO_HANDED
  },
  {
    id: 'tc-eq-methodius-trench-mortar',
    name: 'Trench Mortar',
    type: '2-handed',
    range: '48"',
    description:
      'A trench mortar is a smooth-bore, muzzle-loading weapon with high angles of fire. The shell contains both explosives and deadly Greek Fire.',
    modifiers: ['+1D to Injuries'],
    keywords: ['FIRE', 'HEAVY', 'BLAST 3"'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Specify a point on the battlefield within 36" (must be in line of sight) that you want to target. Next, take a Ranged Attack ACTION. If the roll fails (i.e. you roll 6 or less), the bomb lands 1" away from its intended location, multiplied by the number representing the degree of failure. All models within 3" of the landing spot are hit as the shell explodes – no roll to hit is needed. Add +1 DICE to all injury rolls.',
    ],
    handedness: HandednessType.TWO_HANDED
  },
  {
    id: 'tc-eq-methodius-autocannon',
    name: 'Autocannon',
    type: '2-handed',
    range: '48"',
    description:
      'Autocannons are fully automatic guns that are capable of rapid-firing large-calibre 20 mm shells. Capable of generating extremely rapid firepower, autocannons overheat quickly if used for sustained fire.',
    modifiers: ['+1D to Injuries'],
    keywords: ['HEAVY'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Autocannons can make three Attack ACTIONS instead of one. They can target separate models with each attack, as long as all targets are within 6" of each other. After taking all three attacks the Activation of the model is over regardless of any remaining ACTIONS the model might have. Add +1 DICE to all injury rolls. They can shoot up to five times instead of three if they take ALL the attacks as RISKY ACTIONS.',
    ],
    handedness: HandednessType.TWO_HANDED
  },
  {
    id: 'tc-eq-methodius-gas-censer',
    name: 'Gas Censer',
    type: '2-handed',
    range: 'Special',
    description:
      'This swinging censer is both a lethal chemical weapon as well as an object of veneration to the pilgrims of the warband. It acts as both a corrosive and respiratory weapon.',
    modifiers: [],
    keywords: ['GAS', 'BLAST 6"'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'The Anchorite may make an injury roll against all models within 6" except the Anchorite itself. Note that all models within range, friend or foe, are hit if the weapon is used. No Line of Sight is needed. The attack has the Keyword GAS and Ignores Armour, unless the models are in Cover in which case armour works as normal. The use of the Gas Censer always ends the Activation of this model.',
    ],
    handedness: HandednessType.ONE_HAND_REQUIRED
  },
  {
    id: 'tc-eq-methodius-gas-filters',
    name: 'Gas Filters',
    type: 'Equipment',
    range: '-',
    description:
      'The Anchorite is installed with a holy incense system that cleanses and purifies the air the monk inside the Anchorite breathes.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['This upgrade counts as a gas mask.'],
    handedness: HandednessType.NO_HANDS
  },
  {
    id: 'tc-eq-methodius-holy-diesel-engine',
    name: 'Holy Diesel Engine',
    type: 'Equipment',
    range: '-',
    description:
      'The Anchorite is equipped with an advanced diesel engine with an experimental cooling system.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'The Anchorite can add +2 DICE to its Dash ACTIONS, but it automatically gains one BLOOD MARKER if it succeeds in a Dash ACTION.',
    ],
    handedness: HandednessType.NO_HANDS
  },
  {
    id: 'tc-eq-methodius-sacred-geometry',
    name: 'Sacred Geometry',
    type: 'Equipment',
    range: '-',
    description:
      'The monk controlling this Anchorite is well-versed in geometries intended to make the viewer see the world through mathematics and, through this understanding, gains a better understanding of the divine. This allows the Anchorite to target its enemies with far more accuracy.',
    modifiers: ['+1 DICE to Ranged'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['This upgrade increases its Ranged Characteristic to +1 DICE.'],
    handedness: HandednessType.NO_HANDS
  },
  {
    id: 'tc-eq-methodius-grand-anchorite',
    name: 'Grand Anchorite',
    type: 'Equipment',
    range: '-',
    description:
      'Built to an extraordinary size, the Anchorite Shrine is all but impossible to stop or slow down once it starts moving.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'The Anchorite Shrine can always move out of Melee combat with any enemy without the enemy having a chance to attack it. Additionally, it can move out of Melee combat as part of a Standard Move, Charge or Dash.',
    ],
    handedness: HandednessType.NO_HANDS
  },
  {
    id: 'tc-eq-methodius-piston-legs',
    name: 'Piston Legs',
    type: 'Equipment',
    range: '-',
    description:
      'The feet of the Anchorite Shrine are equipped with special piston engines designed to grind its enemies into a shattered ruin of broken bones and burst flesh.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Once during its Activation, the Anchorite Shrine may make an extra Melee Attack ACTION against a Downed enemy model on a 32mm or smaller base. Resolve the attack as if the Anchorite Shrine was armed with a Trench Club.',
    ],
    handedness: HandednessType.NO_HANDS
  },
  {
    id: 'tc-eq-methodius-hallowed-anchorite',
    name: 'Hallowed Anchorite',
    type: 'Equipment',
    range: '-',
    description:
      'The anchorite has been anointed with holy Chrism, the oil made of pure myrrh, the ash from burnt icons and fifty-six other sacred ingredients. This makes the Anchorite pleasing to the Lord and its blessings can become manifold over time.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['This Anchorite can be promoted to ELITE during campaigns.'],
    handedness: HandednessType.NO_HANDS
  },
  {
    id: 'tc-eq-methodius-wrathful-cherub-face',
    name: 'Wrathful Cherub Face',
    type: 'Equipment',
    range: '-',
    description:
      'The Anchorite is decorated with an angelic face that is the very image of the wrath of the Lord. All must cower before the face of the Lord.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'If the model fighting the Shrine Anchorite in Melee is affected by the Keyword FEAR, one of the ACTIONS it has to take when it is activated must be Retreat from Melee Combat.',
    ],
    handedness: HandednessType.NO_HANDS
  },

  // FIDA'I OF ALAMUT (IRON SULTANATE)
  {
    id: 'tc-eq-golden-khanjar',
    name: 'Golden Khanjar',
    type: '1-handed',
    range: 'Melee',
    description:
      'Placed on a hand of an especially favoured killer by the Old Man of the Mountain himself, these wickedly curved daggers gleam as if they were made of gold, but instead they are crystallised poison, and allow their wielder to attack twice in the same instance of time. Only the Master of Alamut himself knows the secret of making these blades.',
    modifiers: ['+1 to Injury rolls'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Adds +1 to injury rolls (i.e. a roll of 7 on the Injury Chart becomes 8). A model armed with a Golden Khanjar can make two attacks instead of one in melee with one Melee Attack ACTION. This effect also applies to a Golden Khanjar wielded off-hand.',
    ],
    handedness: HandednessType.ONE_HANDED
  },
  {
    id: 'tc-eq-bow-of-alamut',
    name: 'Bow of Alamut',
    type: '2-handed',
    range: '40"',
    description:
      'This terrifying double-stringed bow shoots its deadly barbs through both time and space. Its arrows can reach impossible distances and pass through armour by flickering through time. It leaves behind a temporal slipstream that the Assassin can travel through in an eyeblink.',
    modifiers: [],
    keywords: ['CRITICAL'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Ignores Armour. If the Assassin hits a model and causes at least one BLOOD MARKER, the Assassin may instantly place itself into Melee Combat with that model if there is a legal space that the Assassin could occupy within 1" of that model, regardless of the distance to the target or any interposing models/obstacles. The Assassin is considered to have charged that model, although it does not count as a Charge ACTION and therefore the Assassin can take the Move ACTION at a later point on this turn, if it hasn\'t already. Note that if the bow takes the target Out of Action, no BLOOD MARKERS are caused and this movement cannot be made.',
    ],
    handedness: HandednessType.TWO_HANDED
  },
  {
    id: 'tc-eq-hashashin-leaf',
    name: 'Hashashin Leaf',
    type: 'Equipment',
    range: '-',
    description:
      'These leaves from the secret Garden of Alamut enhance the strength of anyone who eats them threefold. Once the effect wears off the subject will suffer from agonising muscle tears and ripping of ligaments, but many of the Order of Assassins feel that this is a small price to pay for being able to use deadlier weapons.',
    modifiers: [],
    keywords: ['CONSUMABLE'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Before the battle begins, a model may use this item to gain the Keyword STRONG until the end of a battle.',
    ],
    handedness: HandednessType.NO_HANDS
  },

  // HOUSE OF WISDOM (IRON SULTANATE)
  {
    id: 'tc-eq-elixir-of-al-khidr',
    name: 'Elixir of Al-Khidr',
    type: 'Equipment',
    range: '-',
    description:
      'An extraordinary creation of the House of Wisdom. It is said that within its Gardens is the hidden Fountain of Life that is used as an ingredient of this powerful Alchemical formula.',
    modifiers: [],
    keywords: ['CONSUMABLE'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Gives the model consuming the Elixir Keyword TOUGH for the duration of a single battle. It cannot be given to Lions of Jabir, Brazen Bulls or Homunculi.',
    ],
    handedness: HandednessType.NO_HANDS
  },
  {
    id: 'tc-eq-fire-shield',
    name: 'Fire Shield',
    type: 'Shield',
    range: '-',
    description:
      'An Invention of the al-Jazari school of engineering within the House of Wisdom, this shield is treated with an Alchemical formula, making it highly resistant to fire weapons. It has proven its value in many desperate battles against the flame-wielding Heretics.',
    modifiers: ['-1 to Injury rolls'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Always takes one hand to use in both melee and in ranged combat. Grants -1 to all injury rolls against the model. This bonus stacks with any armour the model wears, unless otherwise indicated. Any attack against this model that has the Keyword FIRE will suffer -1 DICE on injury rolls and will not cause an additional BLOOD MARKER.',
    ],
    handedness: HandednessType.ONE_HAND_REQUIRED
  },

  // STOSSTRUPPPEN OF THE FREE STATE OF PRUSSIA (NEW ANTIOCH)
  {
    id: 'tc-eq-tank-splitter-sword',
    name: 'Tank-Splitter Sword',
    type: 'Melee Weapon',
    range: 'Melee',
    description:
      'It takes years of gruelling Mensur practice and field drills to acquire the required precision and speed to use the specialist tank-splitter swords of the Gardekorps. Despite their great size (often over 6 feet long!) they are remarkably light, and due to the large quantities of Orichalcum used in their forging process, they are virtually unbreakable.',
    modifiers: ['+1D to Injury Rolls'],
    keywords: ['CUMBERSOME', 'CRITICAL'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Critical Hit: Roll an extra dice for injury tests. Tanks and Vehicle targets that are hit by this weapon suffer -2 to their Armour Saving Throws. After every attack, the using model must pass a Body Test or the Tank-Splitter Sword is damaged and cannot be used for the remainder of the battle. If the model is attacking a vehicle and passes the Body Test with a critical, the targeted vehicle is immediately immobilized and must roll DICE to see if it explodes with a result of 10+!',
    ],
    handedness: HandednessType.TWO_HANDED
  },

  // KINGDOM OF ALBA ASSAULT DETACHMENT (NEW ANTIOCH)
  {
    id: 'tc-eq-lochaber-axe',
    name: 'Lochaber axe',
    type: '2-handed',
    range: 'Melee',
    description:
      'Tuagh-chatha axes combine the power of the Great Axe with the defensive qualities of a polearm. Its wicked spike has stopped many a Heretic in their tracks. The Dùn Èideann Guard are especially adept at their use.',
    modifiers: ['+1 to Injury rolls'],
    keywords: ['HEAVY', 'CRITICAL', 'CUMBERSOME'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'All injuries are rolled with +1 added to the result (i.e. a roll of 7 on the Injury Chart becomes 8). Models equipped with a Lochaber Axe impose a -1 DICE to hit penalty on any charging enemies in Melee combat. This only applies when a charging model attacks, not in subsequent rounds of Melee.',
    ],
    handedness: HandednessType.TWO_HANDED
  },

  // EXPEDITIONARY FORCES OF ABYSSINIA (NEW ANTIOCH)
  {
    id: 'tc-eq-shotel',
    name: 'Shotel',
    type: '1-handed',
    range: 'Melee',
    description:
      "Since the days of ancient Axum, the Shotel has been the weapon of choice for the Abyssinian warrior-elite. Its curved blade is designed to reach around an opponent's shield and stab them in vital areas, such as the kidneys or lungs.",
    modifiers: [],
    keywords: ['CRITICAL'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      "The Shotel is specifically designed to overcome enemy shields. It ignores the target's penalty to injury rolls from its shield, if any. The Holy Icon Shield and similar effects still apply.",
    ],
    handedness: HandednessType.ONE_HANDED
  },
  {
    id: 'tc-eq-holy-water-of-lalibela',
    name: 'Holy Water of Lalibela',
    type: 'Equipment',
    range: '-',
    description:
      'Vials of holy water from the rock-hewn Churches of Lalibela are carried by the Ethiopian warriors on their campaigns. It has great power over demonic entities and aids in healing.',
    modifiers: [],
    keywords: ['CONSUMABLE'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'This model gains +1 DICE on any ACTION that would remove one or more BLOOD MARKERS or INFECTION MARKERS if successful.',
    ],
    handedness: HandednessType.NO_HANDS
  },
  {
    id: 'tc-eq-anfarro',
    name: "Anfarro (Warrior's Crown)",
    type: 'Equipment',
    range: '-',
    description:
      "An Anfarro is made from a ring of lion's mane hair, held in a filigree gilt metal coronet studded with blue and red gemstones. It is granted by the Emperor to an aristocratic warrior and lion hunter as a token of honour and bravery.",
    modifiers: ['+1 DICE to Melee'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      "This model's Melee characteristic is improved by +1 DICE (as only the best warriors are granted the honour of wearing an Anfarro). This model is also immune to FEAR. Note that the Anfarro cannot be worn together with a helmet.",
    ],
    handedness: HandednessType.NO_HANDS
  },
  {
    id: 'tc-eq-tabot',
    name: 'Tabot',
    type: 'Equipment',
    range: '-',
    description:
      'Made from alabaster, marble or wood from an acacia tree, these are blessed replicas of the Ark of the Covenant. A priest that accompanies the forces of the King of Kings to New Antioch, they will take the holy Tabot with them, wrapped in silk cloth decorated with gold string.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Each time an ACTION is taken by any model of your warband that heals one or more BLOOD MARKERS or INFECTION MARKERS, the model carrying the Tabot gains one BLESSING MARKER.',
    ],
    handedness: HandednessType.NO_HANDS
  },
]

// Create a type guard function to validate equipment objects
function isValidEquipment(item: any): item is Equipment {
  return (
    item &&
    typeof item === 'object' &&
    'id' in item &&
    'name' in item &&
    'type' in item &&
    'costPerVariant' in item &&
    typeof item.costPerVariant === 'object' &&
    Object.keys(item.costPerVariant).length > 0
  );
}

// Function to ensure all equipment items meet the Equipment interface requirements
function ensureValidEquipment(items: any[]): Equipment[] {
  return items.filter(isValidEquipment);
}

// Function to ensure all equipment items have valid costPerVariant entries
function ensureValidCostPerVariant(items: any[]) {
  items.forEach(item => {
    if (!item.costPerVariant) {
      // If costPerVariant doesn't exist, create it with a default No Variant value
      item.costPerVariant = {
        'No Variant': createDucatsCost(0)
      };
      return;
    }

    // Check if this is variant-specific equipment
    const isVariantSpecific = item.onlyFor && item.onlyFor.warbandVariant;

    // Don't add "No Variant" to variant-specific items
    if (isVariantSpecific) {
      // Make sure the specified variant is in costPerVariant
      if (item.onlyFor.warbandVariant && !item.costPerVariant[item.onlyFor.warbandVariant]) {
        // If missing, copy an existing cost or create a default
        const firstVariant = Object.keys(item.costPerVariant)[0];
        if (firstVariant) {
          item.costPerVariant[item.onlyFor.warbandVariant] = item.costPerVariant[firstVariant];
        } else {
          item.costPerVariant[item.onlyFor.warbandVariant] = createDucatsCost(0);
        }
      }

      // Remove "No Variant" if it exists for variant-specific items
      if (item.costPerVariant['No Variant']) {
        delete item.costPerVariant['No Variant'];
      }
    }
    // For non-variant-specific items, ensure they have a "No Variant" entry
    else if (!item.costPerVariant['No Variant']) {
      // Use the first cost value as the default
      const firstVariant = Object.keys(item.costPerVariant)[0];
      if (firstVariant) {
        item.costPerVariant['No Variant'] = item.costPerVariant[firstVariant];
      } else {
        // If no costs exist, set a default of 0 ducats
        item.costPerVariant['No Variant'] = createDucatsCost(0);
      }
    }
  });
}

// Apply the cost fixes before creating the final seed data
ensureValidCostPerVariant(meleeWeapons);
ensureValidCostPerVariant(rangedWeapons);
ensureValidCostPerVariant(armorItems);
ensureValidCostPerVariant(equipmentItems);
ensureValidCostPerVariant(uniqueTroopEquipment);
ensureValidCostPerVariant(uniqueWarbandVariantEquipment);

/**
 * Combined equipment data for seeding the Firestore database
 */
export const equipmentSeed: Equipment[] = ensureValidEquipment([
  ...meleeWeapons,
  ...rangedWeapons,
  ...armorItems,
  ...equipmentItems,
  ...uniqueTroopEquipment,
  ...uniqueWarbandVariantEquipment,
]);
