import { createDucatsCost, createGloryPointsCost } from '../models/cost'
import type { Equipment } from '../models/equipment'

// Define melee weapons
const meleeWeapons: Equipment[] = [
  {
    id: 'tc-eq-un',
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
    id: 'tc-eq-kd',
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
    id: 'tc-eq-tc',
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
    id: 'tc-eq-sa',
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
    id: 'tc-eq-ba',
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
    id: 'tc-eq-sk',
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
    id: 'tc-eq-bs',
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
    id: 'tc-eq-pr',
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
    id: 'tc-eq-ap',
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
    id: 'tc-eq-br',
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
    id: 'tc-eq-ts',
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
    id: 'tc-eq-sa',
    name: 'Standard Armour',
    type: 'Armour',
    description: 'Basic protective armor offering moderate protection',
    cost: createDucatsCost(7),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['-1 to all Injury Chart rolls against the model. Can be combined with any shield.'],
  },
  {
    id: 'tc-eq-ra',
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
    id: 'tc-eq-ch',
    name: 'Combat Helmet',
    type: 'Equipment',
    description: 'The simple combat helmet has proven its value on the battlefield time and again.',
    cost: createDucatsCost(3),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Ignores additional BLOOD MARKERS caused by the Keyword SHRAPNEL.'],
  },
  {
    id: 'tc-eq-ic',
    name: 'Iron Capirote',
    type: 'Equipment',
    description:
      'A conical helmet blessed by the Church and often containing a fragment of a relic. Iron Capirotes shield their wearers from the psychological horror of war and allow them to face creatures from the pits of Hell unflinchingly.',
    cost: createDucatsCost(0),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Negates the additional BLOOD MARKERS from weapons with SHRAPNEL Keyword. Makes the model immune to the effects of FEAR.',
    ],
  },
  {
    id: 'tc-eq-mk',
    name: 'Medi-kit',
    type: 'Equipment',
    description:
      'Battlefield first aid has brought many soldiers back from the brink of death. Blessed ointments can seal fatal wounds completely, while the black blood of demons used by twisted heretic medics allows mangled troops to return to the fray.',
    cost: createDucatsCost(5),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Models with a Medi-kit can take a RISKY ACTION to remove one BLOOD MARKER from any one friendly model (including themselves) within 1" range or allow one friendly model (including themselves) that is Down to regain their footing.',
    ],
  },
  {
    id: 'tc-eq-gm',
    name: 'Gas Mask',
    type: 'Equipment',
    description:
      'Mustard Gas, phosgene, chlorine as well as noxious fumes from the bolgias of Hell plague the battlefield. The Gas Mask allows soldiers to withstand such attacks.',
    cost: createDucatsCost(4),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Negates the extra BLOOD MARKER from attacks with the keyword GAS. Any such attacks suffer -1 DICE penalty to all injury rolls.',
    ],
  },
  {
    id: 'tc-eq-hr',
    name: 'Holy Relic',
    type: 'Equipment',
    description:
      'Due to the threat to all Creation, the churches, cathedrals and basilicas have emptied their reliquaries and distributed their relics to the frontline troops to aid them in their battle against the damned.',
    cost: createGloryPointsCost(1),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['This model starts each game with +1 BLESSING MARKER.'],
  },
  {
    id: 'tc-eq-apb',
    name: 'Armour-Piercing Bullets',
    type: 'Equipment',
    description:
      'Advanced armour technology has forced the armouries of the Great War to forge new types of bullets. Expensive and labour-intensive to produce, these hardened tungsten rounds are more effective against battlefield armour.',
    cost: createDucatsCost(0),
    modifiers: [],
    keywords: ['CONSUMABLE'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Before the battle begins, a model may use this item to grant a rifle or pistol weapon that they are equipped with the following ability: Reduce the injury penalty from Armour and Shields by 1 until the end of the battle. Keyword: CONSUMABLE.',
    ],
  },
  {
    id: 'tc-eq-ddb',
    name: 'Dum-Dum Bullets',
    type: 'Equipment',
    description:
      'These hollow-point bullets are far more likely to cause fatal wounds than standard ammunition.',
    cost: createDucatsCost(0),
    modifiers: [],
    keywords: ['CONSUMABLE', 'CRITICAL'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Before the battle begins, a model may use this item to grant a rifle or pistol weapon that they are equipped with the CRITICAL keyword until the end of the battle. Keywords: CONSUMABLE, CRITICAL.',
    ],
  },
  {
    id: 'tc-eq-ia',
    name: 'Incendiary Ammunition',
    type: 'Equipment',
    description:
      'Developed by Aym, the Great Duke of Hell, these bullets set any target they hit on fire.',
    cost: createDucatsCost(0),
    modifiers: [],
    keywords: ['FIRE', 'CONSUMABLE'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Before the battle begins, a model may use this item to grant a rifle or pistol weapon that they are equipped with the FIRE keyword until the end of the battle. Keywords: FIRE, CONSUMABLE.',
    ],
  },
  {
    id: 'tc-eq-tb',
    name: 'Tracer Bullets',
    type: 'Equipment',
    description: 'Tracer bullets allow soldiers to adjust their aim efficiently.',
    cost: createDucatsCost(0),
    modifiers: [],
    keywords: ['CONSUMABLE'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Before the battle begins, a model may use this item to grant a rifle or pistol weapon that they are equipped with +1D to hit with ranged attacks until the end of the battle. Keywords: CONSUMABLE.',
    ],
  },
  {
    id: 'tc-eq-ss',
    name: 'Sniper Scope',
    type: 'Equipment',
    description:
      'These optical aiming devices are favoured by Snipers to aid in their aiming at long distances.',
    cost: createDucatsCost(7),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Negates the penalty for Long Range if the model has not moved during this Activation. Only usable with rifles (i.e. weapons which have the Keyword rifle in their name).',
    ],
  },
  {
    id: 'tc-eq-sh',
    name: 'Shovel',
    type: 'Equipment',
    description:
      'Battlefield shovel allows troops to dig in and fight from cover in virtually any battlefield.',
    cost: createDucatsCost(2),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'A model equipped with a shovel always starts the game in cover if deployed on ground level, even if placed in open terrain. As soon as the model moves, it is no longer in cover. A model that is covered in this way retains the benefit of Cover even if the attacking model has an unobstructed view of it. If a model equipped with a shovel has two hands free, it can use it in Melee Combat as if it were a Trench Club.',
    ],
  },
  {
    id: 'tc-eq-tf',
    name: 'Troop Flag',
    type: 'Equipment',
    description:
      'Most warbands and units carry banners, flags, standards, pennants or other symbols to rally the troops.',
    cost: createDucatsCost(0),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Grants +1 DICE for all Morale tests as long as the model with the flag is not Down or Out of Action. Requires one hand to use.',
    ],
  },
  {
    id: 'tc-eq-mp',
    name: 'Martyrdom Pills',
    type: 'Equipment',
    description:
      'Martyrdom pills are a potent mixture of mind-altering drugs and chemicals that inure a soldier against all pain and injury. However, it takes a tremendous toll on the body.',
    cost: createDucatsCost(0),
    modifiers: [],
    keywords: ['CONSUMABLE'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Before the battle begins, a model may use this item. If it does, injuries rolled against it suffer -1 DICE until the end of the battle and the model is not affected by FEAR. Keywords: CONSUMABLE.',
    ],
  },
  {
    id: 'tc-eq-ut',
    name: 'Unholy Trinket',
    type: 'Equipment',
    description: 'A small token infused with unholy power.',
    cost: createDucatsCost(0),
    modifiers: [],
    keywords: ['CONSUMABLE'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'When a model equipped with an Unholy Trinket fails a RISKY ACTION, that model may use this item. If it does, its Activation is not ended. Keyword: CONSUMABLE.',
    ],
  },
  {
    id: 'tc-eq-ur',
    name: 'Unholy Relic',
    type: 'Equipment',
    description:
      'An artefact bestowed with unholy power. Examples include Nephilim heads, desecrated splinters of the True Cross or mummified body parts of fallen saints and bishops.',
    cost: createDucatsCost(0),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'A model equipped with an Unholy relic radiates a truly malignant aura and causes FEAR.',
    ],
  },
  {
    id: 'tc-eq-bi',
    name: 'Blessed Icon',
    type: 'Equipment',
    description:
      "Small icons of saints, great angels and holy warriors are a common sight amongst the Trench Pilgrims. They are hung on rosaries, belts, or attached to portable shrines carried on the Pilgrims' backs.",
    cost: createDucatsCost(0),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'When a model equipped with a Blessed Icon fails a RISKY ACTION, that model may use this item. If it does, its Activation is not ended. Can be used once per battle.',
    ],
  },
  {
    id: 'tc-eq-ibm',
    name: 'Infernal Brand Mark',
    type: 'Equipment',
    description:
      'A Heretic who has made a Holy Pilgrimage into Hell itself is branded by their patron devil with an ever-burning mark. Mortal fire no longer has the power to harm them.',
    cost: createDucatsCost(0),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Negates the extra BLOOD MARKER from attacks with the keyword FIRE. Any such attacks suffer -1 DICE penalty to all injury rolls.',
    ],
  },
  {
    id: 'tc-eq-fs',
    name: 'Field Shrine',
    type: 'Equipment',
    description:
      'Holy reliquaries, blessed artefacts and sacred crosses are often carried to the battlefield to encourage the troops, while the Heretics bring idols of the Golden Calf, tortured captives or other wicked totems to bear.',
    cost: createDucatsCost(0),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Can be placed on the battlefield in your deployment zone. Acts as three models for Morale Tests. It has a base size of 40mm. Can be destroyed if any type of attack hits it.',
    ],
  },
  {
    id: 'tc-eq-hsc',
    name: 'Hellbound Soul Contract',
    type: 'Equipment',
    description:
      'An infernal contract signed by a Heretic and the devil who will come to collect the damned soul when death is close. The mortal signatory bursts into infernal flames when seriously wounded.',
    cost: createDucatsCost(0),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'When this model is taken Out of Action, any model in melee combat with them immediately suffers +1 BLOOD MARKER unless the model ignores damage from sources with the Keyword FIRE.',
    ],
  },
  {
    id: 'tc-eq-bn',
    name: 'Binoculars',
    type: 'Equipment',
    description:
      'It is quite common for officers to carry finely-crafted battlefield binoculars with them on the battlefield to survey the land ahead, spot hidden enemy troops and observe any sign of movement.',
    cost: createDucatsCost(0),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Any enemy Infiltrator cannot be placed closer than 16" of this model.'],
  },
  {
    id: 'tc-eq-mi',
    name: 'Musical Instrument',
    type: 'Equipment',
    description:
      'Horns, drums, trumpets, whistles, bagpipes and many other types of instruments are used extensively in the battles of the Great War. They can bolster the hearts of those facing the horrors of Hell – or they can recite terrifying hymns praising the lords of the Inferno!',
    cost: createDucatsCost(0),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Any friendly models within 4" of the musician who is not Down can add +1 DICE to their Dash ACTIONS. Musical Instruments take one hand to use at all times as if it were a weapon.',
    ],
  },
  {
    id: 'tc-eq-mk',
    name: 'Mountaineer Kit',
    type: 'Equipment',
    description:
      'This kit includes ropes, carabiners, slings, mountaineering harness and pitons to aid a soldier in overcoming almost any vertical obstacle.',
    cost: createDucatsCost(0),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['A model with this kit adds +1 DICE to any Climbing ACTION rolls.'],
  },
]

