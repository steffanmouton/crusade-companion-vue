import type { WarbandVariant } from '@/models/warbandVariant'
import { createDucatsCost, CurrencyType } from '@/models/cost'

export const warbandVariantsSeed: WarbandVariant[] = [
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
        bannedKeywords: ['FIRE', 'SHRAPNEL']
      }
    },

    // Add troop rules
    troopRules: {
      // Define costs for special cases
      costs: {
        'tc-troop-goetic-warlock': {
          currencies: [
            { type: CurrencyType.DUCATS, amount: 110 }
          ]
        }
      },
      // Define restrictions to enforce the "Infernal Rivalry" rule
      // Note: maxCount: 0 effectively bans the troop, but it will still appear in the UI.
      // The code will prevent adding it to the army but it won't be hidden from selection.
      // This enforces the special rule while keeping the troops visible for reference.
      restrictions: {
        requirements: [
          {
            maxCount: 0,
            troopIds: ['tc-tr-heretic-death-commando']
          }
        ]
      },
      limits: {},
      allowedEquipment: {}
    },

    // Add army rules overrides
    armyRulesOverrides: {
      // Minimum model cost rule - no models less than 80 ducats
      minModelCost: {
        cost: 80,
        exceptions: {
          keywords: ['WRETCHED']
        }
      },

      // Special validations
      specialValidations: {
        enforcePatron: 'Mammon'
      }
    }
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
  },
  {
    id: 'tc-wb-dirge-of-the-great-hegemon',
    name: 'Dirge of the Great Hegemon',
    factionId: 'tc-fc-black-grail',
    description:
      'In the annals of the Great War two mighty Hegemons of the Black Grail have risen: Yersinia Rex, Emperor of Pestilence, and Febris, the rotting Bride of Beelzebub. Each of them were destroyed, but at an unimaginable cost to the forces of the Great Tyrant YHWH. With the ascension of a Hegemon, the hideous power of the Black Grail is exalted. Beelzebub grows sleek and fat, and like a magnanimous king, bestowing blessings and gifts upon his most favoured children.',
    specialRules: [
      'The Executor: The warband must include an Executor (use Plague Knight Stats), who has the Keyword TOUGH and Ranged characteristic of +1 DICE. The Executor costs 80 ducats.',
      'The Lamenters: The warband can have up to two Plague Knights known as the Lamenters.',
      'The Fallen: The warband cannot include a Lord of Tumours or Amalgam, for all were slain a long time ago.',
      'The Lost: The warband may only have a maximum of two Hounds (known as Wailers) and a maximum of two Heralds of Beelzebub (called Weepers).',
      'The Bereaved: The Grail Thralls and Fly Thralls of the warband are called the Bereaved. Grail Thralls (but not Fly Thralls) can use ranged weapons, standards and musical instruments from the Black Grail Armoury. They have a Ranged characteristic of +0 DICE and cost 35 ducats each.',
      "Dishonoured: No model in the warband may carry the Black Grail Shield or Beelzebub's Axe. The Lord of the Flies does not suffer failed knights to carry his device.",
      "Hegemon's Last Blessing: This warband has Plague Blade LIMIT:3, Putrid Shotgun LIMIT:3 and Viscera Cannon LIMIT:2. Non-ELITE models can be equipped with Viscera Cannons.",
      'Hegemon\'s Will: Using the remnants of the lingering power of a fallen Hegemon, any Plague Knight in the warband can command any Thrall within 18" of it directly.',
    ],
  },
  {
    id: 'tc-wb-procession-of-the-sacred-affliction',
    name: 'Procession of the Sacred Affliction',
    factionId: 'tc-fc-trench-pilgrims',
    description:
      "Trench Pilgrims of the Procession of the Sacred Affliction are known for their zeal in close quarter combat, their armour decorated with icons and shields adorned with the depictions of the Saints, which despite appearances can withstand machine gun bullets. The millstones they carry upon their backs are used to tie about the necks of sinners before drowning them in the mud and blood of No Man's Land.",
    specialRules: [
      'Face thy Fears: No model in the Procession of the Sacred Affliction can wear Iron Capirotes. Those troops with Capirotes in their base profile will not have them, though their cost remains the same.',
      'Reliquary Armoury: All models of this warband (save for the Anchorite) can buy Holy Icon Shields for 20 ducats, not just ELITE models. In addition, warband models with the ELITE Keyword may acquire Holy Icon Armour.',
      'Punishing Millstones: All models in the Procession of the Sacred Affliction (except Ecclesiastic Prisoners who are not worthy) add extra +1 DICE to injury rolls in melee against models that are Down.',
      'Melee-focused: This warband may not have any Machine Guns and only one Punt Gun.',
      'Zealot Strength: Up to three Trench Pilgrims may purchase the Zealot Strength upgrade.',
      'Hammer and the Anvil: The Anti-tank Hammers of this warband are not limited to ELITE.',
      'Wrath of God: One Trench Pilgrim or Castigator in this warband can be gripped by the vengeful fury of the Lord. This model is immune to FEAR and disregards any BLOOD MARKERS from any source. This model may never wear armour, though they can carry a Trench Shield or Holy Icon Shield. Add +15 ducats to the cost of this model. This model may not carry any ranged weapons.',
    ],
  },
  {
    id: 'tc-wb-cavalcade-of-the-tenth-plague',
    name: 'Cavalcade of the Tenth Plague',
    factionId: 'tc-fc-trench-pilgrims',
    description:
      'This Trench Pilgrim Procession traditionally sacrifices lambs before battle, anointing themselves in its blood to ward off the wrath of God. The Pilgrims then draw holy symbols with the blood of the sacrifice upon their bodies, clothing and armour, and then march to battle singing hymns, in certain belief that the blood of the Lamb shields them from any harm.',
    specialRules: [
      'Blood Sacrifice: Any model (except Ecclesiastic Prisoners who are not worthy) in the warband can purchase a Sacrificial Lamb.',
      'Heaven Awaits: The Cavalcade rejects the doctrine of the Meta-Christ. Their dead Pilgrims cannot be resurrected as Martyr-Penitents.',
      'The Unclean: The Cavalcade detests using the unclean Ecclesiastic Prisoners and may have only up to two of them.',
      'Day of his Wrath: The War Prophet of this warband cannot use Laying on Hands but can call upon the Wrath of God instead. This is a RISKY ACTION. If successful, roll on the Injury Chart against one enemy model within 3" of the Prophet. Armour offers no protection against this attack.',
      'Stolen Communicants: Communicants cost 3 Glory Points instead of ducats for this warband due to the difficulty of acquiring and indoctrinating them.',
      'Favour of the Lord: At the start of each turn, you can give any one model in the warband a BLESSING MARKER.',
    ],
  },
  {
    id: 'tc-wb-war-pilgrimage-of-saint-methodius',
    name: 'War Pilgrimage of Saint Methodius',
    factionId: 'tc-fc-trench-pilgrims',
    description:
      "From the Night of Fire and Blood that laid low the Greater Moravian monastery of Velehrad emerged a single monk of the Orthodox Order of St. Methodius. Following the ancient Orthodox creed, the pilgrims of St. Methodius reject many of the teachings and customs of other Pilgrim Processions. They consider the creation of the Communicants as a dangerous heresy and condemn the use of Martyrdom Devices as an affront to God's commandment against suicide.",
    specialRules: [
      'Anchorite Cloister: This warband may buy up to two Anchorite Shrines.',
      'Anchorite Armoury: This warband may alter the weaponry and equipment of their Anchorites. Anchorites of St. Methodius have +0 DICE to their Ranged Characteristic.',
      'Mortal Sin: No Ecclesiastic Prisoner of the warband may be equipped with a Martyrdom Device and no member of the warband can be Broken on the Wheel.',
      'Communicant Heresy: The Pilgrims of St. Methodius oppose the creation of Communicants and therefore cannot include them in their warbands. This includes Mercenaries.',
      'Treasure in Heaven: The Trench Pilgrims of this warband cannot be resurrected as Martyr-Penintents.',
      'Chaste Order: While they revere the holy stigmata of the nuns of the order, the fathers of the monasteries shun the ecstatic revelry of many Trench Pilgrims and insist on modest dress. All Stigmatic Nuns of the warband must wear Standard Armour. In addition, the warband may only have a maximum of three Stigmatic Nuns.',
      'Gunsmith Monks: The warband can buy Machine Guns (LIMIT: 2) at a cost of 50 ducats each, an Automatic Rifle (LIMIT: 1) for 40 ducats and a Submachine Gun (LIMIT: 1) for 30 ducats.',
      'Followers of St. Methodius: The Patron of the warband is always a Learned Saint.',
    ],
  },
  {
    id: 'tc-wb-fidai-of-alamut',
    name: "Fida'i of Alamut",
    factionId: 'tc-fc-iron-sultanate',
    description:
      "The pact between the Iron Sultanate and the Assassin fortress of Alamut ensures that the Sultan is served by the exquisitely skilled killers of the Old Man of the Mountain in exchange for independence of the Assassin's domain. In deepest secrecy Rashid al-Din Sinan dispatches his hand-picked disciples on Missions of his own, communicating their orders with no spoken words, signs nor written messages, but talking directly to them in their dreams.",
    specialRules: [
      "Flock of Assassins: The Fida'i of Alamut can have up to three Assassins. The warband must include a Master Assassin that counts as one of the three.",
      'Master Assassin: A Master Assassin has the Keyword TOUGH. The Master Assassin costs 95 ducats.',
      'Assassin Acolytes: Up to three Azebs of the warband can have the Keyword INFILTRATOR at the cost of +10 ducats per model.',
      'Alamut Alone: The warband may not include Yüzbaşı, Alchemist, Janissaries, Lions of Jabir or Brazen Bulls.',
      'Killing Squad: Your warband may have a single Fireteam. These Fireteams may consist of any two models from your warband. Models in Fireteams gain the Keyword FIRETEAM.',
      'Dervishes: The warband may include up to four Dervishes (use Janissary statistics including Armoury selection, but they cannot use Reinforced Armour).',
    ],
  },
  {
    id: 'tc-wb-defenders-of-the-iron-wall',
    name: 'Defenders of the Iron Wall',
    factionId: 'tc-fc-iron-sultanate',
    description:
      'The Defenders of the Iron Wall are a group of elite warriors who are dedicated to protecting the Iron Sultanate from all threats. They are known for their fierce loyalty to the Sultan and their unwavering commitment to the cause of the faith.',
    specialRules: [
      'Silahdar: The commanders of the Iron Wall units come from amongst the personal bodyguards of the Sultan known as Silahdar. Each Warband must contain one Silahdrar when it is created. They use the Yüzbaşı characteristics, do not have the Mubarizun Ability. Instead they have the Keyword STRONG and can use any Sapper Only choices from the Armoury. They cost 70 ducats.',
      'Far from the Sublime Gate: The Warband may not include any Lions of Jabir, Yüzbaşi or Assassins. They cannot buy the Cloak of Alamut or the Wind Amulet.',
      'Sipahi: Sipahi Automaton Cavalry often serves as infantry in the Iron Wall units to reinforce areas under severe pressure. They use characteristics of Mamluk Faris Mercenary. They cost 110 ducats. You cannot modify their equipment in any way. You can have up to 1 Sipahi. Note that this does not stop you from recruiting a Mamluk as a mercenary as well. Sipahi can be promoted as any other non-ELITE model.',
      'Janissary Officers: The Warband may include up to 2 Janissaries acting as officers. They have Keyword ELITE. The Warband may not have any other Janissaries.',
      'Sappers Corps: The standard divisions assigned to the Iron wall have double-strength Sapper detachment. This Warband may include up to 4 Sappers.',
      'Siege Jezzail Teams: All the members of the Warband are trained to use the Siege Jezzails in pairs. When any model of this Warband shoots a Siege Jezzail and they are within 1" of another member of the Warband, they add +1 DICE to their Ranged Attack to hit roll with the Siege Jezzai.',
      'Marksmanship of the Iron Wall: All the members of the Warband practise marksmanship from the dizzying heights of the Iron Wall against targets on the ground below. The Elevated position Ranged bonus for this Warband is +2 DICE instead of the usual +1 DICE.'
    ],
  },
  {
    id: 'tc-wb-house-of-wisdom',
    name: 'House of Wisdom',
    factionId: 'tc-fc-iron-sultanate',
    description:
      'The House of Wisdom is the pre-eminent centre of learning within the Iron Sultanate. Its libraries, workshops, forges, gardens of exotic and wondrous plants, hospitals and observatories are unmatched. In its laboratories guarded by the faithful Kavass, the Jabirean Alchemists dissect and study the War Beasts of Shaitan so their weaknesses can be laid bare and exploited by the Believers.',
    specialRules: [
      'Alchemists: The House of Wisdom warband may have up to two Alchemists and must include at least one. This warband treats Alchemist Armour as if they had a LIMIT of 2.',
      'Pride of Jabir: The warband may include up to three Lions of Jabir.',
      'Private Venture: The warband may not include any Azebs, Janissaries, Yüzbaşi or Assassins.',
      'Noble Guardians: The warband may include up to two Fāris – noble warriors sworn to protect the House of Wisdom. They use the Janissary stats but have the Keywords ELITE and STRONG.',
      'Kavass: Kavass are sworn guardians of the House of Wisdom. They use Azebs stats but cannot buy the Keyword SKIRMISHER. Instead, up to three Kavass can increase their Melee Characteristic by +1 DICE (to +0D) at the cost of +5 ducats per model.',
      'Weapon Collections: When you create this warband, choose two weapons. These weapons must be found in either the Armouries of New Antioch or the Trench Pilgrims. These weapons must not already be present in the Iron Sultanate Armoury.',
    ],
  },
  {
    id: 'tc-wb-papal-states-intervention-force',
    name: 'Papal States Intervention Force',
    factionId: 'tc-fc-new-antioch',
    description:
      'The Papal states who all operate under the command of the Supreme Pontiff of Rome rather than the Duke of New Antioch are sometimes dispatched to the front lines to perform a specific duty such as hunting down and eliminating dangerous Heretic leaders or recovering artefacts of great spiritual importance.',
    specialRules: [
      'Specialist Force: A Papal States Intervention Force is recruited with 500 ducats and 11 Glory Points when creating a warband for a campaign. When recruiting a warband for a one-off battle, we recommend using 700 ducats and 15 Glory Points.',
      'Swiss Guard: Up to four non-ELITE troopers and the Lieutenant can be upgraded into Swiss Guards at the cost of 5 ducats each. They are immune to FEAR.',
      'Supreme Blessing: One model in the warband may carry the crucifix given by the Supreme Pontiff. This model can take further ACTIONS if it fails in an attempted RISKY ACTION. Note that the action fails, but you are allowed to try any other ACTIONS on your profile without losing the Activation. If the crucifix is lost, a new one can be acquired at the cost of 3 Glory Points.',
      'Far from home: The Papal Intervention Force may have no Trench Moles.',
      "Vatican's representative: Papal States Warband must include a Trench Cleric but does not have to include a Lieutenant.",
      'Lector: Any Trench Cleric in the Papal Intervention Force can select the Arise and be Healed! prayer in addition to the ones usually available to a Trench Cleric.',
    ],
  },
  {
    id: 'tc-wb-eire-rangers',
    name: 'Eire Rangers',
    factionId: 'tc-fc-new-antioch',
    description:
      'Eire is a stronghold of the Church and an ancient centre of learning. Due to the constant and devastating raids of the Heretic Navy, they are bitter enemies of the Infernal forces. The Emerald Isle has endured hunger and ravaged by the Black Grail, as well as a full-fledged invasion aimed at destroying the famed House of Manuscripts where many of the holiest of texts are kept.',
    specialRules: [
      'Fianna: Any Shocktroopers in an Eire Warband can be made a member of Fianna, the famed warrior-hunters. They cost +10 ducats each and have the Keywords SKIRMISHER and INFILTRATOR.',
      'Carnyx: Your army can purchase a special Carnyx instead of a generic musical instrument. This horn is identical to a musical instrument (including equipment restrictions and LIMIT), except it can be carried by an ELITE model and the model carrying it causes FEAR.',
      'Hit-and-run tactics: If a model of this warband uses the Retreat ACTION to move away from Combat, enemies have a -1 DICE penalty to hit rolls with their free attack.',
      'Berserker: Either your Lieutenant or one of the Fianna can be a Berserker. This model is immune to FEAR and disregards any BLOOD MARKERS from any source. Berserkers never wear armour, though they can carry a Trench Shield. Add +15 Ducats to the cost of this model.',
      'Strong in faith: Eire is a bastion of the Church, with many famed warrior-priests who travel to war. The warband may have up to two Trench Clerics.',
      'Loose organisation: Your warband may only have up to one FIRETEAM from the New Antioch Fireteams feature. Additionally, your Lieutenant loses the On my command! ability and gains the Keyword SKIRMISHER.',
      'Light Infantry: The warband is allowed to field only one Mechanized Heavy Infantry trooper. No model (save for the single Mechanized Heavy Infantry) may carry a HEAVY weapon or wear Heavy or Machine Armour.',
      'Followers of St. Patrick: If playing a Campaign, the patron of the warband is automatically Saint Patrick.',
    ],
  },
  {
    id: 'tc-wb-red-brigade',
    name: 'The Red Brigade',
    factionId: 'tc-fc-new-antioch',
    description: 'Red Brigade is made of volunteers who have lost someone close to them in the battles of the Great War. The unit was founded by St. Ernest, the sole survivor of the second battle of Acre; where he lost his brother Wilhelm to the forces of the Heresiarch Berenguer. It is said that when his brother fell in combat Ernest donned the blood-stained helmet of Wilhelm and returned to the fray to kill Heretics until there were no more left to slay. As silence finally fell over the battlefield, Ernest was the sole survivor of either side. Seeing this as an ordained miracle by the Almighty, he gathered the rest of his brother\'s bloodied armour and returned to the Principality of New Antioch. There he began recruiting volunteers for his vendetta. As a gifted orator driven by the anguish of his loss, Ernest soon gathered a following of many bereaved soldiers like himself. Thus the first Red Brigade was formed and Ernst led his unofficial warband into the No Man\'s Land on a hunt for Heretics, through ambush and deep strikes at the vulnerable enemy supply lines. His bloodsoaked warriors soon began to resemble their leader in appearance which earned the unit its name. Their skill and cunning on the battlefield caught the attention of the throne of New Antioch and the Red Brigade was recognised as an official unit in the ducal armed forces.',
    specialRules: [
      'Wear and Tear: The Red Brigade Warband starts every game with 1 BLOOD MARKER for each 200 full ducats of the total Warband cost. Your opponent can distribute these between your troops, but not can only give 1 BLOOD MARKER per model as long as there are troops with no BLOOD MARKERs left. Max BLOOD MARKERs per model is 2.',
      'No Retreat: No member of this Warband can ever leave melee combat voluntarily, except Mercy Dogs and those who they drag along them (see below).',
      'Glory Hounds: Soldiers of New Antioch love heroic stories and improbable tall tales. Any dog that is part of the Red Brigade earns 2 Glory Points instead of 1 when they perform any Glorious Deed.',
      'Remember the Fallen: After the battle, instead of taking the Exploration option of Reinforcement Option, the Red Brigade may recover all the weapons, armour and equipment of all the warriors of their own Warband who died in the battle. This does not include Allies & Mercenaries since they are not Blood Pledges.',
      'Live off the Land: Most of the time the Red Brigade operates deep within hostile territory. When playing campaigns, the Red Brigade cannot call for Reinforcements if it did so after their last game. Instead they must choose the Exploration or Remember the Fallen option.',
      'Guns Blazing: It is the tradition of the Brigade officers to pratice the two-pistol fighting style of St. Ernest. Lieutenant of the Warband can buy Gunslinger Skill for the cost of +5 ducats.',
      'Displeasure of the Church: Only few members of the clergy are willing to serve in the unit due the disregard of their lives they show. Your warband can have a maximum of two such characters, so you can have either 1 Trench Cleric and 1 Sniper Priest, or 2 Sniper Priests but no Trench Cleric.',
    ],
  },
  {
    id: 'tc-wb-stosstruppen-of-the-free-state-of-prussia',
    name: 'Stoßtruppen of the Free State of Prussia',
    factionId: 'tc-fc-new-antioch',
    description:
      'When the need to take out an enemy strongpoint or assault an especially powerful defensive line of trenches or redoubts arises, the Duke of Antioch often calls upon the famed Stoßtruppen forces of the Free State of Prussia. These elite units often operate in deep forward positions, and quite often they carry secret orders or specific missions from the Princes of the Church or the New Antioch High Command.',
    specialRules: [
      'Expert Fireteams: You may have up to three FIRETEAMS from the New Antioch Fireteams feature.',
      'Masters of the Grenade: Models of the Stoßtruppen Warband add 4" range to all of their GRENADE weapons.',
      'Forward Positions: Up to two Shocktroops can have the Keyword INFILTRATOR at the cost of +10 ducats per model.',
      'Rapid Assault: At the cost of +5 ducats per model, any Shocktroopers and Lieutenants may add +1 DICE to all their Dash ACTIONS.',
      'Specialised Equipment: This warband has LIMIT:4 for Submachine guns. Automatic Shotguns and Automatic Pistols are not limited to ELITE. The warband may have no Grenade Launchers and only one Machine Gun.',
      'Troop Selection: The warband must have at least two shocktroopers and can have up to eight. The warband can have only one mechanised heavy infantry, one sniper priest and no trench moles.',
      'Lightly-armoured: Apart from mechanised heavy infantry and the lieutenant, no model in the warband can be equipped with reinforced or machine armour.',
      'Light Melee: Prussian shocktroopers lose the Assault Drill ability.',
    ],
  },
  {
    id: 'tc-wb-kingdom-of-alba-assault-detachment',
    name: 'Kingdom of Alba Assault Detachment',
    factionId: 'tc-fc-new-antioch',
    description:
      "Hailing from the Scottish Highlands where the Church is strong, these men (and a few fierce women!) come to New Antioch in search of glory, forgiveness of their sins, as well as dreams of acquiring valuable loot to send back to their island home, but above all to get their hands on some Devil-worshippers! The Heretic submarine fleet harries the shores of the Kingdom constantly, carrying off their young in chains to be sacrificed in the dark altars of the Arch-devils and their hatred towards Hell's forces runs deep.",
    specialRules: [
      'Rampant Charge: All models in this warband ignore the penalty for Defended Obstacles.',
      'Melee-focused: Mechanized Heavy Infantry of this warband have +1 DICE in melee instead of Ranged Attacks.',
      'Highland Machine Armour: Models in this warband equipped with machine armour ignore the penalty to charging imposed by the armour.',
      'Highland Strength: The Lieutenant of the warband has the Keyword STRONG.',
      'Strained Supply: This warband has LIMIT:1 for Grenade Launchers, Submachine Guns, Machine Guns, Automatic Shotguns and Sniper Rifles.',
      'Bagpipes: Your warband can purchase special bagpipes instead of a generic musical instrument. These bagpipes are identical to a musical instrument (including their equipment restrictions and LIMIT), but friendly models within 4" of the model carrying them are immune to FEAR.',
      'Brave: The warband adds +1 DICE to all Morale Tests.',
      'Claymore Smiths: An Alba Warband can buy Great Swords for 7 ducats instead of usual 12 ducats.',
      'Lightly-armoured: Apart from mechanised heavy infantry and the lieutenant, no model in the warband can be equipped with reinforced or machine armour.',
    ],
  },
  {
    id: 'tc-wb-expeditionary-forces-of-abyssinia',
    name: 'Expeditionary Forces of Abyssinia',
    factionId: 'tc-fc-new-antioch',
    description:
      'Most of what was once the ancient realm of Egypt now rests under the Shadow of Hell and the stronghold of the servants of the Prince of Greed, who has long dreamed of plundering the whole continent of its riches. War has honed the soldiers of Ethiopia into masters of mobile warfare and taking the enemy on in loose formation, a style of fighting well-suited to their rugged country where scarce roads restrict the movements of large armies.',
    specialRules: [
      'Chewa: Any shocktroopers or ELITE models in an Abyssinian warband can be made a member of Chewa, the traditional warrior-elite. This costs +5 ducats per model and can be done after the model has been recruited.',
      'Faith of Ethiopia: The sect of the Sniper Priests does not operate in the Solomonic Dynasty, so your warband cannot contain any Sniper Priests.',
      'Flanking Forces: The warband cannot have Trench Moles, but instead you can upgrade up to four Yeomen to Vanguards at the cost of +5 ducats each.',
      'Short-Range Marksmanship: Yeomen, Vanguard and the Lieutenant in this warband gain +1 DICE to all hit rolls if they are using their ranged weapons at short range (i.e. half or less of their maximum range).',
      'Abyssinian Healers: Your warband can have up to two Combat Medics.',
      'Holy Warriors: The warband may include up to two Holy Warriors (use Trench Cleric characteristics) and they can each choose to replace their "Onwards, Christian Soldiers!" ability with one from the Abyssinian Holy Warrior abilities list.',
      'Chieftain Panoply: The Mechanized Infantry of the warband cannot be upgraded to use Machine Armour.',
      'Weapons of Mobile Warfare: Your warband can have a maximum of three ranged weapons with the Keyword HEAVY. This limitation does not include satchel charges.',
    ],
  },
]
