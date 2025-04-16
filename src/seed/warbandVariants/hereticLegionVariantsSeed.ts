import { createDucatsCost, CurrencyType } from '@/models/cost'
import type { WarbandVariant } from '@/models/warbandVariant'

export const hereticLegionVariantsSeed: WarbandVariant[] = [
  {
    id: 'tc-wb-knights-of-avarice',
    name: 'Knights of Avarice',
    factionId: 'tc-fc-heretic-legion',
    description:
      'The warbands who follow the Prince of Greed call themselves the Knights of Avarice. Such heretics display their wealth extravagantly and prefer to carry the most expensive and hard-to-acquire weapons, armour and equipment, suffering none to join them who lacks the means to obtain their glittering panoply.',
    specialRules: [
      'Worship Mammon: In a campaign, the patron of the warband will always be Mammon. Instead of the Puppet Master ability, the Heretic Priest of the Knights of Avarice may select the Price of Greed ability if they wish.',
      "Mammon's Chosen: Knights of Avarice allow only the wealthiest and the best-equipped candidates to join their ranks. Your force may have no models that cost less than 80 ducats (including their equipment).",
      'Corrupt Merchants: Many merchants, traders and moneylenders within the Faithful nations are followers of Mammon and secretly supply the Knights of Avarice with their wares.',
      'Preserve the Loot: Knights of Avarice greatly dislike using weapons that could damage the amount of wealth that can be extracted from the fallen. No weapon with the Keyword FIRE or SHRAPNEL can be used by any model in this warband.',
      'Infernal Rivalry: Mammon is a rival of Beruth, the great devil of wrath and murder, who is the Patron of Death Commandos. Knights of Avarice may include no Death Commandos.',
      'Goetic Warlocks: Goetic Warlocks are creations of Mammon. This warband may include one for the price of 110 ducats.',
      "Debtors to Mammon: Wretched of the warband are not tied by Mammon's Chosen rule.",
    ],

    // Add equipment rules
    equipmentRules: {
      costs: {
        'tc-eq-coinhammer': createDucatsCost(20),
        'tc-eq-tarnished-armour': createDucatsCost(45),
        'tc-eq-standard-of-mammon': createDucatsCost(25),
        'tc-eq-golden-calf-altar': createDucatsCost(20),
      },
      limits: {
        'tc-eq-coinhammer': 2,
        'tc-eq-tarnished-armour': 1,
        'tc-eq-standard-of-mammon': 1,
        'tc-eq-golden-calf-altar': 3,
      },
      // Global restrictions for equipment
      globalRestrictions: {
        bannedKeywords: ['FIRE', 'SHRAPNEL'],
      },
    },

    // Add troop rules
    troopRules: {
      // Define costs for special cases
      costs: {
        'tc-troop-goetic-warlock': {
          currencies: [{ type: CurrencyType.DUCATS, amount: 110 }],
        },
      },
      // Define restrictions to enforce the "Infernal Rivalry" rule
      // Note: maxCount: 0 effectively bans the troop, but it will still appear in the UI.
      // The code will prevent adding it to the army but it won't be hidden from selection.
      // This enforces the special rule while keeping the troops visible for reference.
      restrictions: {
        requirements: [
          {
            maxCount: 0,
            troopIds: ['tc-tr-heretic-death-commando'],
          },
        ],
      },
      limits: {},
      allowedEquipment: {},
    },

    // Add army rules overrides
    armyRulesOverrides: {
      // Minimum model cost rule - no models less than 80 ducats
      minModelCost: {
        cost: 80,
        exceptions: {
          keywords: ['WRETCHED'],
        },
      },

      // Special validations
      specialValidations: {
        enforcePatron: 'Mammon',
      },
    },
  },
  {
    id: 'tc-wb-heretic-naval-raiding-party',
    name: 'Heretic Naval Raiding Party',
    factionId: 'tc-fc-heretic-legion',
    description:
      'The Heretic Fleet operates as a semi-autonomous entity under the command of its High Captain and other admirals. The Heretics have their own marine infantry that often operates in small bands, striking deep behind enemy lines and executing smash and grab missions.',
    specialRules: [
      'Fast as Lightning: All Models have +1 DICE when taking their Dash ACTIONS.',
      'Close Assault Weapons: The warband can buy Submachine Guns for 25 ducats per weapon.',
      'Light Troops: The force may only include 0-1 Annointed and 0-1 Artillery Witch.',
      'Let Sleeping Dogs Lie: The warband may not include a War Wolf.',
      'Unseen Advance: Up to three models without ELITE Keyword can be upgraded into INFILTRATORS at the cost of 10 ducats per Model.',
    ],

    // Add equipment rules
    equipmentRules: {
      costs: {
        'tc-eq-submachine-gun': createDucatsCost(25),
      },
    },
    troopRules: {
      restrictions: {
        requirements: [
          {
            maxCount: 1,
            troopIds: ['tc-tr-anointed-heavy-infantry'],
          },
          {
            maxCount: 1,
            troopIds: ['tc-tr-artillery-witch'],
          },
          {
            maxCount: 0,
            troopIds: ['tc-tr-war-wolf-assault-beast'],
          },
        ],
      },
    },
  },
  {
    id: 'tc-wb-trench-ghosts',
    name: 'Trench Ghosts',
    factionId: 'tc-fc-heretic-legion',
    description:
      'Sometimes when Heretic troopers die upon a hallowed ground or in presence of an uncorrupted holy relic, they become trapped between planes of existence. Claimed by neither Heaven nor Hell, the Trench Ghosts become Undead – doomed to fight a war without an end, attacking both the Faithful and Heretic alike, hating all life, obeying commands that no living can hear.',
    specialRules: [
      'Horror: All models in the Warband cause FEAR.',
      'Semi-corporeal: Any attacks against all models in the Trench Ghost warband roll injuries with -1 DICE – the undead are hard to kill!',
      'Spectral: All models in the warband ignore movement penalties caused by Difficult Terrain, though they cannot move through any objects/terrain. Dangerous terrain affects them as normal.',
      'Undead: All models in the Trench Ghost warband do not suffer additional BLOOD MARKERS from attacks with the Keyword GAS.',
      'Enemies of All: Trench Ghosts cannot use Mercenaries.',
      'Battlefield Looters: When this warband is created, select one item with LIMIT in the Heretic Legions Armoury. Its LIMIT is increased by one for your warband.',
      'Lost Souls: Since only mortals who have souls become ghosts, this warband may not have any model with the Keyword ARTIFICIAL.',
      'Slow: All models in Trench Ghost warband have a half Dash distance (i.e. 3").',
      'Sarcophagus Mine: At the cost of +35 ducats, up to two of the Troopers can be turned into Sarcophagus Mines.',
      'Barbed Wire Banshee: Instead of a Chorister, a Trench Ghost warband may include a Barbed Wire Banshee at the same cost.',
      'Tank Palanquin: At the cost of 55 ducats, the Heretic Priest of the warband can ride a ghostly Tank Palanquin.',
    ],
    troopRules: {
      restrictions: {
        requirements: [
          {
            maxCount: 0,
            troopIds: ['tc-tr-sin-eater'],
          },
          {
            maxCount: 0,
            troopIds: ['tc-tr-goetic-warlock'],
          },
          {
            maxCount: 0,
            keywords: ['ARTIFICIAL'],
          },
        ],
      },
    },
  },
]
