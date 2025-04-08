import { SeedService } from '../services/seedService';
import { hereticTroopsSeed } from './troopSeed';
import type { Troop } from '../models/troop';
import { GAME_VERSION } from '../config/gameVersion';

export class TroopSeeder extends SeedService {
    private readonly collectionName = 'troops';
    private troops: Troop[] = hereticTroopsSeed;

    async seed(version: string = GAME_VERSION): Promise<void> {
        try {
            await this.seedCollection(this.collectionName, this.troops, version);
            await this.updateActiveVersion(version);
        } catch (error) {
            console.error(`Failed to seed troops for version ${version}:`, error);
            throw error;
        }
    }
}

// Usage example:
// const seeder = new TroopSeeder();
// seeder.seed().then(() => console.log('Seeding complete!'));
