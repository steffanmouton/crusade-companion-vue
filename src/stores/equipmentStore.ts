import { defineStore } from 'pinia'
import type { Equipment } from '../models/equipment'
import { createDucatsCost, createGloryPointsCost, createMixedCost } from '../models/cost'
import {
  getDocument,
  addDocument,
  updateDocument,
  deleteDocument,
  getDocuments,
  getTimestamp,
} from '../services/firestore'
import { ref, computed } from 'vue'

const COLLECTION_NAME = 'equipment'

// Define reusable data sets
const meleeWeapons: Equipment[] = [
  {
    id: 'unarmed',
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
    id: 'knife-dagger',
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
    id: 'trench-club',
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
    id: 'sword-axe',
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
    id: 'bayonet',
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
    id: 'sacrificial-knife',
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
    id: 'blasphemous-staff',
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
  {
    id: 'hellblade',
    name: 'Hellblade',
    type: 'Melee Weapon',
    description: 'A sword forged in the fires of hell, burning with hellfire',
    range: 'Melee',
    cost: createDucatsCost(10),
    modifiers: ['+1D Injuries'],
    keywords: ['FIRE'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'The Hellblade has +1 DICE when rolling for injuries. It also has the Keyword FIRE, so it causes an additional +1 BLOOD MARKER on enemies it hits.',
    ],
  },
  {
    id: 'tartarus-claws',
    name: 'Tartarus Claws',
    type: 'Melee Weapon',
    description: 'Mechanized claws that tear through flesh and armor alike',
    range: 'Melee',
    cost: createDucatsCost(15),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Tartarus Claws always come as a pair and do not allow the use of any other melee weapons. You can make two Attack ACTIONS with the Claws without the usual -1 DICE for the second attack. If the opponent is taken Down or Out of Action with the Claws you may immediately move the model up to 3". If the move takes you into contact with another enemy model, this counts as a charge and you can make a second Melee Attack ACTION with the claws. You can only do this follow-up move once per Activation.',
    ],
  },
  {
    id: 'anti-tank-hammer',
    name: 'Anti-Tank Hammer',
    type: 'Melee Weapon',
    description: 'A massive hammer designed to damage armored targets',
    range: 'Melee',
    cost: createDucatsCost(8),
    modifiers: ['+1D to Injuries'],
    keywords: ['RISKY', 'CRITICAL'],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Ignores armour modifiers and rolls injuries with +1 DICE. If it hits the enemy, the wielder suffers +1 BLOOD MARKER as well.',
    ],
  },
]

