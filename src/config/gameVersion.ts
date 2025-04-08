export const GAME_VERSION = import.meta.env.VITE_GAME_VERSION || '1.6.3';

export interface GameVersionInfo {
    version: string;
    releaseDate: Date;
    isActive: boolean;
    changelog?: string;
}

export const GAME_VERSIONS: GameVersionInfo[] = [
    {
        version: '1.6.3',
        releaseDate: new Date('2024-04-08'),
        isActive: true,
    }
];

export const getGameVersion = (): string => GAME_VERSION;

export const isValidGameVersion = (version: string): boolean => {
    return GAME_VERSIONS.some(v => v.version === version);
};

export const getVersionInfo = (version: string): GameVersionInfo | undefined => {
    return GAME_VERSIONS.find(v => v.version === version);
};
