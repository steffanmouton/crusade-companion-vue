import { TroopSeeder } from './seedTroops';
import { GAME_VERSION } from '../config/gameVersion';

export class MainSeeder {
    private seeders = {
        troops: new TroopSeeder(),
        // Add other seeders here as you create them
        // equipment: new EquipmentSeeder(),
        // factions: new FactionSeeder(),
        // etc.
    };

    async seedAll(version: string = GAME_VERSION): Promise<void> {
        console.log(`🌱 Starting seed process for game version ${version}...`);

        try {
            // Seed all collections
            for (const [name, seeder] of Object.entries(this.seeders)) {
                console.log(`\n📦 Seeding ${name}...`);
                await seeder.seed(version);
            }

            console.log(`\n✅ Seeding complete for version ${version}!`);
        } catch (error) {
            console.error('\n❌ Seeding failed:', error);
            throw error;
        }
    }
}

// Usage:
// const mainSeeder = new MainSeeder();
// mainSeeder.seedAll().then(() => console.log('All done!'));
