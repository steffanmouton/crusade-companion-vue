import { createDucatsCost } from '../models/cost'
import type { Troop } from '../models/troop'

/**
 * Initial troop data for seeding the Firestore database
 */
const hereticTroopsSeed: Troop[] = [
  {
    id: 'tc-tr-hp',
    name: 'Heretic Priest',
    factionId: 1,
    factionName: 'Heretic Legion',
    description:
      'The Leader of a Heretic warband. These fallen priests perform all kinds of unholy magics, summoning petrifying demons and creatures using their Goetic spells. Often pledged to a Demon Lord in Hell, such as Pazuzu or Guison, the Profane Gospels they recite terrify church forces, causing ears to bleed and eyeballs to burst in their sockets.',
    type: 'Elite',
    cost: createDucatsCost(80),
    stats: {
      movement: 6,
      movementType: 'Infantry',
      ranged: 2,
      melee: 2,
      armor: 0,
      baseSize: 32,
    },
    equipmentDescription:
      'The Heretic Priest can be equipped with any weapon, armour or equipment from the Heretic Legion Armoury.',
    defaultEquipment: [],
    abilities: [
      'Puppet Master: Select a target model, friend or foe (including the Priest), within 12". As a RISKY ACTION you can move the model D6" in any one direction, including forcing it to jump/fall down or enter into melee combat with any enemy model (as if it had Charged), or leave Combat (as if it had Retreated, including granting any enemies within range free attacks).',
      'Tough: Demonic vitality makes the Heretic Priests very difficult to slay. They are subject to the rules for TOUGH creatures.',
    ],
    keywords: ['HERETIC', 'ELITE', 'TOUGH'],
    countAllowed: [1],
    cardHeaderImageURI: '/troops/CardHeader-HereticPriest.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-HereticPriest.png',
  },
  {
    id: 'tc-tr-dc',
    name: 'Death Commando',
    factionId: 1,
    factionName: 'Heretic Legion',
    description:
      'Silent Killers equipped with stealth generators that hide them from the eyes of God. These terrifying infiltrators have been known to kill entire enemy squads alone.',
    type: 'Elite',
    cost: createDucatsCost(90),
    stats: {
      movement: 6,
      movementType: 'Infantry',
      ranged: 1,
      melee: 2,
      armor: 0,
      baseSize: 32,
    },
    equipmentDescription:
      'The Death Commando can be equipped with any weapon, armour or equipment from the Heretic Legion Armoury. The only ranged weapons they can be equipped with are Silenced Pistols, a Tormentor Chain and Gas Grenades.',
    defaultEquipment: [],
    abilities: [
      'Infiltrator: The Death Commando can be placed anywhere on the table out of line of sight of any enemies, but at least 8" away from the closest enemy. Deployed after all other models without the Keyword INFILTRATOR.',
      'Stealth Generator: Ranged attacks against a Death Commando suffer -1 DICE to all the attack rolls.',
      'Hide: As a RISKY ACTION with +1 DICE the Commando can hide if any piece of scenery the model is touching can block line of sight in any direction, even partially, regardless of whether an enemy currently has a clear LOS. If successful, enemies cannot target the Commando with ranged attacks or Charges. Weapons with the Keyword BLAST affect the Commando as normal if it is in the radius of the weapon. This effect ends if the Commando moves from its exact position in any way, it makes a Ranged Attack or an enemy model comes within 1.5" of it.',
    ],
    keywords: ['HERETIC', 'ELITE', 'INFILTRATOR'],
    countAllowed: [0, 1],
    cardHeaderImageURI: '/troops/CardHeader-DeathCommando.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-HereticDeathCommando.png',
  },
  {
    id: 'tc-tr-hc',
    name: 'Heretic Chorister',
    factionId: 1,
    factionName: 'Heretic Legion',
    description:
      'Suicide is a Mortal Sin, and sacrificing yourself to the glory of Hell is a yet greater affront to God. Some Heretics born with a gift of sonorous voice but little prospects of rising through the ranks but possessing a determination to excel may pursue the dark path of becoming a Chorister. Their severed heads sing their agonising hymns, filling the minds of their enemies with visions from the Pits of Hell, weakening both the resolve and strength of those unfortunate enough to hear the dire song.',
    type: 'Elite',
    cost: createDucatsCost(65),
    stats: {
      movement: 6,
      movementType: 'Infantry',
      ranged: -2,
      melee: 2,
      armor: 0,
      baseSize: 32,
    },
    equipmentDescription:
      'The Heretic Chorister can be equipped with any weapon, armour or equipment from the Heretic Legion Armoury.',
    defaultEquipment: [],
    abilities: [
      'Unholy Hymns: All enemy models within 8" of the Chorister suffer an additional -1 DICE for all ACTIONS they attempt.',
      'Unholy Horror: The Chorister causes FEAR.',
    ],
    keywords: ['HERETIC', 'ELITE', 'FEAR'],
    countAllowed: [0, 1],
    cardHeaderImageURI: '/troops/CardHeader-HereticChorister.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-HereticChorister.png',
  },
  {
    id: 'tc-tr-ht',
    name: 'Heretic Trooper',
    factionId: 1,
    factionName: 'Heretic Legion',
    description:
      'These soldiers make up the bulk of the Heretic forces. They have witnessed the Gate of Hell and survived, damning them for all eternity.',
    type: 'Troop',
    cost: createDucatsCost(30),
    stats: {
      movement: 6,
      movementType: 'Infantry',
      ranged: 0,
      melee: 0,
      armor: 0,
      baseSize: 25,
    },
    equipmentDescription:
      'Heretic Troopers can be equipped with any weapon, armour or equipment from the Heretic Legion armoury. You can upgrade up to half (rounding down) of your Heretic Troopers into Heretic Legionnaires at the cost of +10 ducats each. You can select to upgrade either the Ranged or Melee characteristic of any of your Legionnaires by +1 DICE. You can choose a different bonus for each Legionnaire.',
    defaultEquipment: [],
    abilities: [],
    keywords: ['HERETIC'],
    countAllowed: [],
    cardHeaderImageURI: '/troops/CardHeader-HereticTrooper.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-HereticTrooper.png',
  },
  {
    id: 'tc-tr-hlm',
    name: 'Heretic Legionnaire (Melee)',
    factionId: 1,
    factionName: 'Heretic Legion',
    description:
      'An upgraded Heretic Trooper who has proven their worth in close combat. Their melee prowess has been enhanced through training and experience.',
    type: 'Troop',
    cost: createDucatsCost(40),
    stats: {
      movement: 6,
      movementType: 'Infantry',
      ranged: 0,
      melee: 1,
      armor: 0,
      baseSize: 25,
    },
    equipmentDescription:
      'Heretic Legionnaires can be equipped with any weapon, armour or equipment from the Heretic Legion armoury.',
    defaultEquipment: [],
    abilities: [],
    keywords: ['HERETIC'],
    countAllowed: [],
    cardHeaderImageURI: '/troops/CardHeader-HereticTrooper.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-HereticTrooper.png',
  },
  {
    id: 'tc-tr-hlr',
    name: 'Heretic Legionnaire (Ranged)',
    factionId: 1,
    factionName: 'Heretic Legion',
    description:
      'An upgraded Heretic Trooper who has proven their worth in ranged combat. Their marksmanship has been enhanced through training and experience.',
    type: 'Troop',
    cost: createDucatsCost(40),
    stats: {
      movement: 6,
      movementType: 'Infantry',
      ranged: 1,
      melee: 0,
      armor: 0,
      baseSize: 25,
    },
    equipmentDescription:
      'Heretic Legionnaires can be equipped with any weapon, armour or equipment from the Heretic Legion armoury.',
    defaultEquipment: [],
    abilities: [],
    keywords: ['HERETIC'],
    countAllowed: [],
    cardHeaderImageURI: '/troops/CardHeader-HereticTrooper.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-HereticTrooper.png',
  },
  {
    id: 'tc-tr-ww',
    name: 'War Wolf Assault Beast',
    factionId: 1,
    factionName: 'Heretic Legion',
    description:
      "This abomination charges through miles of barbed wire to clear a path for the heretic infantry; its uniquely formed head designed to cut clean through it. War Wolves wear unique armour forged in the factories of hell, as seen by the maker's marks stamped upon it.",
    type: 'Beast',
    cost: createDucatsCost(140),
    stats: {
      movement: 8,
      movementType: 'Infantry',
      ranged: -1,
      melee: 2,
      armor: -3,
      baseSize: 50,
    },
    equipmentDescription:
      'You cannot buy additional equipment, weapons or armour for War Wolves. Each War Wolf is encased in a nigh impregnable suit of Tartarus Armour that is reflected in its profile above. Additionally, each War Wolf has a set of Shredding Claws and a vicious Chainsaw Mouth. These pieces of equipment are built into the integrity of its construction and cannot be removed or lost in any way. The weapons are detailed below. The War Wolf may make one attack ACTION with each of these weapons in Melee Combat and may make no other attacks during its Activation (so it can make two attacks per Activation).',
    defaultEquipment: ['Chainmaw', 'Shredding Claws'],
    abilities: [
      'Tough: War Wolves are huge creatures with unnatural vitality and are subject to the rules for TOUGH creatures.',
      'Loping Dash: A War Wolf may take its Dash ACTION with +2 DICE. The War Wolf ignores movement penalties caused by Difficult Terrain.',
      'Terrifying: A War Wolf is a blasphemous creation of Hell and causes FEAR.',
    ],
    keywords: ['HERETIC', 'FEAR', 'TOUGH', 'ARTIFICIAL'],
    countAllowed: [0, 1],
    cardHeaderImageURI: '/troops/CardHeader-WarWolfAssaultBeast.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-WarWolfAssaultBeast.png',
  },
  {
    id: 'tc-tr-ahi',
    name: 'Anointed Heavy Infantry',
    factionId: 1,
    factionName: 'Heretic Legion',
    description:
      'Heavily armed and armoured assault troops. Their skin is burned and blistering from their ordained pilgrimages to Hell and back.',
    type: 'Heavy',
    cost: createDucatsCost(95),
    stats: {
      movement: 6,
      movementType: 'Infantry',
      ranged: 1,
      melee: 1,
      armor: -2,
      baseSize: 32,
    },
    equipmentDescription:
      'Anointed are always equipped with a suit of Reinforced Armour and Infernal brand mark which are included in the cost. This armour can never be removed. Otherwise they can be equipped with any weapon, armour or equipment from the Heretic Legion Armoury and may purchase a Trench Shield.',
    defaultEquipment: ['Reinforced Armour', 'Infernal Brand Mark'],
    abilities: [
      'Strong: The Heretic Heavy Infantry ignores the effect of the Keyword HEAVY on any weapon they wield.',
    ],
    keywords: ['HERETIC', 'STRONG'],
    countAllowed: [0, 1, 2, 3, 4, 5],
    cardHeaderImageURI: '/troops/CardHeader-AnointedHeavyInfantry.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-AnointedHeavyInfantry.png',
  },
  {
    id: 'tc-tr-w',
    name: 'Wretched',
    factionId: 1,
    factionName: 'Heretic Legion',
    description:
      'Many unfortunates fall into the hands of the Heretic warbands, either during one of their many raids or battles, or purchased from the slave markets within their own territories. Some are foolhardy adventurers who travel into the domains of the damned only to be caught by their watchful patrols. Branded with cursed flesh-eating tattoos and heavily drugged, they serve as disposable cannon fodder for the Heretic forces.',
    type: 'Slave',
    cost: createDucatsCost(25),
    armyBuildingRules: [
      'Your warband may include any number of Wretched as long as they are outnumbered by models with the Keyword HERETIC.',
    ],
    stats: {
      movement: 6,
      movementType: 'Infantry',
      ranged: -1,
      melee: -1,
      armor: 0,
      baseSize: 25,
    },
    equipmentDescription:
      'Wretched can be equipped with any weapon, armour or equipment from the Heretic Legion Armoury. None of their weapons, armour or equipment can cost more than 10 ducats each. Every Wretched must be equipped with at least one weapon.',
    defaultEquipment: [],
    abilities: [
      "Law of Hell: If a Wretch manages to take any enemy ELITE model Out of Action or performs a Glorious Deed, it gains its freedom and is immediately removed from the battle and from your warband permanently. It does not count as a casualty, but your warband's total size for this battle is reduced by one for purposes of Morale.",
      'Dark Blessing: If a Wretch is taken Out of Action in battle, one of your models with Keywords HERETIC and ELITE gains one BLESSING MARKER.',
      'Chattel: Wretched can be sold at any time for their full ducat value between battles. Note that their weapons, armour and equipment still only fetch half price.',
    ],
    keywords: [],
    countAllowed: [],
    cardHeaderImageURI: '/troops/CardHeader-Wretched.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-Wretched.png',
  },
]

/**
 * Combined troop data for seeding the Firestore database
 */
export const troopSeed: Troop[] = [...hereticTroopsSeed]
