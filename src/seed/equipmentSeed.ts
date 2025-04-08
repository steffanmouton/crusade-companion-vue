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
    id: 'tc-eq-hellblade',
    name: 'Hellblade',
    type: 'Melee Weapon',
    description: 'Crafted from iron ore from the mines of Dis in Inferno, this weapon burns with the unquenchable fires of Hell.',
    range: 'Melee',
    modifiers: ['+1D Injuries'],
    keywords: ['FIRE'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['The Hellblade has +1 DICE when rolling for injuries. It also has the Keyword FIRE, so it causes an additional +1 BLOOD MARKER on enemies it hits. '],
    handedness: HandednessType.TWO_HANDED,
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
    id: 'tc-eq-trench-polearm',
    name: 'Trench Polearm',
    type: 'Melee Weapon',
    description: 'Trench pikes, billhooks, spears and other long polearms are excellent defensive weapons, but are cumbersome and heavy. They are often used to deal with barbed wire.',
    range: 'Melee',
    modifiers: ['-1D to hit for Chargers'],
    keywords: ['CUMBERSOME'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Polearms take two hands to use. Melee attacks made against this model are made with -1 DICE if the attacking model Charged this turn.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
  {
    id: 'tc-eq-scourge-battle-whip-flail',
    name: 'Scourge/Battle Whip/Flail',
    type: 'Melee Weapon',
    description: 'The metal whips of the Church are supremely good at both instilling discipline in the ranks of the faithful and tormenting the heretics. Many devils also enjoy using these weapons due to the excruciating pain they inflict. These weapons are extremely difficult to dodge.',
    range: 'Melee',
    modifiers: ['+1D to Hit'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Add +1 DICE to their Hit Rolls. This bonus does not apply if used as an off-hand weapon.'],
    handedness: HandednessType.ONE_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
  {
    id: 'tc-eq-double-handed-blunt-weapon',
    name: 'Double-Handed Blunt Weapon',
    type: 'Melee Weapon',
    description: 'Mauls, clubs, maces… these are large, cumbersome weapons, often made from sturdy wood with a metal tip of steel, lead or Iron of Tartarus. It takes great strength to fight with it for any length of time. They are especially suited for attacking armoured targets.',
    range: 'Melee',
    modifiers: ['+1 to Injury rolls'],
    keywords: ['HEAVY'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['When using this weapon add +1 to all injury rolls (example: a roll of 7 on 2D6 becomes 8).'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
  {
    id: 'tc-eq-great-sword-axe',
    name: 'Great Sword/Axe',
    type: 'Melee Weapon',
    description: 'Claymore, Zweihanders and even huge battle axes are used in the trenches when bullets fail to stop quick or well-armoured targets. The strikes from these weapons can easily lop off limbs and heads.',
    range: 'Melee',
    modifiers: ['+1D to Injuries'],
    keywords: ['HEAVY', 'CRITICAL'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Rolls all injuries with +1 DICE.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
  {
    id: 'tc-eq-misericordia',
    name: 'Misericordia',
    type: 'Melee Weapon',
    description: 'The misericordia dagger is designed to put enemies out of their misery by finding chinks in the armour: eye slits, neck joints and so forth.',
    range: 'Melee',
    modifiers: ['Ignore Armour'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Ignores the armour of opponents that are Down.'],
    handedness: HandednessType.ONE_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  }
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
  {
    id: 'tc-eq-semi-automatic-rifle',
    name: 'Semi-automatic Rifle',
    type: 'Ranged Weapon',
    description: 'Semi-automatic rifles are said to be an invention of Marbas, the Devil who holds great wisdom and knowledge in mechanical arts. They are excellent both at long range and in assault, combining accuracy and high rate of fire, though they are prone to jamming.',
    range: '24"',
    modifiers: [],
    keywords: ['ASSAULT'],
    equipmentIndicator: { hasBayonetLug: true, shieldCombo: false },
    rules: [],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-automatic-rifle',
    name: 'Automatic Rifle',
    type: 'Ranged Weapon',
    description: 'A marvel of modern engineering, only a few prototypes exist. It has a high rate of fire and can be quickly re-loaded',
    range: '24"',
    modifiers: ['2 attacks'],
    keywords: ['ASSAULT'],
    equipmentIndicator: { hasBayonetLug: true, shieldCombo: false },
    rules: ['A model armed with an Automatic Rifle can make two attack ACTIONS instead of one. Both attacks must be against the same target.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-shotgun',
    name: 'Shotgun',
    type: 'Ranged Weapon',
    description: 'Short-barrelled pump action shotgun loaded with six rounds containing antimony hardened 00 buckshot, the combat shotgun is ideal for short-range engagements, clearing trenches and taking out lightly-armoured infantry. Often featuring stocks made of walnut or other rare wood, it is a custom of the troops to decorate these arms with carvings and inscriptions.',
    range: '12"',
    modifiers: ['+1D to Hit'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: true, shieldCombo: false },
    rules: ['Owing to its high accuracy, add +1 DICE to all rolls to hit and ignore the penalty to hit rolls when attacking at long range. However, injuries are rolled with -1 DICE at long range due to the low penetration power'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-automatic-shotgun',
    name: 'Automatic Shotgun',
    type: 'Ranged Weapon',
    description: 'This shotgun is equipped with an auto-loader, a recent invention by the Prussian engineering corps of Königsberg. It is ideal for close quarter combat thanks to its high rate of power and accuracy. The technology has not been perfected, however, and sometimes leads to misfeeds and jams.',
    range: '12"',
    modifiers: ['+1D to Hit'],
    keywords: ['ASSAULT'],
    equipmentIndicator: { hasBayonetLug: true, shieldCombo: false },
    rules: [' Owing to its high accuracy, add +1 DICE to all rolls to hit and ignore the penalty to hit rolls when attacking at long range. However, injuries are rolled with -1 DICE at long range due to the low penetration power.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-heavy-shotgun',
    name: 'Heavy Shotgun',
    type: 'Ranged Weapon',
    description: 'Mostly used by Mechanized Heavy Infantry, this massive 8 bore shotgun is used to take down extremely powerful and large opponents at short range. It is known as a “Wolf-Killer” in New Antioch as it is the weapon favoured by the soldiery of the Duke to take down the Heretic War Wolf assault beasts. Heavy Shotguns use tungsten-orichalcum alloy shot which explains their enormous stopping power at short ranges',
    range: '12"',
    modifiers: ['+1D to Attacks', '+2D to injuries at Short Range'],
    keywords: ['HEAVY'],
    equipmentIndicator: { hasBayonetLug: true, shieldCombo: false },
    rules: ['This weapon rolls attacks with +1 DICE and rolls injuries at Short Range with +2 DICE'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-submachine-gun',
    name: 'Submachine Gun',
    type: 'Ranged Weapon',
    description: 'The submachine gun (or SMG) is a fully automatic firearm, trading lower penetration power and range for a much higher rate of fire. Ideal for short-range engagements, it is much sought-after by warbands despite its scarcity and high cost.',
    range: '12"',
    modifiers: ['2 attacks'],
    keywords: ['ASSAULT'],
    equipmentIndicator: { hasBayonetLug: true, shieldCombo: false },
    rules: ['Can make two attack ACTIONS instead of one. These can be against a single target or two separate ones.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-musket',
    name: 'Musket',
    type: 'Ranged Weapon',
    description: 'A primitive weapon from a bygone age, the musket is a smooth bore long rifle that shoots lead balls. It still sees widespread use due to its simple construction and low price.',
    range: '18"',
    modifiers: ['-1D Injury'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: true, shieldCombo: false },
    rules: ['Due to its low power, add -1 DICE for all Injury Chart rolls with the musket.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-silenced-pistol',
    name: 'Silenced Pistol',
    type: 'Ranged Weapon',
    description: 'A sophisticated sidearm made of Orichalcum or other holy metals, or from Infernal iron taken from the very prisons of Hell to muffle the wails of the damned. It is virtually silent and is excellent for ambushes or for shooting from behind cover',
    range: '12"/Melee',
    modifiers: ['+1D to Hit in Cover'],
    keywords: ['ASSAULT'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['A model armed with a silenced pistol can use it in melee as well as ranged combat (using Ranged Characteristic), including as an off-hand weapon to execute an additional melee attack. Add +1 DICE to hit rolls if shot from behind any terrain obstacles.'],
    handedness: HandednessType.ONE_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-sniper-rifle',
    name: 'Sniper Rifle',
    type: 'Ranged Weapon',
    description: 'A sniper rifle is a high-precision, long-range rifle, widely used in the trenches to pick off high value targets such as officers, sappers and artillery crews. Expensive and rare, they are commonly given to the best marksmen and sharpshooters of the warband.',
    range: '48"',
    modifiers: ['+1D to Hit'],
    keywords: ['RISKY', 'CRITICAL'],
    equipmentIndicator: { hasBayonetLug: true, shieldCombo: false },
    rules: ['This weapon rolls attacks with +1 DICE. On a Critical attack roll, this weapon ignores armour. If this model is equipped with a Scope, this weapon ignores the penalty for Long Range.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-grenades',
    name: 'Grenades',
    type: 'Grenade',
    description: 'Grenades or hand bombs are a staple of trench warfare. Grenades can kill the enemy underground or behind cover. They can also force the enemy into the open, providing targets for rifle and machine gun fire.',
    range: '8"',
    modifiers: [],
    keywords: ['ASSAULT', 'SHRAPNEL', 'BLAST 2"'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Grenades have BLAST 2” – all models within 2” of a model are hit but models other than the original target roll Injuries with -1 DICE.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.GRENADE
  },
  {
    id: 'tc-eq-incendiary-grenades',
    name: 'Incendiary Grenades',
    type: 'Grenade',
    description: 'Incendiary grenades can set their target alight with sulphur, phosphorous or flammable gas captured from the Lake of Fire in the 7th Circle of Hell.',
    range: '8"',
    modifiers: [],
    keywords: ['ASSAULT', 'FIRE'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Hand grenades have BLAST 2” – all models within 2” of a model are hit but models other than the original target roll Injuries with -1 DICE.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.GRENADE
  },
  {
    id: 'tc-eq-gas-grenades',
    name: 'Gas Grenades',
    type: 'Grenade',
    description: 'Gas Grenades are insidious weapons, attacking the lungs and other internal organs with noxious fumes. Devil Alchemists of the 5th Circle are especially clever in creating these fiendish and hated weapons.',
    range: '8"',
    modifiers: ['-1D Injury'],
    keywords: ['ASSAULT', 'GAS', 'BLAST 3"'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Gas Grenades ignore all penalties for cover and armour but roll injuries with -1 DICE. They have BLAST 3” – they hit all models within 3” of a target they hit.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.GRENADE
  },
  {
    id: 'tc-eq-grenade-launcher',
    name: 'Grenade Launcher',
    type: 'Ranged Weapon',
    description: 'Modifications of great siege rifles designed to lob grenades over long distances.',
    range: '36"',
    modifiers: ['Ignore Cover'],
    keywords: ['SHRAPNEL','HEAVY', 'BLAST 3"'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Ignores all penalties for cover. This weapon has a BLAST radius of 3” – all models within this range are hit.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-satchel-charge',
    name: 'Satchel Charge',
    type: 'Grenade',
    description: 'Battlefield explosives designed to break apart enemy fortifications and to crack even the toughest of armour.',
    range: '6"',
    modifiers: ['+1D Injury', 'Ignore Armour'],
    keywords: ['HEAVY', 'BLAST 3"', 'CONSUMABLE'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['You can aim the Satchel Charge at either a 1mm x 1mm point on the ground or an enemy model within range. Next, take a Ranged Attack ACTION. If the roll fails (i.e. you roll 6 or less), the bomb lands 1” away from its intended location, multiplied by the number representing the degree of failure (for example, if you rolled 5, the bombard shot lands 2” away, as 7-5=2). The direction is decided by your opponent.', 'A Satchel Charge adds +1 DICE to injury rolls.', 'If the Satchel Charge lands directly on top of a model, it ignores that model’s armour.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.GRENADE
  },
  {
    id: 'tc-eq-anti-material-rifle',
    name: 'Anti-Material Rifle',
    type: 'Ranged Weapon',
    description: 'Enormous long rifles designed to take out heavily armoured targets, vehicles and strongpoints. With the powerful armour available to the armies of the Great war, these terrifying weapons are much in demand. A downside is their enormous weight and terrifying recoil, and thus they are most often used by Communicants or Anointed who possess the supernatural strength to wield such weapons.',
    range: '36"',
    modifiers: ['+1D to Injury'],
    keywords: ['HEAVY', 'CRITICAL'],
    equipmentIndicator: { hasBayonetLug: true, shieldCombo: false },
    rules: ['Ignores armour.', 'Add +1 DICE when rolling on the Injury Chart.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-flamethrower',
    name: 'Flamethrower',
    type: 'Ranged Weapon',
    description: 'A flamethrower is a terrifying weapon capable of projecting great streams of fire and flammable liquids at a distance. It is ideal for clearing bunkers, trenches and other fortifications, killing in a most horrific way. Consequently, it is greatly favoured by the Heretic forces.',
    range: '8"',
    modifiers: ['-1D Injuries', 'Ignore Armour'],
    keywords: ['FIRE'],
    equipmentIndicator: { hasBayonetLug: true, shieldCombo: false },
    rules: ['A Flamethrower hits one model within range automatically with its Attack ACTION. Ignores Armour.', 'Injuries caused by a Flamethrower are rolled with an additional -1 DICE. It also has the Keyword FIRE, so it causes an additional +1 BLOOD MARKER on enemies it hits, even if no other damage is caused.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-heavy-flamethrower',
    name: 'Heavy Flamethrower',
    type: 'Ranged Weapon',
    description: 'These massive flamethrowers are normally mounted on armoured vehicles, but those possessing uncanny strength may use them as infantry weapons.',
    range: '10"',
    modifiers: ['Ignore Armour'],
    keywords: ['HEAVY', 'FIRE'],
    equipmentIndicator: { hasBayonetLug: true, shieldCombo: false },
    rules: ['Hits up to two models within range automatically with an Attack Action as long as they are within 6” of each other and within the Heavy Flamethrower range. Ignores armour.', 'It also has the Keyword FIRE, so it causes an additional +1 BLOOD MARKER on enemies it hits, even if no other damage is caused. '],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  }
]

// Define armor items
const armorItems: Equipment[] = [
  {
    id: 'tc-eq-trench-shield',
    name: 'Trench Shield',
    type: 'Shield',
    description: 'Shields used in trench warfare are made of steel reinforced with Orichalcum to allow them to withstand even high-calibre bullets, or from metal mined from Infernal bedrock and shaped in the armouries of Pandæmonium, the Capital of Hell.',
    modifiers: ['-1 to Injury Chart rolls against the model'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      "Grants -1 to all injury rolls against the model.",
      "Always takes one hand to use in both melee and in ranged combat, and cannot be switched out. This bonus stacks with any armour the model wears, unless otherwise indicated. For the purposes of wielding a 2-handed weapon with the 'Shield Combo' indicator, the Trench Shield does not take a hand to wield but still functions as normal.",
    ],
    handedness: HandednessType.ONE_HAND_REQUIRED,
    category: EquipmentCategory.SHIELD
  },
  {
    id: 'tc-eq-heavy-ballistic-shield',
    name: 'Heavy Ballistic Shield',
    type: 'Shield',
    description: 'These massive shields are made of aramid fibre mesh and orichalcum-steel alloy. They are so heavy that they can only be carried by Heavy Mechanized infantry, and even then they are too cumbersome to be used in fast paced melee. They are mainly used for protection during their ponderous advance towards the enemy. ',
    modifiers: ['Cover against Ranged attacks', 'Defended Obstacle against charging models'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'The target is always considered to be in Cover when shot, and counts as fighting behind a defended obstacle when an enemy charges them.',
      'Always takes one hand to use in both melee and in ranged combat and cannot be switched out. These bonuses cannot be combined with Polearms, shovels, cover or defended obstacles. For the purposes of wielding a 2-handed weapon with the ‘Shield Combo’ indicator, the Heavy Ballstic Shield does not take a hand to wield but still functions as normal.'],
    handedness: HandednessType.ONE_HAND_REQUIRED,
    category: EquipmentCategory.SHIELD
  },
  {
    id: 'tc-eq-standard-armour',
    name: 'Standard Armour',
    type: 'Armour',
    description: 'With the advancements in metallurgy and technology, both Faithful and Heretic armies are well-equipped with suits of alloy armour that can withstand an impact from a bullet or turn aside the sharpest of blades. Standard armour is usually mass-produced, but highly effective even against high-calibre weapons. ',
    modifiers: ['-1 to Injury Chart rolls against the model'],
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
    description: 'Reinforced armour is a master-crafted suit made individually for the most important and elite troops. Each one is richly decorated and often carries the personal device of the warrior who wears it.',
    modifiers: ['-2 modifier to injury rolls against the model'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Grants a -2 modifier to all injury rolls against the model wearing this armour.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.ARMOUR
  },
  {
    id: 'tc-eq-machine-armour',
    name: 'Machine Armour',
    type: 'Armour',
    description: 'Combining the rarest of divine metal alloys and the latest technology of New Antioch, Machine Armour makes its wearer a virtual mobile tank.',
    modifiers: ['-3 modifier to injury rolls against the model'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Grants a -3 modifier to all injury rolls against the model wearing this armour, and treats Down Injury results as a Minor Hit instead (note that the TOUGH Keyword ability to avoid Out of Action with Down overrides this).',
      'Due to its bulk the wearer rolls D3 for a charge extra distance instead of D6.',
      'Machine armour cannot be combined with any shield. Models wearing Machine Armour may have a base size of 40mm if you wish, unless the model wearing it is already on 50mm or bigger base.',
      'If worn by a model that is not part of a New Antioch force/subfaction, the only bonus the armour gives is the -3 injury modifier, as the chemical treatment that allows the wearer to withstand the rigors of the armour is a carefully guarded military secret. D3 charge distance remains in force.'
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.ARMOUR
  },
  {
    id: 'tc-eq-holy-icon-shield',
    name: 'Holy Icon Shield',
    type: 'Shield',
    description: 'These shields are made from icons that have performed miracles. Mounted on blessed wood, they are harder than any steel and virtually indestructible. Only the most revered fighters in the service of the Church ever carry one.',
    modifiers: ['-1 modifier to injury rolls against the model'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Grants -1 to all injury rolls against the model.',
      'This shield is effective even against weapons and attacks that would normally ignore armour.',
      'Takes one hand to use in both melee and in ranged combat.',
    ],
    handedness: HandednessType.ONE_HAND_REQUIRED,
    category: EquipmentCategory.SHIELD
  },
  {
    id: 'tc-eq-holy-icon-armour',
    name: 'Holy Icon Armour',
    type: 'Armour',
    description: 'Only a few of these suits of armour exist in all of Christendom. Covered with miraculous icons this suit of armour is protected by the very hand of Heaven and its wearer can withstand even direct hits from artillery.',
    modifiers: ['-2 modifier to injury rolls against the model'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Grants -1 to all Injury Chart rolls against the model wearing this armour.', 'This armour is effective even against weapons and attacks that would normally ignore armour.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.ARMOUR
  }
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

// HERETIC LEGION And Warband Variants Equipment

const hereticLegionEquipment: Equipment[] = [
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
    description: 'Made in mockery of the rod carried by the Prophet Aaron, the slightest touch from this evil staff causes unimaginable agony due to the hellfire that it produces.',
    range: 'Melee',
    modifiers: [],
    keywords: ['FIRE', 'CRITICAL'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Gives +1 DICE bonus to any other ACTION the model takes apart from Dash, Ranged Attack or Melee Attack.'],
    handedness: HandednessType.ONE_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
  {
    id: 'tc-eq-tartarus-claws',
    name: 'Tartarus Claws',
    type: 'Melee Weapon',
    description: 'Made from severed hands of Malebranche, the Tartarus Claws are granted by Arch-Devils only to those whose hearts are blackened with the sin of Wrath.',
    range: 'Melee',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Tartarus Claws always come as a pair and do not allow the use of any other melee weapons. You can make two Attack ACTIONS with the Claws without the usual -1 DICE for the second attack.', 'If the opponent is taken Down or Out of Action with the Claws you may immediately move the model up to 3”. If the move takes you into contact with another enemy model, this counts as a charge and you can make a second Melee Attack ACTION with the claws. You can only do this follow-up move once per Activation.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
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
  {
    id: 'tc-eq-infernal-bombs',
    name: 'Infernal Bombs',
    type: 'Equipment',
    description: 'Infinitely supplied by the death factories of Third Circle of Hell, these bombs are hurled by the Witch Priests of the Heretic Legions. They explode with a burst of fire and shrapnel, and cause an additional +1 BLOOD MARKER.',
    modifiers: [],
    keywords: ['BLAST 3"', 'SHRAPNEL'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Specify a 1x1mm point on the battlefield within 36" that the Witch can see and that you want to target. Next, make a Ranged Attack ACTION. If the roll fails (i.e. you roll 6 or less with the two lowest Dice), the bomb lands 1" away from its intended location, multiplied by the number representing the degree of failure (for example, if you rolled 5, the bomb lands 2" away, as 7 - 5 = 2). The direction is decided by your opponent.',
      'Roll on the Injury Chart for each model within the BLAST radius. If the bomb lands exactly on top of any model, roll with 3D6 on the Injury Chart and add the dice together! Other models hit by the bomb roll on the Injury Chart as standard.',
      'Any model hit, but not taken Out of Action, by this attack is blown D3" directly away from the point of impact (roll for each model separately), stopping if they hit other models, buildings or objects.',
      'This attack has the Keyword SHRAPNEL and therefore causes an additional +1 BLOOD MARKER. Cover, range and higher position do not affect attacks by the Infernal Bomb.',
      'Roll injuries for models that would benefit from Cover from the perspective of the BLAST point with -1 DICE.',
      'The Activation of the Witch ends immediately after using the Infernal Bomb.'
    ],
    handedness: HandednessType.ONE_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  }
]

export const knightsOfAvariceEquipment: Equipment[] = [
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
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
  {
    id: 'tc-eq-tarnished-armour',
    name: 'Tarnished Armour',
    type: 'Armour',
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
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
]

// TRENCH PILGRIMS and Warband Variants Equipment

export const trenchPilgrimsEquipment: Equipment[] = [
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
    id: 'tc-eq-molotov-cocktail',
    name: 'Molotov Cocktail',
    type: 'Grenade',
    description: 'Developed on the desperate Finnish battle frontier against Ice Demons, this improvised weapon consists of a glass bottle containing a flammable substance such as gasoline, alcohol or a napalm-like mixture plus a source of ignition.',
    range: '6"',
    modifiers: ['-1D to Injury'],
    keywords: ['ASSAULT', 'FIRE'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['-1 DICE on injury rolls. Molotov Cocktails ignore all penalties for terrain/cover, as well as ignoring all armour on a Critical Attack roll.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.GRENADE
  },
  {
    id: 'tc-eq-war-cross',
    name: 'War Cross',
    type: 'Equipment',
    description:
      'A War Cross (also known as a wurfkreuz in the Holy Roman Empire) is a four-pronged throwing weapon in the shape of a cross. It is engraved with prayers and psalms that guide it on an unerring path.',
    range: '8"',
    modifiers: ['No long-range penalty'],
    keywords: ['ASSAULT'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Does not count as one of the Ranged weapons carried by the model. Cannot be carried with Grenades. Ignores penalties for long range. A model with the weapon will not run out of them.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.GRENADE
  },
  {
    id: 'tc-eq-punt-gun',
    name: 'Punt Gun',
    type: 'Ranged Weapon',
    description:
      'A Punt Gun is an enormous shotgun loaded with up to 25 ounces of shot. It can be loaded with a risky amount of powder and square shot which causes widespread damage and destruction. It is a very popular weapon among Trench Pilgrims who lack access to conventional heavy weapons.',
    range: '18"',
    modifiers: ['+1D to Hit and to Injure'],
    keywords: ['HEAVY', 'SHRAPNEL'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Owing to its high accuracy and lethal shot, a punt pun adds +1 DICE to all rolls to hit and to injury rolls. Before a model shoots with the punt gun, you can overcharge it with a shot, giving the weapon BLAST 3” radius. If you do this, the shooting ACTION with the Punt Gun always ends the shooter’s Activation and causes one BLOOD MARKER on the shooter. A model cannot make a ranged attack with the punt gun unless it is either STRONG or another friendly model is in base contact with it.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-anti-tank-hammer',
    name: 'Anti-Tank Hammer',
    type: 'Melee Weapon',
    description: 'A polearm with a directional explosive mounted on its head. It is exceedingly good at taking out armoured targets but puts its user in grave danger.',
    range: 'Melee',
    modifiers: ['+1D to Injuries'],
    keywords: ['RISKY', 'CRITICAL'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Ignores armour modifiers and rolls injuries with +1 DICE. If it hits the enemy, the wielder suffers +1 BLOOD MARKER as well.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
]

export const processionalOfTheSacredAfflictionEquipment: Equipment[] = [
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
]

export const cavalcadeOfTheTenthPlagueEquipment: Equipment[] = [
  {
    id: 'tc-eq-sacrificial-lamb',
    name: 'Sacrificial Lamb',
    type: 'Equipment',
    description:
      "Before the battle, this lamb is sacrificed to God's glory, and the pilgrim then anoints themselves with its blood, averting the wrath of Yahweh while fighting for His cause.",
    modifiers: [],
    keywords: ['CONSUMABLE'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['The model ignores the first BLOOD MARKER or INFECTION MARKER it suffers in combat.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
]

export const warPilgrimageOfSaintMethodiusEquipment: Equipment[] = [
  {
    id: 'tc-eq-trench-mortar',
    name: 'Trench Mortar',
    type: '2-handed',
    range: '48"',
    description:
      'A trench mortar is a smooth-bore, muzzle-loading weapon with high angles of fire. The shell contains both explosives and deadly Greek Fire.',
    modifiers: ['+1D to Injuries', 'Ignore Cover'],
    keywords: ['FIRE', 'HEAVY', 'BLAST 3"'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Specify a point on the battlefield within 36” (must be in line of sight) that you want to target. Next, take a Ranged Attack ACTION. If the roll fails (i.e. you roll 6 or less), the bomb lands 1” away from its intended location, multiplied by the number representing the degree of failure (for example, if you rolled 5, the bombard shot lands 2” away, as 7 – 5 = 2). The direction is decided by your opponent. All models within 3” of the 1 x 1 mm landing spot are hit as the shell explodes – no roll to hit is needed. This weapon has a BLAST radius of 3” – all models within this range are hit. Add +1 DICE to all injury rolls.',
    ],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-autocannon',
    name: 'Autocannon',
    type: '2-handed',
    range: '48"',
    description:
      'Autocannons are fully automatic guns that are capable of rapid-firing large-calibre 20 mm shells. Capable of generating extremely rapid firepower, autocannons overheat quickly if used for sustained fire.',
    modifiers: ['3 Attacks', '+1D to Injuries'],
    keywords: ['HEAVY'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Autocannons can make three Attack ACTIONS instead of one. They can target separate models with each attack, as long as all targets are within 6" of each other. After taking all three attacks the Activation of the model is over regardless of any remaining ACTIONS the model might have. Add +1 DICE to all injury rolls. They can shoot up to five times instead of three if they take ALL the attacks as RISKY ACTIONS.',
    ],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-gas-censer',
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
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-gas-filters',
    name: 'Gas Filters',
    type: 'Equipment',
    range: '-',
    description:
      'The Anchorite is installed with a holy incense system that cleanses and purifies the air the monk inside the Anchorite breathes.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['This upgrade counts as a gas mask.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-holy-diesel-engine',
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
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-sacred-geometry',
    name: 'Sacred Geometry',
    type: 'Equipment',
    range: '-',
    description:
      'The monk controlling this Anchorite is well-versed in geometries intended to make the viewer see the world through mathematics and, through this understanding, gains a better understanding of the divine. This allows the Anchorite to target its enemies with far more accuracy.',
    modifiers: ['+1 DICE to Ranged'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['This upgrade increases its Ranged Characteristic to +1 DICE.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-grand-anchorite',
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
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-piston-legs',
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
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-hallowed-anchorite',
    name: 'Hallowed Anchorite',
    type: 'Equipment',
    range: '-',
    description:
      'The anchorite has been anointed with holy Chrism, the oil made of pure myrrh, the ash from burnt icons and fifty-six other sacred ingredients. This makes the Anchorite pleasing to the Lord and its blessings can become manifold over time.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['This Anchorite can be promoted to ELITE during campaigns.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-wrathful-cherub-face',
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
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
]

// IRON SULTANATE and Warband Variants Equipment

export const ironSultanateEquipment: Equipment[] = [
  {
    id: 'tc-eq-jezzail',
    name: 'Jezzail',
    type: 'Ranged Weapon',
    description: 'These long arms are by far the most common weapons carried by the soldiers of the Sultanate of the Great Iron Wall. Their barrels are smoothbore which limits their accurate range, but this is more than made up by the fact that this allows them to be loaded with different types of Alchemical ammunition made by the Jabirean Alchemists.',
    range: '18"',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: true, shieldCombo: false },
    rules: [],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-murad-bombard',
    name: 'MURAD Bombard',
    type: 'Ranged Weapon',
    range: '36"',
    description:
      'Named after the great Sultan who commissioned the first of these weapons to defend the Iron Wall, this mighty bombard is used to disrupt advancing enemy formations. The echo of its blast recites the 99 names of Allah, throwing even the greatest of warriors to ground like chaff.',
    modifiers: [],
    keywords: ['HEAVY', 'BLAST 3"'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Specify a point on the battlefield within 36” (must be in line of sight) that you want to target. Next, take a Ranged Attack ACTION. If the roll fails (i.e. you roll 6 or less), the bomb lands 1” away from its intended location, multiplied by the number representing the degree of failure (for example, if you rolled 5, the bombard shot lands 2” away, as 7-5=2). The direction is decided by your opponent. All models within 3” of the landing 1x1mm landing spot are hit as the bomb explodes – no roll to hit is needed. If the bomb lands directly on top of any model, roll with 3D6 on the Injury Chart and add the dice together to see what happens! Other models hit by the bombard suffer a Down result due the booming shockwave, but do not incur any BLOOD MARKERS or other effects from this attack.'],
    handedness: HandednessType.ONE_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-flame-cannon',
    name: 'Flame Cannon',
    type: 'Equipment',
    range: '12"',
    description:
      'A great cannon that shoots a stream of alchemical fire with tremendous force. It has a tendency to overheat and ignite the skin of its artillery crew, but the mighty Brazen Bulls use them as mere handguns. The secret formula used for the fuel of the Flame Cannons was gleaned from the lost Byzantine ruins, and is commonly known as Greek Fire.',
    modifiers: [],
    keywords: ['FIRE', 'HEAVY'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['When shot in ranged combat, draw a straight 12” line that is 1mm wide from the Brazen Bull. All models along the path of the line are automatically hit – roll for their injuries immediately. Armour does not protect against the Flame Cannon. Due to the Keyword FIRE, its hits cause an additional +1 BLOOD MARKER. This is applied after rolling for injuries.'],
    handedness: HandednessType.ONE_HANDED,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-titan-zulfiqar',
    name: 'Titan Zulfiqar',
    type: 'Melee Weapon',
    range: 'Melee',
    description:
      'This twin-tongued greatsword can weigh up to 300 pounds – only the mighty Brazen Bulls can even lift this monstrous blade, let alone wield it in combat. It sheer weight and mono-molecule sharpness cuts through even the thickest armour when swung by the superhuman strength of the takwin monstrosity.',
    modifiers: ['+2 to Injury Rolls'],
    keywords: ['HEAVY', 'CRITICAL'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Add +2 to the result of all injuries caused by this weapon (i.e. a roll of 7 on the Injury Chart becomes 9).'],
    handedness: HandednessType.ONE_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
  {
    id: 'tc-eq-assassins-dagger',
    name: 'Assassin\'s Dagger',
    type: 'Melee Weapon',
    range: 'Melee',
    description:
      'The blades of the Assassins are imbued with the Supreme Poison. In chambers deep below the surface, generations of young assassins are raised in the dark; fed a diet of scorpions, frogs, deadly mushrooms and even stranger, more noxious things, and generation by generation their tolerance grows. The poisonous blood of these willing vessels is drawn and smelted into a poisonous iron. The iron is forged into blades and deadly spells of slaying layered into each fold of the envenomed metal. Thus the blood of the first generation of Assassins lives to this day, growing more potent with each generation.',
    modifiers: ['+1 to Injury'],
    keywords: ['CRITICAL'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Adds +1 to injury rolls (i.e. a roll of 7 on the Injury Chart becomes 8). If the Assassin hits an enemy and causes at least one BLOOD MARKER, the Assassin can move away from combat during this Activation. Note that this move does not grant enemies free attacks. Assassins can use both normal and Dash move to do this, though this may not be used for charging.'],
    handedness: HandednessType.ONE_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
  {
    id: 'tc-eq-halberd-gun',
    name: 'Halberd Gun',
    type: 'Ranged Weapon',
    range: 'Melee/24"',
    description:
      'Invention of the House of Wisdom, this weapon acts both as a symbol of high rank and an excellent weapon in combat.',
    modifiers: [],
    keywords: ['ASSAULT', 'CUMBERSOME'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Enemies charging a model equipped with a Halberd-gun add -1 DICE in melee combat when rolling to hit. This only applies when a model attacks after a charge, not on subsequent rounds of melee.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-siege-jezzail',
    name: 'Siege Jezzail',
    type: 'Ranged Weapon',
    range: '30"',
    description:
      'Heavier version of the standard Jezzail. It is a large, cumbersome weapon with a shot of lead or iron weighing as much as four pounds, designed to take out even the most powerful enemies with a single shot. Azebs armed with these weapons use tripod stakes when firing them, but the mighty Janissaries often use them as their standard service gun.',
    modifiers: ['+1D to Injuries'],
    keywords: ['HEAVY'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Roll all injuries with +1 DICE.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-alaybozan',
    name: 'Alaybozan',
    type: 'Ranged Weapon',
    range: '12"',
    description:
      'The design of this blunderbuss is based on the traditional design of tribal warriors but thoroughly modernised by the foundries of the Sultanate. It has proven its worth as the preferred weapon of the Sapper corps who must often fight in close quarters. It shoots a hail of lead bullets and iron shrapnel.',
    modifiers: [],
    keywords: ['SHRAPNEL'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-alchemist-armor',
    name: 'Alchemist Armor',
    type: 'Armour',
    description:
      'Suit of armour which protects against almost all harm. This is an essential tool of Alchemists’ craft, festooned with the Seals of Solomon which enables them to bend the elements of Creation to their will and shields them even from the devices of Hell.',
    modifiers: ['-1D to Injury Rolls from FIRE and GAS', 'Suffers no additional BLOOD MARKERS from FIRE and GAS'],
    keywords: ['HEAVY'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Counts as Reinforced Armour and therefore grants a -2 modifier to all injury rolls made against the model wearing it. All attacks with the Keyword FIRE and/or GAS suffer a -1 DICE penalty to injure this model. Additionally, this model does not suffer additional BLOOD MARKERS caused by the Keywords FIRE and/or GAS.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.ARMOUR
  },
  {
    id: 'tc-eq-alchemical-ammunition',
    name: 'Alchemical Ammunition',
    type: 'Equipment',
    description:
      'Jabirean Alchemists craft these Jezzail bullets from the slivers of the Iron Wall. Each such shot is carved the Seal of Solomon, guiding them during their path through the air',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Adds +1 DICE to Ranged Attack rolls on the Action Success Chart. Can only be used with Jezzails, Alaybozan, Halberd-Guns and Siege Jezzails.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-cloak-of-alamut',
    name: 'Cloak of Alamut',
    type: 'Equipment',
    description:
      'Created by the secret arts of the Assassin’s sect aeons ago, this cloak bends the light so that its wearer looks almost indistinguishable against any surface when they are still. It is this masterwork of Alamut that has led to the tales of the fabled Cloak of Invisibility in the legends of the Sultanate.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['All ranged attacks against a model that is in cover suffer -2 DICE penalty instead of -1 DICE. All the normal rules for cover apply otherwise.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-wind-amulet',
    name: 'Wind Amulet',
    type: 'Equipment',
    description:
      'Amulet created by the Jabirean Alchemists, capturing the essence of the Element of Wind within it.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Once per battle, you may add +3” to the Movement characteristic of this model once during the activation. Declare this when the model is Activated.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-marid-shovel',
    name: 'Marid Shovel',
    type: 'Equipment',
    description:
      'You can buy this enormous shovel made from alchemical bronze which makes it almost indestructible. Brazen bulls use it for public works (such as digging canals, foundations of buildings and mining) during peacetime, while at war it is used for digging trenches, ditches and bunkers.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['The Marid Shovel has the Keyword HEAVY which allows a Brazen Bull to use it. Otherwise it works exactly like a normal shovel.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },


]

export const fidaiOfAlamutEquipment: Equipment[] = [
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
    handedness: HandednessType.ONE_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
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
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
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
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
]

export const houseOfWisdomEquipment: Equipment[] = [
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
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
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
    handedness: HandednessType.ONE_HAND_REQUIRED,
    category: EquipmentCategory.SHIELD
  },
]

// NEW ANTIOCH and Warband Variants Equipment

export const stosstruppenPrussiaEquipment: Equipment[] = [
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
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
]

export const kindomOfAlbaEquipment: Equipment[] = [
  {
    id: 'tc-eq-lochaber-axe',
    name: 'Lochaber Axe',
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
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
]

export const abyssinianEquipment: Equipment[] = [
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
    handedness: HandednessType.ONE_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
  {
    id: 'tc-eq-holy-water-of-lalibela',
    name: 'Holy Water of Lalibela',
    type: 'Equipment',
    description:
      'Vials of holy water from the rock-hewn Churches of Lalibela are carried by the Ethiopian warriors on their campaigns. It has great power over demonic entities and aids in healing.',
    modifiers: [],
    keywords: ['CONSUMABLE'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'This model gains +1 DICE on any ACTION that would remove one or more BLOOD MARKERS or INFECTION MARKERS if successful.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-anfarro',
    name: "Anfarro (Warrior's Crown)",
    type: 'Equipment',
    description:
      "An Anfarro is made from a ring of lion's mane hair, held in a filigree gilt metal coronet studded with blue and red gemstones. It is granted by the Emperor to an aristocratic warrior and lion hunter as a token of honour and bravery.",
    modifiers: ['+1 DICE to Melee'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      "This model's Melee characteristic is improved by +1 DICE (as only the best warriors are granted the honour of wearing an Anfarro). This model is also immune to FEAR. Note that the Anfarro cannot be worn together with a helmet.",
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-tabot',
    name: 'Tabot',
    type: 'Equipment',
    description:
      'Made from alabaster, marble or wood from an acacia tree, these are blessed replicas of the Ark of the Covenant. A priest that accompanies the forces of the King of Kings to New Antioch, they will take the holy Tabot with them, wrapped in silk cloth decorated with gold string.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Each time an ACTION is taken by any model of your warband that heals one or more BLOOD MARKERS or INFECTION MARKERS, the model carrying the Tabot gains one BLESSING MARKER.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
]


// BLACK GRAIL and Warband Variants Equipment

export const blackGrailEquipment: Equipment[] = [
  {
    id: 'tc-eq-infested-rifle',
    name: 'Infested Rifle',
    type: 'Ranged Weapon',
    range: '18"',
    description:
      'Armour offers little protection against the horrid, tainted bullets of this rifle, polluted by the power of Beelzebub himself. The bullets are semi-sentient, flying through the tiniest of chink in any armour.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['When resolving injuries for this weapon, the total modifier to injuries from a model’s armour (including shields) is reduced by 1. Thus Reinforced Armour, for example, only offers a -1 modifier to injury rolls this weapon causes.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-corruption-belcher',
    name: 'Corruption Belcher',
    type: 'Equipment',
    range: '8"',
    description:
      'The Corruption Belcher is a weapon of last resort, used by the Black Grail when all other options have failed. It is loaded with a variety of unholy materials, including the remains of the fallen Hegemon and the ashes of the burned body of the fallen Hegemon.',
    modifiers: [],
    keywords: ['GAS'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['This weapon automatically hits and it ignores armour. Because this weapon has the Keyword GAS, it inflicts an additional BLOOD MARKER on a hit.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-putrid-shotgun',
    name: 'Putrid Shotgun',
    type: 'Equipment',
    range: '12"',
    description:
      'Loaded with corroded demon-possessed winged shot filled with infected parasite larvae, the rounds of the Putrid Shotguns are almost impossible to avoid. This repulsive weapon is nicknamed ‘blunderpus’ by the New Antioch troops.',
    modifiers: ['+1D to Attacks'],
    keywords: ['ASSAULT'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['This weapon rolls attacks with +1 DICE and causes INFECTION MARKERS instead of BLOOD MARKERS'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-viscera-cannon',
    name: 'Viscera Cannon',
    type: 'Equipment',
    range: '24"',
    description:
      'This heavy firearm is the most loathsome and repulsive of all the weapons in the arsenal of the Black Grail - and that is saying something, considering the stiff competition it has. A warrior armed with this pride of Beelzebub inserts its tubes into their own abdomen and then shoots the corrosive contents of their own innards at the enemy. It is operated by a hand crank that first builds pressure inside the user until they are at the point of bursting, and then releases the spray of viscera at their foe. The greater the amount of their own flesh the user releases, the more horrific the damage.',
    modifiers: ['+2D to Attacks'],
    keywords: ['HEAVY'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['This weapon rolls attacks with +2 DICE, as even the slightest splash can kill. After resolving an injury caused by this weapon, this model may choose to suffer up to three BLOOD MARKERS to inflict the same number of additional BLOOD MARKERS upon the target of the attack.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-plague-blade',
    name: 'Plague Blade',
    type: 'Equipment',
    range: 'Melee',
    description:
      'Carrying the viral strain of Beelzebub himself, these weapons are the terror of all mortals. Even the tiniest nick or scratch usually leads to an agonising death and eternal servitude to the Lord of Flies as a ghastly walking corpse.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['This weapon causes INFECTION MARKERS instead of BLOOD MARKERS.'],
    handedness: HandednessType.ONE_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
  {
    id: 'tc-eq-beelzebubs-axe',
    name: "Beelzebub's Axe",
    type: 'Equipment',
    range: 'Melee',
    description:
      'With blades crafted in the form of a fly spreading its wings, this enormous axe is eternally covered with the corruption and filth of Beelzebub.',
    modifiers: ['+2D to Injury Rolls'],
    keywords: ['HEAVY'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['This weapon rolls injuries with +2 DICE, causing INFECTION MARKERS instead of BLOOD MARKERS.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
  {
    id: 'tc-eq-black-grail-shield',
    name: "Black Grail Shield",
    type: 'Shield',
    description:
      'The Device of the Black Grail carries the blessing of the Lord of Flies. It has a will of its own, moving to intercept any bullets or other projectiles that might impede the work of Beelzebub.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['This counts as a Trench Shield. In addition, when this model is targeted by a ranged attack, it can draw on the power of the Black Grail to disturb the flow of reality as an ACTION. If successful, the ranged attack is rolled with -2 DICE. If this ACTION is a Critical, the ranged attack automatically misses. This can be done outside of the model’s Activation and can be done each time the model is targeted by a ranged attack.'],
    handedness: HandednessType.ONE_HAND_REQUIRED,
    category: EquipmentCategory.SHIELD
  },
  {
    id: 'tc-eq-parasite-grenades',
    name: "Parasite Grenades",
    type: 'Grenade',
    range: '8"',
    description:
      'Gift from the Lord of the Flies, these grenades are filled with parasitic mind worms whose bites cause fever dreams and terrifying hallucinations. They are used to force the mortals away from the safety of defended bunkers and trenches.',
    modifiers: [],
    keywords: ['ASSAULT'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['If this weapon hits a model, the target is moved up to 3” in a single direction of the attacker’s choosing. This can be used to move the model out of cover, to fall from a high position or even into Melee Combat with their enemies.', 'Models that are immune to FEAR cannot be moved by this weapon.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.GRENADE
  },
  {
    id: 'tc-eq-compound-eyes-helmet',
    name: "Compound Eyes Helmet",
    type: 'Equipment',
    description:
      'This helmet is made from the compound eyes of a thousand flies, and is imbued with the power of the Lord of Flies.',
    modifiers: ['+1D to Ranged'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['This counts as a Combat Helmet. Additionally, this model increases its Ranged characteristic by +1 DICE.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.HEADGEAR
  },
  {
    id: 'tc-eq-black-grail-staff',
    name: "Grail Devotee",
    type: 'Equipment',
    description:
      'Given birth by Matagot Hags after devouring living victims whole, these diminutive thralls are driven by an unspeakable thirst for fluids tainted by the Black Grail. They attach themselves to the nobles of the Order of the Fly, endlessly begging for any secretion or discharge of fluid their master might be able to spare. Nobles of the Fly pass their ammunition and blades through the devotee’s digestive system to enhance the deadliness of their weapons.',
    modifiers: ['+1D to Melee', '+1D to Ranged'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['A single model may be accompanied by up to two Grail Devotees. For each Devotee a model is accompanied by, it rolls injuries with a flat +1 bonus with all of its attack ACTIONS.', 'Note that although Grail Devotees can be represented by a model, they are not treated as models for any rules purposes. As equipment, they must remain stationary and wholly on the base of the model that they accompany.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
]

export const dirgeOfTheGreatHegemonEquipment: Equipment[] = [
  {
    id: 'tc-eq-broken-crown',
    name: 'Broken Crown',
    type: 'Equipment',
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
    description:
      'This black urn contains ashes left from the burned body of the fallen Hegemon, which still retain a faint echo of its hateful will. It swirls and churns in the air, all while sinister whispers emanate from within.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'All ranged attacks against a model carrying the Urn and any other models fully with 3" suffer a -1 DICE penalty against any ranged attack ACTION targeting them. This stacks with any other ranged modifiers such as Long Range. This applies even to weapons that ignore Cover such as Grenade Launchers.',
    ],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
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
]

// SEVEN HEADED SERPENT and Warband Variants Equipment

export const sevenHeadedSerpentEquipment: Equipment[] = [
  {
    id: 'tc-eq-arquebus',
    name: 'Arquebus',
    type: 'Ranged Weapon',
    range: '18"',
    description:
      'A primitive matchlock weapon that is simple enough that even a yoke fiend is capable of operating it.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['If a model equipped with an arquebus has two hands free, it can use it in melee combat as if it were a trench club.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-ophidian-rifle',
    name: "Ophidian Rifle",
    type: 'Ranged Weapon',
    range: '30"',
    description:
      'This wheel-lock hunting rifle is produced in the forges of the demon Sabnock, the Great Marquis of War. Made of both infernal and earthly metals and materials, it exists simultaneously in the twisted dimension of Hell as well as on Earth. A thing that should not be, the shots of this firearm pervert the laws of God, so taking cover from its bullets and firing over great distances aid the user of this hell-made rifle instead of hindering the aim.',
    modifiers: [],
    keywords: ['HEAVY'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['This weapon ignores the penalties for Cover and Long Range, and rolls attacks against models at Long Range or in Cover with +1 DICE. These bonuses stack for a possible total of +2 DICE.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-serpent-assault-gun',
    name: "Serpent Assault Gun",
    type: 'Equipment',
    range: '36"',
    description:
      'This terrifying and enormous hand cannon contains a portal to the foetid swamps and bogs of the Fifth Circle of Hell. Each bullet it fires is enveloped with an awful gas.',
    modifiers: [],
    keywords: ['GAS', 'HEAVY', 'ASSAULT'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['When this model takes this ranged attack ACTION, it can make up to two attacks with this weapon. These attacks can target separate models, but the targets must be within 6” of each other.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-bow-of-lethe',
    name: "Bow of Lethe",
    type: 'Equipment',
    range: '36"',
    description:
      'This bow is made from the bones of the fallen Hegemon, and is imbued with the power of the Lord of Flies. It is said that this bow was used to shoot the arrows that killed the fallen Hegemon himself.',
    modifiers: ['+2D to Injuries OR Ignore Armour'],
    keywords: ['ASSAULT'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Before rolling an injury for this weapon, choose one of the following effects to apply to that roll:',' - The injury ignores armour',' - Roll the injury with +2 DICE'],
    handedness: HandednessType.ONE_HANDED,
    category: EquipmentCategory.RANGED_WEAPON
  },
  {
    id: 'tc-eq-torture-instrument',
    name: "Torture Instrument",
    type: 'Melee Weapon',
    description:
      'Great scourges made from living spines, red-hot rods, man-catchers and all the tools of torment fashioned by the sadistic smiths of Dis are widely used by Court warbands. Their main function is not to kill, but to cause as much agonising pain as possible. Forged in hellfire and quenched in the black waters of river Styx. The agony their wounds bring lasts for days.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['This weapon rolls D6 on the Injury Chart, or 2D6 on a BLOODBATH. This weapon causes an additional BLOOD MARKER for each BLOOD MARKER it inflicts from an injury result.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
  {
    id: 'tc-eq-head-taker',
    name: "Head Taker",
    type: 'Melee Weapon',
    description:
      'Said to contain a tiny sliver of the stone that Cain used to murder Abel, this weapon allows its wielder to clearly see each spot in the body of their enemy that would bring it instant and agonising death. This makes it a superb ambush weapon much favoured by the Hunters of the Left-Hand Path.',
    modifiers: ['+2 to Injuries vs not Activated'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['This weapon rolls injuries against unactivated models with a flat +2 bonus.'],
    handedness: HandednessType.ONE_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
  {
    id: 'tc-eq-malebranche-sword',
    name: "Malebranche Sword",
    type: 'Melee Weapon',
    range: 'Melee',
    description:
      'These forked abyssal swords are both terrible weapons as well as symbols of prestige, given to demons who have performed great deeds in the service of the Court. They were once carried by fallen Seraphim in battles against Heaven.',
    modifiers: ['3D6 Injury roll'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['This enormous evil sword rolls 3D6 on the Injury Chart, adding the results together.'],
    handedness: HandednessType.TWO_HANDED,
    category: EquipmentCategory.MELEE_WEAPON
  },
  {
    id: 'tc-eq-crown-of-hellfire',
    name: "Crown of Hellfire",
    type: 'Equipment',
    description:
      'This burning crown is held aloft by the pain-seared hands of an invisible damned soul, whose weeping cries can still be heard. It is a reward that an elite member of the Court can earn through some extraordinary act in the service of the Serpent Head they are pledged to. Of the slave soldiers of the Court, only the Pit Locusts are allowed to wear this symbol of prestige due the fundamental role they played at the start of the Great War.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [' When this model ends its Activation, each enemy model in melee combat with it suffers a BLOOD MARKER. Any effect or ability that negates BLOOD MARKERS from the Keyword FIRE negates this BLOOD MARKER.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
  },
  {
    id: 'tc-eq-infernal-iron-armour',
    name: "Infernal Iron Armour",
    type: 'Armour',
    description:
      'This armour is forged simultaneously in Hell and on Earth, so that no weapon, whether infernal or man-made, can overcome its protection. It serves both as protection and a torturous prison for the Hell Knights that are forced to wear it',
    modifiers: ['-2 to Injuries'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Injuries against this model are rolled with a flat -2 penalty. This penalty applies against injuries that ignore armour.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.ARMOUR
  },
  {
    id: 'tc-eq-restraining-muzzle',
    name: "Restraining Muzzle",
    type: 'Equipment',
    description:
      'Yoke Fiends are unruly beasts, and almost impossible to control when they smell mortal blood. Court nobles use these cruel, barbed muzzles to bring them to heel. Each is attuned to the will of the noble in the charge, who can constrict them until the pain becomes so unbearable that even the most bestial Yoke Fiend is made to obey.',
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Any Yoke Fiend equipped with a Restraining Muzzle is not affected by the Hateful rule and therefore does not have to charge certain enemies within Charge range. With this device in place, the unruly Yoke Fiends can be trained better and add +1 DICE to their Ranged Attack characteristic.'],
    handedness: HandednessType.NO_HANDS,
    category: EquipmentCategory.EQUIPMENT
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
ensureValidCostPerVariant(hereticLegionEquipment);
ensureValidCostPerVariant(knightsOfAvariceEquipment);
ensureValidCostPerVariant(trenchPilgrimsEquipment);
ensureValidCostPerVariant(kindomOfAlbaEquipment);
ensureValidCostPerVariant(stosstruppenPrussiaEquipment);
ensureValidCostPerVariant(dirgeOfTheGreatHegemonEquipment);
ensureValidCostPerVariant(blackGrailEquipment);
ensureValidCostPerVariant(fidaiOfAlamutEquipment);
ensureValidCostPerVariant(houseOfWisdomEquipment);
ensureValidCostPerVariant(abyssinianEquipment);


/**
 * Combined equipment data for seeding the Firestore database
 */
export const equipmentSeed: Equipment[] = ensureValidEquipment([
  ...meleeWeapons,
  ...rangedWeapons,
  ...armorItems,
  ...equipmentItems,
  ...hereticLegionEquipment,
  ...knightsOfAvariceEquipment,
  ...trenchPilgrimsEquipment,
  ...kindomOfAlbaEquipment,
  ...stosstruppenPrussiaEquipment,
  ...dirgeOfTheGreatHegemonEquipment,
  ...blackGrailEquipment,
  ...fidaiOfAlamutEquipment,
  ...houseOfWisdomEquipment,
  ...abyssinianEquipment,
]);
