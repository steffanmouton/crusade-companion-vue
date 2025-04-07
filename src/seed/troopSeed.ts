import type { Troop } from '../models/troop'

/**
 * Initial troop data for seeding the Firestore database
 */
const hereticTroopsSeed: Troop[] = [
  {
    id: 'tc-tr-heretic-priest',
    name: 'Heretic Priest',
    factionId: 'tc-fc-heretic-legion',
    factionName: 'Heretic Legion',
    description:
      'The Leader of a Heretic warband. These fallen priests perform all kinds of unholy magics, summoning petrifying demons and creatures using their Goetic spells. Often pledged to a Demon Lord in Hell, such as Pazuzu or Guison, the Profane Gospels they recite terrify church forces, causing ears to bleed and eyeballs to burst in their sockets.',
    type: 'Elite',
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
    cardHeaderImageURI: '/troops/CardHeader-HereticPriest.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-HereticPriest.png',
  },
  {
    id: 'tc-tr-heretic-death-commando',
    name: 'Heretic Death Commando',
    factionId: 'tc-fc-heretic-legion',
    factionName: 'Heretic Legion',
    description:
      'Silent Killers equipped with stealth generators that hide them from the eyes of God. These terrifying infiltrators have been known to kill entire enemy squads alone.',
    type: 'Elite',
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
    cardHeaderImageURI: '/troops/CardHeader-DeathCommando.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-HereticDeathCommando.png',
  },
  {
    id: 'tc-tr-heretic-chorister',
    name: 'Heretic Chorister',
    factionId: 'tc-fc-heretic-legion',
    factionName: 'Heretic Legion',
    description:
      'Suicide is a Mortal Sin, and sacrificing yourself to the glory of Hell is a yet greater affront to God. Some Heretics born with a gift of sonorous voice but little prospects of rising through the ranks but possessing a determination to excel may pursue the dark path of becoming a Chorister. Their severed heads sing their agonising hymns, filling the minds of their enemies with visions from the Pits of Hell, weakening both the resolve and strength of those unfortunate enough to hear the dire song.',
    type: 'Elite',
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
    cardHeaderImageURI: '/troops/CardHeader-HereticChorister.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-HereticChorister.png',
  },
  {
    id: 'tc-tr-heretic-trooper',
    name: 'Heretic Trooper',
    factionId: 'tc-fc-heretic-legion',
    factionName: 'Heretic Legion',
    description:
      'These soldiers make up the bulk of the Heretic forces. They have witnessed the Gate of Hell and survived, damning them for all eternity.',
    type: 'Troop',
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
    cardHeaderImageURI: '/troops/CardHeader-HereticTrooper.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-HereticTrooper.png',
  },
  {
    id: 'tc-tr-heretic-legionnaire-melee',
    name: 'Heretic Legionnaire (Melee)',
    factionId: 'tc-fc-heretic-legion',
    factionName: 'Heretic Legion',
    description:
      'An upgraded Heretic Trooper who has proven their worth in close combat. Their melee prowess has been enhanced through training and experience.',
    type: 'Troop',
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
    cardHeaderImageURI: '/troops/CardHeader-HereticTrooper.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-HereticTrooper.png',
  },
  {
    id: 'tc-tr-heretic-legionnaire-ranged',
    name: 'Heretic Legionnaire (Ranged)',
    factionId: 'tc-fc-heretic-legion',
    factionName: 'Heretic Legion',
    description:
      'An upgraded Heretic Trooper who has proven their worth in ranged combat. Their marksmanship has been enhanced through training and experience.',
    type: 'Troop',
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
    cardHeaderImageURI: '/troops/CardHeader-HereticTrooper.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-HereticTrooper.png',
  },
  {
    id: 'tc-tr-war-wolf-assault-beast',
    name: 'War Wolf Assault Beast',
    factionId: 'tc-fc-heretic-legion',
    factionName: 'Heretic Legion',
    description:
      "This abomination charges through miles of barbed wire to clear a path for the heretic infantry; its uniquely formed head designed to cut clean through it. War Wolves wear unique armour forged in the factories of hell, as seen by the maker's marks stamped upon it.",
    type: 'Troop',
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
    defaultEquipment: ['tc-eq-chainmaw', 'tc-eq-shredding-claws'],
    isDefaultEquipmentRemovable: false,
    isEquipmentLocked: true,
    abilities: [
      'Tough: War Wolves are huge creatures with unnatural vitality and are subject to the rules for TOUGH creatures.',
      'Loping Dash: A War Wolf may take its Dash ACTION with +2 DICE. The War Wolf ignores movement penalties caused by Difficult Terrain.',
      'Terrifying: A War Wolf is a blasphemous creation of Hell and causes FEAR.',
    ],
    keywords: ['HERETIC', 'FEAR', 'TOUGH', 'ARTIFICIAL'],
    cardHeaderImageURI: '/troops/CardHeader-WarWolfAssaultBeast.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-WarWolfAssaultBeast.png',
  },
  {
    id: 'tc-tr-anointed-heavy-infantry',
    name: 'Anointed Heavy Infantry',
    factionId: 'tc-fc-heretic-legion',
    factionName: 'Heretic Legion',
    description:
      'Heavily armed and armoured assault troops. Their skin is burned and blistering from their ordained pilgrimages to Hell and back.',
    type: 'Troop',
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
    defaultEquipment: ['tc-eq-reinforced-armour', 'tc-eq-infernal-brand-mark'],
    isDefaultEquipmentRemovable: false,
    abilities: [
      'Strong: The Heretic Heavy Infantry ignores the effect of the Keyword HEAVY on any weapon they wield.',
    ],
    keywords: ['HERETIC', 'STRONG'],
    cardHeaderImageURI: '/troops/CardHeader-AnointedHeavyInfantry.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-AnointedHeavyInfantry.png',
  },
  {
    id: 'tc-tr-artillery-witch',
    name: 'Artillery Witch',
    factionId: 'tc-fc-heretic-legion',
    factionName: 'Heretic Legion',
    description:
      "Artillery Witches stalk the battlefields, hurling ordnance assembled in the death factories of Hell's Third Circle. They are completely mute and no one has ever seen their faces. Some question if they are even living, and there are tales that they too were manufactured in Hell. They can pull an infinite number of Infernal Bombs from a portal to Hell that they manifest at will, summoning them to their hands from a gate of midnight blackness.",
    type: 'Troop',
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
    defaultEquipment: [],
    abilities: [
      'Infernal Bomb: This wicked infernal weapon is treated as a one-handed Ranged weapon with the Keyword BLAST 3". Specify a 1x1mm point on the battlefield within 36" that the Witch can see and that you want to target. Next, make a Ranged Attack ACTION. If the roll fails (i.e. you roll 6 or less with the two lowest Dice), the bomb lands 1" away from its intended location, multiplied by the number representing the degree of failure (for example, if you rolled 5, the bomb lands 2" away, as 7 - 5 = 2). The direction is decided by your opponent. Roll on the Injury Chart for each model within the BLAST radius. If the bomb lands exactly on top of any model, roll with 3D6 on the Injury Chart and add the dice together! Other models hit by the bomb roll on the Injury Chart as standard. Any model hit, but not taken Out of Action, by this attack is blown D3" directly away from the point of impact (roll for each model separately), stopping if they hit other models, buildings or objects. This attack has the Keyword SHRAPNEL and therefore causes an additional +1 BLOOD MARKER. Cover, range and higher position do not affect attacks by the Infernal Bomb. Roll injuries for models that would benefit from Cover from the perspective of the BLAST point with -1 DICE. The Activation of the Witch ends immediately after using the Infernal Bomb.',
      'Artificial Life: Artillery Witches are not affected by FEAR. Additionally, attacks with the Keyword GAS suffer a -1 DICE penalty to injure the Witch and they do not suffer additional BLOOD MARKERS from the Keyword GAS.',
      'Levitate: The Artillery Witch can Climb up without taking an ACTION and does not roll on the Injury Chart when falling.',
    ],
    keywords: ['HERETIC', 'ARTIFICIAL'],
    cardHeaderImageURI: '/troops/CardHeader-ArtilleryWitch.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-ArtilleryWitch.png',
  },
  {
    id: 'tc-tr-wretched',
    name: 'Wretched',
    factionId: 'tc-fc-heretic-legion',
    factionName: 'Heretic Legion',
    description:
      'Many unfortunates fall into the hands of the Heretic warbands, either during one of their many raids or battles, or purchased from the slave markets within their own territories. Some are foolhardy adventurers who travel into the domains of the damned only to be caught by their watchful patrols. Branded with cursed flesh-eating tattoos and heavily drugged, they serve as disposable cannon fodder for the Heretic forces.',
    type: 'Troop',
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
    cardHeaderImageURI: '/troops/CardHeader-Wretched.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-Wretched.png',
  },
]

