import { defineStore } from 'pinia'
import type { Faction } from '../models/faction'
import { computed, ref } from 'vue'
import { factionSeed } from '../seed/factionSeed'
import { collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../services/firebase'

export const useFactionStore = defineStore('faction', () => {
  const factions = ref<Faction[]>([...factionSeed]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Get only factions that can be selected when creating a new army
  const playableFactions = computed(() => {
    return factions.value.filter(faction => faction.isPlayable !== false);
  });

  // Factoring out the faction refresh function for easier testing
  async function fetchFactionsFromFirestore() {
    const querySnapshot = await getDocs(collection(db, 'factions'));
    const fetchedFactions: Faction[] = [];
    querySnapshot.forEach((doc) => {
      fetchedFactions.push({ ...doc.data(), id: doc.id } as Faction);
    });

    if (fetchedFactions.length > 0) {
      console.log('Loaded factions from Firestore:', fetchedFactions.length);
      return fetchedFactions;
    } else {
      console.log('No factions found in Firestore, using seed data');
      return null;
    }
  }

  // Syncing with firestore
  async function syncWithFirestore() {
    try {
      const fetchedFactions = await fetchFactionsFromFirestore();
      if (fetchedFactions) {
        factions.value = fetchedFactions;
      }
    } catch (err) {
      console.error('Error syncing with Firestore:', err);
    }
  }

  /**
   * Seed the Firestore database with initial faction data
   */
  async function seedFactions(force = false) {
    loading.value = true;
    error.value = null;
    try {
      // Check if collection is empty first, unless force is true
      if (!force) {
        const snapshot = await getDocs(collection(db, 'factions'));
        if (!snapshot.empty) {
          console.log('Factions collection is not empty, skipping seed');
          return;
        }
      } else {
        console.log('Force reseeding factions...');
        // If force is true, delete existing documents first
        const snapshot = await getDocs(collection(db, 'factions'));
        const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);
        console.log(`Deleted ${snapshot.size} existing faction documents`);
      }

      const seedPromises = factionSeed.map(async (faction) => {
        // Use the faction's predefined ID as the document ID
        const factionRef = doc(db, 'factions', faction.id);
        await setDoc(factionRef, faction);
        console.log(`Seeded faction: ${faction.name} with ID ${faction.id}`);
      });

      await Promise.all(seedPromises);
      console.log('Factions collection seeded successfully');

      // Fetch the seeded data
      await syncWithFirestore();
    } catch (err) {
      console.error('Error seeding factions:', err);
      error.value = 'Failed to seed factions';
    } finally {
      loading.value = false;
    }
  }

  return {
    factions,
    playableFactions,
    syncWithFirestore,
    seedFactions,
    loading,
    error
  }
});
