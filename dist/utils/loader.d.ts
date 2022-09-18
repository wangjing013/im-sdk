export declare const loadScript: (url: string, name: string) => Promise<boolean>;
export declare const loadCSS: (url: string, name: string) => Promise<unknown>;
export declare const loadScriptsInOrder: (arrayOfJs: []) => Promise<boolean>;
