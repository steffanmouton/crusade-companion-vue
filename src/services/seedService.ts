import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, Firestore } from 'firebase/firestore';
import { GAME_VERSION, isValidGameVersion } from '../config/gameVersion';

export class SeedService {
    private db: Firestore;

    constructor() {
        this.db = getFirestore();
    }

    protected async seedCollection<T>(
        collectionName: string,
        data: T[],
        version: string = GAME_VERSION
    ): Promise<void> {
        if (!isValidGameVersion(version)) {
            throw new Error(`Invalid game version: ${version}`);
        }

        const versionedCollectionRef = collection(
            this.db,
            'versions',
            version,
            collectionName
        );

        for (const item of data) {
            const docRef = doc(versionedCollectionRef);
            await setDoc(docRef, {
                ...item,
                version,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        console.log(`✅ Seeded ${data.length} ${collectionName} for version ${version}`);
    }

    protected async updateActiveVersion(version: string = GAME_VERSION): Promise<void> {
        if (!isValidGameVersion(version)) {
            throw new Error(`Invalid game version: ${version}`);
        }

        const configRef = doc(this.db, 'gameConfig', 'version');
        await setDoc(configRef, {
            activeVersion: version,
            updatedAt: new Date()
        });

        console.log(`✅ Updated active version to ${version}`);
    }
}