// Ranged Weapons
const rangedWeapons: Equipment[] = [
  {
    id: 'pistol-revolver',
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
    id: 'automatic-pistol',
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
    id: 'bolt-action-rifle',
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
  {
    id: 'semi-automatic-rifle',
    name: 'Semi-Automatic Rifle',
    type: 'Ranged Weapon',
    description: 'A self-loading rifle that offers more firepower than standard bolt-action models',
    range: '24"',
    cost: createDucatsCost(15),
    modifiers: [],
    keywords: ['ASSAULT'],
    equipmentIndicator: { hasBayonetLug: true, shieldCombo: false },
    rules: [],
  },
  {
    id: 'automatic-rifle',
    name: 'Automatic Rifle',
    type: 'Ranged Weapon',
    description: 'A fully automatic rifle capable of sustained fire',
    range: '24"',
    cost: createMixedCost(0, 2), // Using example of glory points cost
    modifiers: ['2 attacks'],
    keywords: ['ASSAULT'],
    equipmentIndicator: { hasBayonetLug: true, shieldCombo: false },
    rules: [
      'A model armed with an Automatic Rifle can make two attack ACTIONS instead of one. Both attacks must be against the same target.',
    ],
  },
  {
    id: 'shotgun',
    name: 'Shotgun',
    type: 'Ranged Weapon',
    description: 'A short-barrelled firearm firing multiple pellets, deadly at close range',
    range: '12"',
    cost: createDucatsCost(10),
    modifiers: ['+1D Hit'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: true, shieldCombo: true },
    rules: [
      'Owing to its high accuracy, add +1 DICE to all rolls to hit and ignore the penalty to hit rolls when attacking at long range. However, injuries are rolled with -1 DICE at long range due to the low penetration power.',
    ],
  },
]

// Armor items
const armorItems: Equipment[] = [
  {
    id: 'trench-shield',
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
    id: 'standard-armour',
    name: 'Standard Armour',
    type: 'Armour',
    description: 'Basic protective armor offering moderate protection',
    cost: createDucatsCost(7),
    modifiers: ['-1 to all Injury Chart rolls'],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['-1 to all Injury Chart rolls against the model. Can be combined with any shield.'],
  },
  {
    id: 'reinforced-armour',
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

// General equipment
const equipmentItems: Equipment[] = [
  {
    id: 'combat-helmet',
    name: 'Combat Helmet',
    type: 'Equipment',
    description: 'A helmet protecting the wearer from overhead dangers',
    cost: createDucatsCost(3),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['Ignores additional BLOOD MARKERS caused by the Keyword SHRAPNEL.'],
  },
  {
    id: 'medi-kit',
    name: 'Medi-kit',
    type: 'Equipment',
    description: 'Field medical supplies for treating injuries',
    cost: createDucatsCost(5),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Models with a Medi-kit can take a RISKY ACTION to remove one BLOOD MARKER from any one friendly model (including themselves) within 1" range or allow one friendly model (including themselves) that is Down to regain their footing.',
    ],
  },
  {
    id: 'gas-mask',
    name: 'Gas Mask',
    type: 'Equipment',
    description: 'Protects against poisonous gases used in warfare',
    cost: createDucatsCost(4),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Negates the extra BLOOD MARKER from attacks with the keyword GAS. Any such attacks suffer -1 DICE penalty to all injury rolls.',
    ],
  },
  {
    id: 'holy-relic',
    name: 'Holy Relic',
    type: 'Equipment',
    description: 'A blessed item that provides divine protection',
    cost: createGloryPointsCost(1),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: ['This model starts each game with +1 BLESSING MARKER.'],
  },
  {
    id: 'sniper-scope',
    name: 'Sniper Scope',
    type: 'Equipment',
    description: 'An optical sight that increases accuracy at range',
    cost: createDucatsCost(7),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'Negates the penalty for Long Range if the model has not moved during this Activation. Only usable with rifles (i.e. weapons which have the Keyword rifle in their name).',
    ],
  },
  {
    id: 'shovel',
    name: 'Shovel',
    type: 'Equipment',
    description: 'A trench tool that can provide cover and be used as a weapon',
    cost: createDucatsCost(2),
    modifiers: [],
    keywords: [],
    equipmentIndicator: { hasBayonetLug: false, shieldCombo: false },
    rules: [
      'A model equipped with a shovel always starts the game in cover if deployed on ground level, even if placed in open terrain. As soon as the model moves, it is no longer in cover. A model that is covered in this way retains the benefit of Cover even if the attacking model has an unobstructed view of it. If a model equipped with a shovel has two hands free, it can use it in Melee Combat as if it were a Trench Club.',
    ],
  },
]

// Initial equipment data that will be used to populate Firestore if needed
const initialEquipment: Equipment[] = [
  ...meleeWeapons,
  ...rangedWeapons,
  ...armorItems,
  ...equipmentItems,
]

