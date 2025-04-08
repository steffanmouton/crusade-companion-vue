import type { Faction } from '../models/faction'
import { createDucatsCost, createGloryPointsCost } from '../models/cost'

/**
 * Initial faction data for seeding the Firestore database
 */
export const factionSeed: Faction[] = [
  {
    id: 'tc-fc-heretic-legion',
    name: 'Heretic Legion',
    description: `A shroud of darkness blankets the world. Smoke and brimstone spews from the yawning gates of Inferno, enveloping the lands where people have abandoned God and openly wage war against His Creation. It is a grim reality that a full third of humanity has bent its knee before the idols of Hell. The main military force of Satan on Earth is the Heretic Legions, raised from amongst these citizens of the damned.`,
    iconUrl: '@/assets/icons/icon_heretic_legion.png',
    specialRules: [],
    isPlayable: true,
    equipmentRules: {
      costs: {
        'tc-eq-unarmed': createDucatsCost(0),
        'tc-eq-knife-dagger': createDucatsCost(1),
        'tc-eq-sacrificial-knife': createDucatsCost(2),
        'tc-eq-reinforced-armour': createDucatsCost(5),
        'tc-eq-trench-club': createDucatsCost(3),
        'tc-eq-bayonet': createDucatsCost(2),
        'tc-eq-blasphemous-staff': createGloryPointsCost(2),
        'tc-eq-pistol-revolver': createDucatsCost(6),
        'tc-eq-bolt-action-rifle': createDucatsCost(10),
        'tc-eq-trench-shield': createDucatsCost(10),
        'tc-eq-standard-armour': createDucatsCost(15),
        'tc-eq-combat-helmet': createDucatsCost(5),
        'tc-eq-gas-mask': createDucatsCost(5),
        'tc-eq-incendiary-ammunition': createDucatsCost(15),
        'tc-eq-sniper-scope': createGloryPointsCost(2),
        'tc-eq-shovel': createDucatsCost(5),
        'tc-eq-troop-flag': createGloryPointsCost(1),
        'tc-eq-unholy-trinket': createDucatsCost(15),
        'tc-eq-unholy-relic': createDucatsCost(15),
        'tc-eq-infernal-brand-mark': createDucatsCost(5),
        'tc-eq-hellbound-soul-contract': createDucatsCost(5),
        'tc-eq-musical-instrument': createDucatsCost(15),
        'tc-eq-mountaineer-kit': createDucatsCost(3),
        'tc-eq-chainmaw': createDucatsCost(0),
        'tc-eq-shredding-claws': createDucatsCost(0),
        'tc-eq-sword-axe': createDucatsCost(5),
      },
      limits: {
        'tc-eq-sacrificial-knife': 2,
        'tc-eq-incendiary-ammunition': 1,
        'tc-eq-sniper-scope': 2,
        'tc-eq-troop-flag': 1,
        'tc-eq-hellbound-soul-contract': 3,
        'tc-eq-musical-instrument': 1,
        'tc-eq-mountaineer-kit': 2,
      },
      troopRestrictions: {
        'tc-eq-hellbound-soul-contract': {
          conditions: {
            and: [{
              troopIds: ['tc-tr-heretic-trooper', 'tc-tr-anointed-heavy-infantry']
            }]
          }
        },
        'tc-eq-sacrificial-knife': {
          conditions: {
            and: [{
              keywords: ['ELITE']
            }]
          }
        },
        'tc-eq-reinforced-armour': {
          conditions: {
            or: [
              { keywords: ['ELITE'] },
              { troopIds: ['tc-tr-anointed-heavy-infantry'] }
            ]
          }
        },
        'tc-eq-blasphemous-staff': {
          conditions: {
            and: [{
              keywords: ['ELITE']
            }]
          }
        },
        'tc-eq-chainmaw': {
          conditions: {
            and: [{
              troopIds: ['tc-tr-war-wolf-assault-beast']
            }]
          }
        },
        'tc-eq-shredding-claws': {
          conditions: {
            and: [{
              troopIds: ['tc-tr-war-wolf-assault-beast']
            }]
          }
        }
      }
    },
    troopRules: {
      costs: {
        'tc-tr-heretic-priest': createDucatsCost(80),
        'tc-tr-heretic-death-commando': createDucatsCost(90),
        'tc-tr-heretic-chorister': createDucatsCost(65),
        'tc-tr-heretic-trooper': createDucatsCost(30),
        'tc-tr-heretic-legionnaire-melee': createDucatsCost(40),
        'tc-tr-heretic-legionnaire-ranged': createDucatsCost(40),
        'tc-tr-war-wolf-assault-beast': createDucatsCost(140),
        'tc-tr-anointed-heavy-infantry': createDucatsCost(95),
        'tc-tr-artillery-witch': createDucatsCost(90),
        'tc-tr-wretched': createDucatsCost(25),
        'tc-tr-goetic-warlock': createGloryPointsCost(4),
        'tc-tr-sin-eater': createGloryPointsCost(6),
      },
      limits: {
        'tc-tr-heretic-priest': 1,
        'tc-tr-heretic-death-commando': 1,
        'tc-tr-heretic-chorister': 1,
        'tc-tr-war-wolf-assault-beast': 1,
        'tc-tr-anointed-heavy-infantry': 5,
        'tc-tr-artillery-witch': 2,
        'tc-tr-goetic-warlock': 1,
      },
      restrictions: {
        requirements: [
          {
            minCount: 1,
            maxCount: 1,
            troopIds: ['tc-tr-heretic-priest']
          },
        ],
      }
    }
  },
  {
    id: 'tc-fc-trench-pilgrims',
    name: 'Trench Pilgrims',
    description: `So they come, the mad and the maimed, the Godtouched and the guilt-ridden – all gathering around Prophets and Prophetesses, forming Trench Pilgrim Processions. These disorganised groups arm themselves and follow the prophets of the Lord unto the front lines. They fight with unrivalled zeal, hurling themselves against the Heretics, arming themselves with anything they can get their hands on from the oldest muskets to scourges and Molotov Cocktails.`,
    iconUrl: '@/assets/icons/icon_trench_pilgrims.png',
    specialRules: ['Special Rule 1', 'Special Rule 2'],
    isPlayable: true,
    equipmentRules: {
      costs: {},
      limits: {}
    }
  },
  {
    id: 'tc-fc-iron-sultanate',
    name: 'Iron Sultanate',
    description: `A call was sent to those who believe righteously and, over the coming decades, the migration of the Faithful took place across Europa, Asia and Africa. Millions perished on the road and at sea, for the Heretics and their Shaytan lords swarmed them as locusts swarm fields of ripe sesame, devouring them and building vile monuments from their limbs and heads, so they could not be buried as is decreed in the Holy texts. But once all those who survived the journey had come, the mighty Gates of al-Qarnayn were closed and the Great Sultanate of the Invincible Iron Wall of the Two Horns That Pierce the Sky was formed.`,
    iconUrl: '',
    specialRules: ['Iron Discipline', 'Advanced Weaponry'],
    isPlayable: true,
    equipmentRules: {
      costs: {},
      limits: {}
    }
  },
  {
    id: 'tc-fc-new-antioch',
    name: 'Principality of New Antioch',
    description: `For three hundred years the Principality of New Antioch has stood defiantly as the focal point of the Church and the Faithful at the very edge of the shadow cast by the Gate of Hell. It is the Home of All Our Hopes, the bulwark against Heretic forces and the first line of defence against the devil's might. Should New Antioch fall, the Levant will be lost and the path to heartlands of the Church will be wide open.`,
    iconUrl: '',
    specialRules: ['Special Rule 1', 'Special Rule 2'],
    isPlayable: true,
    equipmentRules: {
      costs: {},
      limits: {}
    }
  },
  {
    id: 'tc-fc-black-grail',
    name: 'Black Grail',
    description: `The seventh layer of Hell, where the putrid fortress of Beelzebub stands, spews forth a torrent of demonic hell-flies, scorpions, locusts and other infernal insects. The Hellgate opens and a veritable tidal wave of foulness emerges, flowing across the land at startling speed, consuming everything and leaving indescribable horror in its wake. After nine days the insect swarm exhausts itself, devouring its own in its insatiable hunger.`,
    iconUrl: '',
    specialRules: ['Special Rule 1', 'Special Rule 2'],
    isPlayable: true,
    equipmentRules: {
      costs: {},
      limits: {}
    }
  },
  {
    id: 'tc-fc-court-of-the-seven-headed-serpent',
    name: 'Court of the Seven Headed Serpent',
    description: `Upon the commands of the Court, the warbands of Hell gather at the Hellgate and strike out to blight our unhappy world. Yoke fiends muster under the banners of their praetors and sorcerers. The shattered forms of the Hell Knights are forced into their suits of armour, emerging from their fiery tombs where their bodies are kept crushed under mighty, ever-turning slabs of black basalt while they are not serving in the war effort. Desecrated Saints are brought forth to act as unholy war altars that pollute and pervert the land which they travel over. Ahead of the warbands fly Pit Locusts, the clatter of their wings heralding the coming of the Court, their poison stings leaving burns that cannot be healed. And sometimes, when the deathly omens in Hell's burning sky and black stars are favourable, a Hunter of the Left-hand Path will join a warband as they strike out from the Mouth of Hell. As the warband marches to join the Great War, joyous and triumphant music played by unseen hands can be heard at these times, for taking part in one of these hunts is seen as a great privilege within the Sheol.`,
    iconUrl: '',
    specialRules: ['Special Rule 1', 'Special Rule 2'],
    isPlayable: true,
    equipmentRules: {
      costs: {},
      limits: {}
    }
  },
  {
    id: 'tc-fc-mercenary',
    name: 'Mercenary',
    description: `Various mercenary forces available for hire by the main factions. These fighters pledge their service to whoever can pay their price, bringing specialized skills to the battlefield.`,
    iconUrl: '@/assets/icons/icon_mercenary.png',
    specialRules: ['Hired Guns'],
    isPlayable: false, // Cannot be selected as a primary faction
    equipmentRules: {
      costs: {},
      limits: {}
    }
  }
]
