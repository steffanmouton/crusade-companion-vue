import { defineStore } from 'pinia'
import type { Faction } from '../models/faction'

export const useFactionStore = defineStore('faction', {
  state: () => ({
    factions: [
      {
        id: '1',
        name: 'Trench Pilgrims',
        description:
          'So they come, the mad and the maimed, the Godtouched and the guilt-ridden – all gathering around Prophets and Prophetesses, forming Trench Pilgrim Processions. These disorganised groups arm themselves and follow the prophets of the Lord unto the front lines. They fight with unrivalled zeal, hurling themselves against the Heretics, arming themselves with anything they can get their hands on from the oldest muskets to scourges and Molotov Cocktails.',
        iconUrl: '@/assets/icons/icon_trench_pilgrims.png',
        troopTypes: ['Infantry', 'Cavalry', 'Artillery'],
        specialRules: ['Special Rule 1', 'Special Rule 2'],
        armory: [],
      },
      {
        id: '2',
        name: 'Heretic Legion',
        description:
          'A shroud of darkness blankets the world. Smoke and brimstone spews from the yawning gates of Inferno, enveloping the lands where people have abandoned God and openly wage war against His Creation. It is a grim reality that a full third of humanity has bent its knee before the idols of Hell. The main military force of Satan on Earth is the Heretic Legions, raised from amongst these citizens of the damned.',
        iconUrl: '@/assets/icons/icon_heretic_legion.png',
        troopTypes: ['Infantry', 'Beasts', 'Cultists'],
        specialRules: ['Heretical Fury', 'Dark Bargains'],
        armory: [],
      },
      {
        id: '3',
        name: 'Iron Sultanate',
        description:
          'A call was sent to those who believe righteously and, over the coming decades, the migration of the Faithful took place across Europa, Asia and Africa. Millions perished on the road and at sea, for the Heretics and their Shaytan lords swarmed them as locusts swarm fields of ripe sesame, devouring them and building vile monuments from their limbs and heads, so they could not be buried as is decreed in the Holy texts. But once all those who survived the journey had come, the mighty Gates of al-Qarnayn were closed and the Great Sultanate of the Invincible Iron Wall of the Two Horns That Pierce the Sky was formed.',
        iconUrl: '',
        troopTypes: ['Mechanized', 'Infantry', 'War Machines'],
        specialRules: ['Iron Discipline', 'Advanced Weaponry'],
        armory: [],
      },
      {
        id: '4',
        name: 'Principality of New Antioch',
        description:
          'For three hundred years the Principality of New Antioch has stood defiantly as the focal point of the Church and the Faithful at the very edge of the shadow cast by the Gate of Hell. It is the Home of All Our Hopes, the bulwark against Heretic forces and the first line of defence against the devil’s might. Should New Antioch fall, the Levant will be lost and the path to heartlands of the Church will be wide open.',
        iconUrl: '',
        troopTypes: ['Infantry', 'Cavalry', 'Artillery'],
        specialRules: ['Special Rule 1', 'Special Rule 2'],
        armory: [],
      },
      {
        id: '5',
        name: 'Black Grail',
        description:
          'The seventh layer of Hell, where the putrid fortress of Beelzebub stands, spews forth a torrent of demonic hell-flies, scorpions, locusts and other infernal insects. The Hellgate opens and a veritable tidal wave of foulness emerges, flowing across the land at startling speed, consuming everything and leaving indescribable horror in its wake. After nine days the insect swarm exhausts itself, devouring its own in its insatiable hunger.',
        iconUrl: '',
        troopTypes: ['Infantry', 'Cavalry', 'Artillery'],
        specialRules: ['Special Rule 1', 'Special Rule 2'],
        armory: [],
      },
      {
        id: '6',
        name: 'Court of the Seven Headed Serpent',
        description:
          'Upon the commands of the Court, the warbands of Hell gather at the Hellgate and strike out to blight our unhappy world. Yoke fiends muster under the banners of their praetors and sorcerers. The shattered forms of the Hell Knights are forced into their suits of armour, emerging from their fiery tombs where their bodies are kept crushed under mighty, ever-turning slabs of black basalt while they are not serving in the war effort. Desecrated Saints are brought forth to act as unholy war altars that pollute and pervert the land which they travel over. Ahead of the warbands fly Pit Locusts, the clatter of their wings heralding the coming of the Court, their poison stings leaving burns that cannot be healed. And sometimes, when the deathly omens in Hell’s burning sky and black stars are favourable, a Hunter of the Left-hand Path will join a warband as they strike out from the Mouth of Hell. As the warband marches to join the Great War, joyous and triumphant music played by unseen hands can be heard at these times, for taking part in one of these hunts is seen as a great privilege within the Sheol.',
        iconUrl: '',
        troopTypes: ['Infantry', 'Cavalry', 'Artillery'],
        specialRules: ['Special Rule 1', 'Special Rule 2'],
        armory: [],
      },
    ] as Faction[],
  }),
})