const uniqueTroopEquipment: Equipment[] = [
  {
    id: 'tc-eq-cm',
    name: 'Chainmaw',
    type: 'Equipment',
    description:
      'The War Wolf treats its Chainsaw Mouth as a melee weapon with the Keyword RISKY that grants a +1 DICE bonus to hit (for total of +3D). Additionally, the attack ignores any armour worn by the target and has a +1 DICE bonus to injure. The Chainsaw Mouth does not take any hands to wield.',
    cost: createDucatsCost(0),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'The War Wolf treats its Chainsaw Mouth as a melee weapon with the Keyword RISKY that grants a +1 DICE bonus to hit (for total of +3D). Additionally, the attack ignores any armour worn by the target and has a +1 DICE bonus to injure. The Chainsaw Mouth does not take any hands to wield.',
    ],
    onlyFor: { troops: ['War Wolf Assault Beast'] },
  },
  {
    id: 'tc-eq-sc',
    name: 'Shredding Claws',
    type: 'Equipment',
    description:
      'The War Wolf treats its Shredding Claws as a two-handed melee weapon with the Keywords RISKY and CUMBERSOME. The Shredding Claws have a +1 DICE bonus to injure. Because the Shredding Claws are wielded alongside the Chainsaw Mouth, they are treated as an Off-Hand Weapon and suffer penalties accordingly.',
    cost: createDucatsCost(0),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'The War Wolf treats its Shredding Claws as a two-handed melee weapon with the Keywords RISKY and CUMBERSOME. The Shredding Claws have a +1 DICE bonus to injure. Because the Shredding Claws are wielded alongside the Chainsaw Mouth, they are treated as an Off-Hand Weapon and suffer penalties accordingly.',
    ],
    onlyFor: { troops: ['War Wolf Assault Beast'] },
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
  ...uniqueTroopEquipment,
]