export const useEquipmentStore = defineStore('equipment', () => {
  const equipment = ref<Equipment[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  // Computed properties
  const equipmentByType = computed(() => {
    const result: Record<string, Equipment[]> = {}
    equipment.value.forEach((item) => {
      const type = item.type
      if (!result[type]) {
        result[type] = []
      }
      result[type].push(item)
    })
    return result
  })

  const getEquipmentForTroop = computed(() => (troopId: string, keywords: string[]) => {
    return equipment.value.filter((item) => {
      // If no restrictions, return true
      if (!item.onlyFor) return true

      // Check if this equipment is available to everyone or specifically to this troop
      const factionMatch = !item.onlyFor.faction || item.onlyFor.faction === ''
      const troopMatch =
        !item.onlyFor.troopIds ||
        item.onlyFor.troopIds.length === 0 ||
        item.onlyFor.troopIds.includes(troopId)

      // Check keywords - if equipment requires keywords, troop must have them
      const keywordMatch =
        !item.onlyFor.keywords ||
        item.onlyFor.keywords.length === 0 ||
        item.onlyFor.keywords.every((keyword) => {
          // Handle negated keywords (prefixed with !)
          if (keyword.startsWith('!')) {
            return !keywords.includes(keyword.substring(1))
          }
          // Regular keyword matching
          return keywords.includes(keyword)
        })

      return factionMatch && troopMatch && keywordMatch
    })
  })

  // Get all equipment (admin function)
  async function getAllEquipment() {
    loading.value = true
    error.value = null

    try {
      const equipmentData = await getDocuments<Equipment>(COLLECTION_NAME)
      equipment.value = equipmentData
    } catch (err: any) {
      console.error('Error loading equipment:', err)
      error.value = err.message || 'Failed to load equipment'
    } finally {
      loading.value = false
    }
  }

  // Initialize the store with predefined equipment
  async function initializeEquipment() {
    if (initialized.value) return

    loading.value = true
    error.value = null

    try {
      // First, get all equipment from Firestore
      const equipmentData = await getDocuments<Equipment>(COLLECTION_NAME)

      // If no equipment exists, add the initial equipment
      if (equipmentData.length === 0 && initialEquipment.length > 0) {
        const promises = initialEquipment.map(async (item) => {
          const { id, ...itemData } = item
          const timestamp = getTimestamp()
          const newItem = {
            ...itemData,
            ...timestamp,
          }
          const newId = await addDocument(COLLECTION_NAME, newItem)
          return { id: newId, ...newItem } as Equipment
        })

        const createdItems = await Promise.all(promises)
        equipment.value = createdItems
      } else {
        equipment.value = equipmentData
      }

      initialized.value = true
    } catch (err: any) {
      console.error('Error initializing equipment:', err)
      error.value = err.message || 'Failed to initialize equipment'
    } finally {
      loading.value = false
    }
  }

  // Get a specific equipment item by ID
  async function getEquipmentItem(id: string) {
    try {
      return await getDocument<Equipment>(COLLECTION_NAME, id)
    } catch (err: any) {
      console.error(`Error getting equipment ${id}:`, err)
      error.value = err.message || 'Failed to get equipment'
      return null
    }
  }

  // Add a new equipment item
  async function addEquipmentItem(itemData: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) {
    loading.value = true
    error.value = null

    try {
      const timestamp = getTimestamp()
      const newItem = {
        ...itemData,
        ...timestamp,
      }

      const id = await addDocument(COLLECTION_NAME, newItem)
      const createdItem: Equipment = {
        id,
        ...newItem,
      }

      equipment.value.push(createdItem)
      return createdItem
    } catch (err: any) {
      console.error('Error adding equipment:', err)
      error.value = err.message || 'Failed to add equipment'
      return null
    } finally {
      loading.value = false
    }
  }

  // Update an equipment item
  async function updateEquipmentItem(id: string, itemData: Partial<Equipment>) {
    loading.value = true
    error.value = null

    try {
      const data = {
        ...itemData,
        updatedAt: Date.now(),
      }

      await updateDocument(COLLECTION_NAME, id, data)

      const index = equipment.value.findIndex((item) => item.id === id)
      if (index !== -1) {
        equipment.value[index] = { ...equipment.value[index], ...data }
      }

      return true
    } catch (err: any) {
      console.error(`Error updating equipment ${id}:`, err)
      error.value = err.message || 'Failed to update equipment'
      return false
    } finally {
      loading.value = false
    }
  }

  // Delete an equipment item
  async function deleteEquipmentItem(id: string) {
    loading.value = true
    error.value = null

    try {
      await deleteDocument(COLLECTION_NAME, id)
      equipment.value = equipment.value.filter((item) => item.id !== id)
      return true
    } catch (err: any) {
      console.error(`Error deleting equipment ${id}:`, err)
      error.value = err.message || 'Failed to delete equipment'
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    equipment,
    loading,
    error,
    equipmentByType,
    getEquipmentForTroop,
    getAllEquipment,
    initializeEquipment,
    getEquipmentItem,
    addEquipmentItem,
    updateEquipmentItem,
    deleteEquipmentItem,
  }
})