const mercenaryTroopsSeed: Troop[] = [
  {
    id: 'tc-tr-combat-medic',
    name: 'Combat Medic',
    factionId: 'mercenary',
    factionName: 'Mercenary',
    description:
      'The Sisters of St. Cosmas are a highly trained elite medical corps, specialising in battlefield first aid and surgeries on the front lines of the Great War. The Sisters take a modified Hippocratic Oath that compels them to help any wounded soldiers of the Faith, no matter how dire the circumstance, as well as dispatching heretics and other enemies they find on the battlefield without pity or mercy.',
    type: 'Mercenary',
    stats: {
      movement: 6,
      movementType: 'Infantry',
      ranged: 2,
      melee: 2,
      armor: 0,
      baseSize: 32,
    },
    equipmentDescription:
      'The Medic carries a Misericordia and a Medi-kit. They wear a gas mask and suit of standard armour (reflected on the profile above). You cannot modify the equipment, armour and weapons of the Medic in any way.',
    defaultEquipment: ['Misericordia', 'Medi-kit', 'Gas Mask', 'Standard Armour'],
    abilities: [
      'Finish the Fallen: Due their knowledge of anatomy and physiology, medics are experts at inflicting debilitating injuries and excruciating pain. Unless the target has the Keyword DEMONIC or BLACK GRAIL, add +1 BONUS DICE to any injury rolls the medic makes in melee against opponents who are Down.',
      'Expert Medic: Medic adds +1 BONUS DICE whenever they use their Medi-Kit to aid friendly models.',
    ],
    keywords: [],
    mercenaryFactions: ['Trench Pilgrims'],
    cardHeaderImageURI: '/troops/CardHeader-CombatMedic.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-CombatMedic.png',
  },
  {
    id: 'tc-tr-witchburner',
    name: 'Witchburner',
    factionId: 'mercenary',
    factionName: 'Mercenary',
    description:
      'The Witchburners are the field officers of the Inquisition. They are tasked with hunting down and punishing witches, warlocks and heretics that cannot be brought to face justice by conventional means. On the battlefield they have the power to channel divine retribution on those deemed to have transgressed against God, causing sinners to burst into flames with mere words of condemnation.',
    type: 'Mercenary',
    stats: {
      movement: 6,
      movementType: 'Infantry',
      ranged: 0,
      melee: 1,
      armor: -2,
      baseSize: 32,
    },
    equipmentDescription:
      'The Witchburner is equipped with Reinforced Armour, wears a Helmet and carries a War Gavel (see below). You cannot alter their armour, weapons or equipment in any way.',
    defaultEquipment: ['Reinforced Armour', 'Helmet', 'War Gavel'],
    abilities: [
      'Divine Judgement: The Witchburner can select any model in the opposing warband within 24" (even if hidden or out of sight) and bring the Judgement of Heaven upon them with a Litany of Condemnation. This is a RISKY ACTION. If successful, the model suffers one BLOOD MARKER (models with the Keyword HERETIC, BLACK GRAIL or DEMONIC suffer two BLOOD MARKERS) as it bursts into celestial flames. This holy fire even affects units that are immune to FIRE weapons.',
      'Ceremonial Duty: The Witchburner has taken vows to persecute heretics with extreme prejudice. Nothing will stop this holy task. The Witchburner is immune to FEAR.',
      'Dignified Conduct: Due to the dignity of their status, the Witchburner cannot take the Dash ACTION.',
    ],
    keywords: [],
    mercenaryFactions: ['New Antioch', 'Trench Pilgrims'],
    cardHeaderImageURI: '/troops/CardHeader-Witchburner.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-Witchburner.png',
  },
  {
    id: 'tc-tr-communicant-anti-tank-hunter',
    name: 'Communicant Anti-Tank Hunter',
    factionId: 'mercenary',
    factionName: 'Mercenary',
    description:
      'Communicants are partakers of the experimental Chemical Communion – the blood and flesh harvested from a Meta-Christ by the Mendelist monks and applied to the genome of volunteers. The most holy and pious of the Church are chosen to partake of the experimental communion, going through many biological changes to become larger and more durable, greatly enhancing their effectiveness on the battlefield.',
    type: 'Mercenary',
    stats: {
      movement: 6,
      movementType: 'Infantry',
      ranged: 1,
      melee: 1,
      armor: -1,
      baseSize: 40,
    },
    equipmentDescription:
      'The Communicant is armed with an anti-materiel rifle and a helmet. They count as being armed with two Trench clubs in Melee combat – its fists are deadly weapons in their own right. Their flesh is hard as iron, so Communicants are considered to be wearing Standard Armour as noted in their profile. You cannot alter their weapons and equipment in any way.',
    defaultEquipment: ['Anti-Materiel Rifle', 'Helmet', 'Trench Club (x2)'],
    abilities: [
      'Strong: The Communicant ignores the effect of the Keyword HEAVY on any weapon they wield.',
      'Tough: Communicants are creatures with unnatural vitality and are subject to the rules for TOUGH creatures.',
      'Miracle of Regeneration: At the Start of the Activation a Communicant may remove one BLOOD MARKER from themselves if they have any.',
    ],
    keywords: ['TOUGH', 'STRONG'],
    mercenaryFactions: ['New Antioch', 'Trench Pilgrims'],
    cardHeaderImageURI: '/troops/CardHeader-CommunicantAntiTankHunter.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-CommunicantAntiTankHunter.png',
  },
  {
    id: 'tc-tr-mendelist-ammo-monk',
    name: 'Mendelist Ammo Monk',
    factionId: 'mercenary',
    factionName: 'Mercenary',
    description:
      'The Order of Mendelist Monks is entrusted with the design of divinely enhanced items and the creation of the Communicants, devotees who have undergone Chemical Communion with an infusion of the synthesised blood of a Meta-Christ. The Brotherhood of Blessed Munitions is one of the sub-sects of the Mendelist Order, whose duty is to provide the faithful with various types of ammunition treated with the chemically altered blood of a Meta-Christ.',
    type: 'Mercenary',
    stats: {
      movement: 6,
      movementType: 'Infantry',
      ranged: -1,
      melee: -1,
      armor: 0,
      baseSize: 25,
    },
    equipmentDescription:
      'The Monk has no weapons. They wear a gas mask and carry the Ammunition Sacrament (see below). You may not change their armaments in any way.',
    defaultEquipment: ['Gas Mask'],
    abilities: [
      'Faithful Followers: When a friendly model within 1" of the Monk is Activated, you can declare that the Monk is Activated at the same time. You may then use the Monk before taking any ACTION or movement with the model you originally Activated. This does not allow you to Activate the Monk more than once per Turn.',
      'The Ammunition Sacrement: As a RISKY ACTION, the Monk can provide a friendly model within 1" of it with one of the following benefits. The chosen benefit lasts until the end of the targeted model\'s Activation this Turn: Bullet of the Guided Path: Whenever this model makes an Attack with a Ranged Weapon, add +1 DICE to hit. Cartridge of His Wrath: Add the Keywords SHRAPNEL and BLAST 2" to every Ranged Weapon this model is equipped with. Echo of His Word: Whenever this model makes an Attack with a Ranged Weapon, add +1 to injury rolls caused by that Attack.',
    ],
    keywords: [],
    mercenaryFactions: ['New Antioch', 'Trench Pilgrims'],
    cardHeaderImageURI: '/troops/CardHeader-MendelistAmmoMonk.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-MendelistAmmoMonk.png',
  },
  {
    id: 'tc-tr-sin-eater',
    name: 'Sin Eater',
    factionId: 'mercenary',
    factionName: 'Mercenary',
    description:
      "Sin Eaters are horrific creatures: once they were mortal men and women, but their overwhelming greed and hunger for human flesh tainted with Sin, combined with the corrupting influence of the Hellgate, has turned them into a form that matches their inner foulness. They're swollen into monstrous proportions and are always at a point of nearly bursting, yet forever ravenous for more flesh and human sins to devour.",
    type: 'Mercenary',
    stats: {
      movement: 6,
      movementType: 'Infantry',
      ranged: -1,
      melee: 2,
      armor: -2,
      baseSize: 50,
    },
    equipmentDescription:
      "The Sin Eater is equipped with Reinforced Armour and a 2-handed Tenderizer Maul. You cannot alter the Sin Eater's weapons and equipment in any way.",
    defaultEquipment: ['Reinforced Armour', 'Tenderizer Maul'],
    abilities: [
      'Tough: Sin Eaters are huge creatures with unnatural vitality and are subject to the rules for TOUGH creatures.',
      'Devour the Guilty: As a RISKY ACTION, the Sin Eater can attempt to consume a model, friend (in which case the ACTION is not RISKY and is done with +1 DICE) or foe, that is on a 40mm or smaller base and is within 1". If successful, remove the model from the table and set aside any markers that the model has (BLOOD, INFECTION, BLESSING etc.). While it is devoured the model cannot be targeted by any attack or ability. When Activated, the devoured model may make one melee attack ACTION available to it, but the attack suffers a -3 DICE penalty when rolling to hit. A devoured model counts as being Down for all rules purposes (including Morale) and, if it is still devoured at the end of the battle, it counts as being Out of Action instead. Whenever the Sin Eater is activated, the devoured model suffers one BLOOD MARKER automatically that cannot be avoided by any means. If the devoured model suffers a BLOOD MARKER in this way when it already has six BLOOD MARKERS, it is immediately taken Out of Action and it is no longer considered devoured. If the Sin Eater is taken Out of Action, the devoured model is placed Down where the Sin Eater was. The Sin Eater can only ever have one consumed model in its belly.',
      'Vomit: The Sin Eater attempts to purge a model it has devoured as an ACTION with +4 DICE. If successful, the model\'s controller places the model within 1" of the Sin Eater. If no suitable space exists, the vomit fails and the model remains devoured. The vomited model is Down. The Sin Eater can only use this ACTION if it has a model devoured.',
      'Tenderizer Maul: This weapon has the same rules as a two-handed hammer but its huge reach means that the Sin Eater may make one Melee Attack ACTION against each enemy model it is fighting in Melee.',
    ],
    keywords: ['HERETIC', 'FEAR', 'TOUGH', 'STRONG'],
    mercenaryFactions: ['Heretic Legion', 'Black Grail', 'Court of the Seven-headed Serpent'],
    cardHeaderImageURI: '/troops/CardHeader-SinEater.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-SinEater.png',
  },
  {
    id: 'tc-tr-goetic-warlock',
    name: 'Goetic Warlock',
    factionId: 'mercenary',
    factionName: 'Mercenary',
    description:
      'Goetic Warlocks are horrific creations from the death factories of the 3rd Circle of Hell, manufactured from captured priests, prophets, vicars, rectors and monks. Fiendish machines first burn their flesh away with hellfire, encasing the still-living skeletons in an infernal suit of armour and stamping them with goetic runes. The process is so agonising that they consent to a demonic pact to bring end to their pain.',
    type: 'Mercenary',
    stats: {
      movement: 6,
      movementType: 'Infantry',
      ranged: 1,
      melee: 1,
      armor: -2,
      baseSize: 40,
    },
    equipmentDescription:
      "The Warlock wears Reinforced Armour. A Warlock counts as being armed with two swords in Melee combat – its arms are deadly weapons in their own right. You cannot alter the Warlock's weapons and equipment in any way.",
    defaultEquipment: ['Reinforced Armour'],
    abilities: [
      'Goetic Portal: As a RISKY ACTION with +1 DICE, the Warlock can Teleport up to 6" in any direction into a free space it can see, including into melee with an enemy model. The Warlock may bring a single enemy model that is in Melee Combat with it and has a base size of 32mm or smaller. There must be suitable space for the Warlock (and a possible passenger which must end the teleport in Melee Combat with the Warlock) at its target destination or this teleport automatically fails. It may not teleport out of the battlefield. It may teleport even if it is currently Down, but remains so after the teleportation.',
      "Barbed Embrace: Enemies cannot Retreat from the Goetic Warlock. Additionally, if a model is able to move out of Melee Combat with the Warlock because of a special ability (such as the Assassin's Dagger), they cannot.",
      'Unholy Horror: The Goetic Warlock causes FEAR.',
      'Goetic Gaze: This is an ACTION which is modified exactly the same way as a ranged attack, executed against one enemy the Warlock can see within 24". If successful, the model suffers one BLOOD MARKER. If the success is a Critical Success, the target suffers two BLOOD MARKERS instead. This ACTION can be used against enemy models in Melee Combat without having to randomise the target.',
    ],
    keywords: ['DEMONIC', 'ARTIFICIAL', 'FEAR'],
    mercenaryFactions: ['Heretic Legion', 'Court of the Seven-headed Serpent'],
    cardHeaderImageURI: '/troops/CardHeader-GoeticWarlock.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-GoeticWarlock.png',
  },
  {
    id: 'tc-tr-observer',
    name: 'Observer',
    factionId: 'mercenary',
    factionName: 'Mercenary',
    description:
      'When the need is great, the Synod of Strategic Prophecy sends Observers to support the war effort. This order of warrior monks lives a life of absolute solitude, sharpening their minds and bodies, making of themselves living weapons in the Hands of God. They wear a specially crafted helmet enabling them to attune to the Voice of God, granting them the capacity to simultaneously perceive the immediate past, present and future.',
    type: 'Mercenary',
    stats: {
      movement: 8,
      movementType: 'Infantry',
      ranged: 1,
      melee: 2,
      armor: -1,
      baseSize: 32,
    },
    equipmentDescription:
      "Standard Armour, Oculus Helm (counts as Combat Helmet and Gas Mask), Trench Polearm, in-built Medi-Kit. You cannot alter the Observer's weapons and equipment in any way.",
    defaultEquipment: ['Standard Armour', 'Oculus Helm', 'Trench Polearm', 'Medi-Kit'],
    abilities: [
      'Lightning Speed: In Melee, the Observer may attack twice with its Trench Polearm instead of only once.',
      'Temporal Fugue: Attacks that target the Observer suffer -1 DICE to hit.',
      'Eye of God: If the Observer fails an ACTION, you may re-roll the dice. However, if any of the dice you roll gives a result of 1, there is psychic backlash and the Observer suffers a Down result (including any resulting BLOOD MARKERS), and their Activation immediately ends.',
      "Voice of God: As a RISKY ACTION, the Observer may command any model on the board, friend or a foe, that has not been Activated this Turn. If successful, that model is compelled by the Divine Words. The Observer's Activation immediately ends and the target's Activation begins immediately after.",
    ],
    keywords: [],
    mercenaryFactions: ['New Antioch', 'Trench Pilgrims'],
    cardHeaderImageURI: '/troops/CardHeader-Observer.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-Observer.png',
  },
  {
    id: 'tc-tr-mamluk-faris',
    name: 'Mamluk Faris',
    factionId: 'mercenary',
    factionName: 'Mercenary',
    description:
      "Mamluks are an echo of a bygone age, last members of the warrior-elite that once ruled a great empire in Northern Africa. They suffered grievous losses at the earliest stages of the Great War when the Legions of demon Zalambuer emerged from the Hellgate. To this day the Mamluk knights play a deadly game of ambush and sudden raids on the Aegyptian front against Mammon's legions, making their living as swords for hire.",
    type: 'Mercenary',
    stats: {
      movement: 6,
      movementType: 'Infantry',
      ranged: 1,
      melee: 1,
      armor: -2,
      baseSize: 32,
    },
    equipmentDescription:
      'A Mamluk carries a Jezzail with Alchemical Ammunition. They wear a Helmet and Reinforced Armour. In addition, before each battle, you may choose one of the following loadouts from their personal armoury: Polearm and Trench Shield, Sword and Pistol, or Two-handed sword (Mamluk ignores the Keyword HEAVY on this weapon).',
    defaultEquipment: ['Jezzail', 'Alchemical Ammunition', 'Helmet', 'Reinforced Armour'],
    abilities: [
      'Sworn Sword: Mamluks can form a FIRETEAM with any one ELITE model in the Warband they are part of. This FIRETEAM is always in addition to any other FIRETEAM(s) the Warband is allowed to form. If a Mamluk joins a New Antioch FIRETEAM, the model benefits from the Co-ordinated Fireteam special rules.',
      'Martial Prowess: Mamluks are disciples of Furūsiyya, the Knightly Discipline passed on through generations, they practice ceaselessly and have few equals. This gives their Jezzails the Keyword ASSAULT as well as the Shield Combo ability. Additionally, they suffer no penalties for fighting with off-hand weapons in melee.',
      'Arabian Destrier: Unless the scenario prohibits use of the special deployment of INFILTRATORS, you may deploy the Mamluk on any table edge as long as they are at least 8" away from any enemy model after INFILTRATORS are deployed. Mamluks can also be deployed in your own deployment zone as standard.',
    ],
    keywords: [],
    mercenaryFactions: ['Iron Sultanate', 'New Antioch'],
    cardHeaderImageURI: '/troops/CardHeader-MamlukFaris.png',
    cardHeroSideImageURI: '/troops/CardHeroSide-MamlukFaris.png',
  },
]

/**
 * Combined troop data for seeding the Firestore database
 */
export const troopSeed: Troop[] = [...hereticTroopsSeed, ...mercenaryTroopsSeed]
