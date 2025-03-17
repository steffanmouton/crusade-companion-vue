import { defineStore } from 'pinia'
import type { Troop } from '../models/troop'

export const useTroopStore = defineStore('troop', {
  state: () => ({
    troops: [
      {
        id: '1',
        name: 'Heretic Priest',
        factionId: 1,
        factionName: 'Heretic Legion',
        description:
          'The Leader of a Heretic warband. These fallen priests perform all kinds of unholy magics, summoning petrifying demons and creatures using their Goetic spells. Often pledged to a Demon Lord in Hell, such as Pazuzu or Guison, the Profane Gospels they recite terrify church forces, causing ears to bleed and eyeballs to burst in their sockets.',
        type: 'Elite',
        costPoints: -1,
        costCurrency: 80,
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
        allowedEquipment: [],
        abilities: [
          'Puppet Master: Select a target model, friend or foe (including the Priest), within 12”. As a RISKY ACTION you can move the model D6” in any one direction, including forcing it to jump/fall down or enter into melee combat with any enemy model (as if it had Charged), or leave Combat (as if it had Retreated, including granting any enemies within range free attacks).',
          'Tough: Demonic vitality makes the Heretic Priests very difficult to slay. They are subject to the rules for TOUGH creatures.',
        ],
        keywords: ['HERETIC', 'ELITE', 'TOUGH'],
        countAllowed: [1],
      },
      {
        id: '2',
        name: 'Death Commando',
        factionId: 1,
        factionName: 'Heretic Legion',
        description:
          'Silent Killers equipped with stealth generators that hide them from the eyes of God. These terrifying infiltrators have been known to kill entire enemy squads alone.',
        type: 'Elite',
        costPoints: -1,
        costCurrency: 90,
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
        allowedEquipment: [],
        abilities: [
          'Infiltrator: The Death Commando can be placed anywhere on the table out of line of sight of any enemies, but at least 8" away from the closest enemy. Deployed after all other models without the Keyword INFILTRATOR.',
          'Stealth Generator: Ranged attacks against a Death Commando suffer -1 DICE to all the attack rolls.',
          'Hide: As a RISKY ACTION with +1 DICE the Commando can hide if any piece of scenery the model is touching can block line of sight in any direction, even partially, regardless of whether an enemy currently has a clear LOS. If successful, enemies cannot target the Commando with ranged attacks or Charges. Weapons with the Keyword BLAST affect the Commando as normal if it is in the radius of the weapon. This effect ends if the Commando moves from its exact position in any way, it makes a Ranged Attack or an enemy model comes within 1.5" of it.',
        ],
        keywords: ['HERETIC', 'ELITE', 'INFILTRATOR'],
        countAllowed: [0, 1],
      },
      {
        id: '3',
        name: 'Heretic Chorister',
        factionId: 1,
        factionName: 'Heretic Legion',
        description:
          'Suicide is a Mortal Sin, and sacrificing yourself to the glory of Hell is a yet greater affront to God. Some Heretics born with a gift of sonorous voice but little prospects of rising through the ranks but possessing a determination to excel may pursue the dark path of becoming a Chorister. Their severed heads sing their agonising hymns, filling the minds of their enemies with visions from the Pits of Hell, weakening both the resolve and strength of those unfortunate enough to hear the dire song.',
        type: 'Elite',
        costPoints: -1,
        costCurrency: 65,
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
        allowedEquipment: [],
        abilities: [
          'Unholy Hymns: All enemy models within 8" of the Chorister suffer an additional -1 DICE for all ACTIONS they attempt.',
          'Unholy Horror: The Chorister causes FEAR.',
        ],
        keywords: ['HERETIC', 'ELITE', 'FEAR'],
        countAllowed: [0, 1],
      },
      {
        id: '4',
        name: 'Heretic Trooper',
        factionId: 1,
        factionName: 'Heretic Legion',
        description:
          'These soldiers make up the bulk of the Heretic forces. They have witnessed the Gate of Hell and survived, damning them for all eternity.',
        type: 'Troop',
        costPoints: -1,
        costCurrency: 30,
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
        allowedEquipment: [],
        abilities: [],
        keywords: ['HERETIC'],
        countAllowed: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], // The rulebook doesn't specify a limit
      },
      {
        id: '5',
        name: 'Heretic Legionnaire (Ranged)',
        factionId: 1,
        factionName: 'Heretic Legion',
        description:
          'Upgraded Heretic Troopers with improved combat capabilities. They are more skilled and experienced soldiers in the service of the Inferno.',
        type: 'Troop',
        costPoints: -1,
        costCurrency: 40, // 30 + 10 for the upgrade
        stats: {
          movement: 6,
          movementType: 'Infantry',
          ranged: 1, // Can be either +1 ranged OR +1 melee, this is the ranged variant
          melee: 0,
          armor: 0,
          baseSize: 25,
        },
        equipmentDescription:
          'Heretic Troopers can be equipped with any weapon, armour or equipment from the Heretic Legion armoury. This troop is a Heretic Trooper that has been upgraded to a ranged Heretic Legionnaire, adding +1 DICE to ranged attacks.',
        allowedEquipment: [],
        abilities: [],
        keywords: ['HERETIC'],
        countAllowed: [0, 1, 2, 3, 4, 5], // Can upgrade up to half of your Heretic Troopers
      },
      {
        id: '6',
        name: 'Heretic Legionnaire (Melee)',
        factionId: 1,
        factionName: 'Heretic Legion',
        description:
          'Upgraded Heretic Troopers with improved combat capabilities. These variants specialize in melee combat.',
        type: 'Troop',
        costPoints: -1,
        costCurrency: 40, // 30 + 10 for the upgrade
        stats: {
          movement: 6,
          movementType: 'Infantry',
          ranged: 0,
          melee: 1, // Melee variant
          armor: 0,
          baseSize: 25,
        },
        equipmentDescription:
          'Heretic Troopers can be equipped with any weapon, armour or equipment from the Heretic Legion armoury. This troop is a Heretic Trooper that has been upgraded to a melee Heretic Legionnaire, adding +1 DICE to melee attacks.',
        allowedEquipment: [],
        abilities: [],
        keywords: ['HERETIC'],
        countAllowed: [0, 1, 2, 3, 4, 5], // Can upgrade up to half of your Heretic Troopers
      },
      {
        id: '7',
        name: 'Anointed Heavy Infantry',
        factionId: 1,
        factionName: 'Heretic Legion',
        description:
          'Heavily armed and armoured assault troops. Their skin is burned and blistering from their ordained pilgrimages to Hell and back.',
        type: 'Heavy',
        costPoints: -1,
        costCurrency: 95,
        stats: {
          movement: 6,
          movementType: 'Infantry',
          ranged: 1,
          melee: 1,
          armor: -2, // Includes the Reinforced Armor in the base cost
          baseSize: 32,
        },
        equipmentDescription:
          'Anointed are always equipped with a suit of Reinforced Armour and Infernal brand mark which are included in the cost. This armour can never be removed. Otherwise they can be equipped with any weapon, armour or equipment from the Heretic Legion Armoury and may purchase a Trench Shield.',
        allowedEquipment: [],
        abilities: [
          'Strong: The Heretic Heavy Infantry ignores the effect of the Keyword HEAVY on any weapon they wield.',
        ],
        keywords: ['HERETIC', 'STRONG'],
        countAllowed: [0, 1, 2, 3, 4, 5],
      },
      {
        id: '8',
        name: 'War Wolf Assault Beast',
        factionId: 1,
        factionName: 'Heretic Legion',
        description:
          "This abomination charges through miles of barbed wire to clear a path for the heretic infantry; its uniquely formed head designed to cut clean through it. War Wolves wear unique armour forged in the factories of hell, as seen by the maker's marks stamped upon it.",
        type: 'Beast',
        costPoints: -1,
        costCurrency: 140,
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
        allowedEquipment: [],
        specialEquipment: [
          'Chainmaw: The War Wolf treats its Chainsaw Mouth as a melee weapon with the Keyword RISKY that grants a +1 DICE bonus to hit (for total of +3D). Additionally, the attack ignores any armour worn by the target and has a +1 DICE bonus to injure. The Chainsaw Mouth does not take any hands to wield.',
          'Shredding Claws: The War Wolf treats its Shredding Claws as a two-handed melee weapon with the Keywords RISKY and CUMBERSOME. The Shredding Claws have a +1 DICE bonus to injure. Because the Shredding Claws are wielded alongside the Chainsaw Mouth, they are treated as an Off-Hand Weapon and suffer penalties accordingly.',
        ],
        abilities: [
          'Tough: War Wolves are huge creatures with unnatural vitality and are subject to the rules for TOUGH creatures.',
          'Loping Dash: A War Wolf may take its Dash ACTION with +2 DICE. The War Wolf ignores movement penalties caused by Difficult Terrain.',
          'Terrifying: A War Wolf is a blasphemous creation of Hell and causes FEAR.',
        ],
        keywords: ['HERETIC', 'FEAR', 'TOUGH', 'ARTIFICIAL'],
        countAllowed: [0, 1],
      },
      {
        id: '9',
        name: 'Artillery Witch',
        factionId: 1,
        factionName: 'Heretic Legion',
        description:
          "Artillery Witches stalk the battlefields, hurling ordnance assembled in the death factories of Hell's Third Circle. They are completely mute and no one has ever seen their faces. Some question if they are even living, and there are tales that they too were manufactured in Hell.",
        type: 'Support',
        costPoints: -1,
        costCurrency: 90,
        armyBuildingRules: [
          'You may include 0-2 Artillery Witches in a warband worth more than 1000 ducats.',
        ],
        stats: {
          movement: 6,
          movementType: 'Infantry',
          ranged: 0,
          melee: -1,
          armor: 0,
          baseSize: 25,
        },
        equipmentDescription:
          'An Artillery Witch is always equipped with an endless supply of Infernal Bombs (see below) and can carry no other ranged weapons. Otherwise, she can be equipped with any melee weapon, armour or equipment from the Heretic Legion Armoury.',
        allowedEquipment: [],
        abilities: [
          'Infernal Bomb: This wicked infernal weapon is treated as a one-handed Ranged weapon with the Keyword BLAST 3". Specify a 1x1mm point on the battlefield within 36" that the Witch can see and that you want to target. Next, make a Ranged Attack ACTION. If the roll fails (i.e. you roll 6 or less with the two lowest Dice), the bomb lands 1" away from its intended location, multiplied by the number representing the degree of failure. The direction is decided by your opponent. Roll on the Injury Chart for each model within the BLAST radius. If the bomb lands exactly on top of any model, roll with 3D6 on the Injury Chart and add the dice together! Any model hit, but not taken Out of Action, by this attack is blown D3" directly away from the point of impact, stopping if they hit other models, buildings or objects. This attack has the Keyword SHRAPNEL. Cover, range and higher position do not affect attacks by the Infernal Bomb. Roll injuries for models that would benefit from Cover from the perspective of the BLAST point with -1 DICE. The Activation of the Witch ends immediately after using the Infernal Bomb.',
          'Artificial Life: Artillery Witches are not affected by FEAR. Additionally, attacks with the Keyword GAS suffer a -1 DICE penalty to injure the Witch and they do not suffer additional BLOOD MARKERS from the Keyword GAS.',
          'Levitate: The Artillery Witch can Climb up without taking an ACTION and does not roll on the Injury Chart when falling.',
        ],
        keywords: ['HERETIC', 'ARTIFICIAL'],
        countAllowed: [0, 1, 2],
      },
      {
        id: '10',
        name: 'Wretched',
        factionId: 1,
        factionName: 'Heretic Legion',
        description:
          'Many unfortunates fall into the hands of the Heretic warbands, either during one of their many raids or battles, or purchased from the slave markets within their own territories. Some are foolhardy adventurers who travel into the domains of the damned only to be caught by their watchful patrols. Branded with cursed flesh-eating tattoos and heavily drugged, they serve as disposable cannon fodder for the Heretic forces.',
        type: 'Slave',
        costPoints: -1,
        costCurrency: 25,
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
        allowedEquipment: [],
        abilities: [
          "Law of Hell: If a Wretch manages to take any enemy ELITE model Out of Action or performs a Glorious Deed, it gains its freedom and is immediately removed from the battle and from your warband permanently. It does not count as a casualty, but your warband's total size for this battle is reduced by one for purposes of Morale.",
          'Dark Blessing: If a Wretch is taken Out of Action in battle, one of your models with Keywords HERETIC and ELITE gains one BLESSING MARKER.',
          'Chattel: Wretched can be sold at any time for their full ducat value between battles. Note that their weapons, armour and equipment still only fetch half price.',
        ],
        keywords: [],
        countAllowed: [], // Any number as long as they are outnumbered by HERETIC models
      },
    ] as Troop[],
  }),
})
