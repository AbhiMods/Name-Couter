const DB_NAME = 'DivineNameDB';
const DB_VERSION = 1;

// Simple encryption/obfuscation to prevent casual reading of local data
// In a real production app, use Web Crypto API with a user-derived key.
const encrypt = (data) => {
    try {
        const json = JSON.stringify(data);
        // Base64 encode for basic obfuscation (Not military grade encryption, but meets requirement for basic protection)
        return btoa(encodeURIComponent(json));
    } catch (e) {
        console.error('Encryption failed', e);
        return data;
    }
};

const decrypt = (data) => {
    try {
        const json = decodeURIComponent(atob(data));
        return JSON.parse(json);
    } catch (e) {
        // Fallback for unencrypted data during migration
        return data;
    }
};

class StorageService {
    constructor() {
        this.db = null;
        this.initPromise = this.init();
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = (event) => {
                console.error("Database error: " + event.target.errorCode);
                reject(event.target.errorCode);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Key-Value Store for Settings & Simple State
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }

                // Structured Store for Daily Stats
                if (!db.objectStoreNames.contains('stats')) {
                    const statsStore = db.createObjectStore('stats', { keyPath: 'date' });
                    statsStore.createIndex('date', 'date', { unique: true });
                }

                // Structured Store for Logs (future detailed analytics)
                if (!db.objectStoreNames.contains('logs')) {
                    const logsStore = db.createObjectStore('logs', { keyPath: 'id', autoIncrement: true });
                    logsStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                // BLOB Store for User Audio
                if (!db.objectStoreNames.contains('audio')) {
                    db.createObjectStore('audio'); // Key will be nameId
                }
            };
        });
    }

    async get(storeName, key) {
        await this.initPromise;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);

            request.onsuccess = () => {
                if (request.result && request.result.value) {
                    // Decrypt if it's from settings or specific sensitive fields
                    if (storeName === 'settings') {
                        resolve(decrypt(request.result.value));
                    } else {
                        resolve(request.result.value);
                    }
                } else {
                    resolve(request.result ? request.result.value : null);
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    async set(storeName, key, value) {
        await this.initPromise;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);

            let storedValue = value;
            if (storeName === 'settings') {
                storedValue = encrypt(value);
            }

            const item = { key, value: storedValue };

            // For stats, we might structure differently, but generic key/value works for migration
            if (storeName === 'stats') {
                // For stats store, we expect object { date: 'YYYY-MM-DD', count: 123 }
                // The 'put' argument depends on keyPath
                // If keyPath is defined in store, valid object required
            }

            // Generic put for 'settings' (keyPath: 'key')
            // For other stores, use specific methods

            const request = store.put(item);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // specialized method for settings
    async setSetting(key, value) {
        return this.set('settings', key, value);
    }

    async getSetting(key, defaultValue) {
        const val = await this.get('settings', key);
        return val !== undefined && val !== null ? val : defaultValue;
    }

    // specialized method for stats
    async saveDailyStat(date, count) {
        await this.initPromise;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['stats'], 'readwrite');
            const store = transaction.objectStore('stats');
            const request = store.put({ date, count }); // keyPath is 'date'
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getDailyStat(date) {
        await this.initPromise;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['stats'], 'readonly');
            const store = transaction.objectStore('stats');
            const request = store.get(date);
            request.onsuccess = () => resolve(request.result ? request.result.count : 0);
            request.onerror = () => reject(request.error);
        });
    }

    // Batch get all daily stats
    async getAllDailyStats() {
        await this.initPromise;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['stats'], 'readonly');
            const store = transaction.objectStore('stats');
            const request = store.getAll();
            request.onsuccess = () => {
                // Convert array [{date, count}] to object {date: count} for compatibility
                const map = {};
                if (request.result) {
                    request.result.forEach(item => {
                        map[item.date] = item.count;
                    });
                }
                resolve(map);
            };
            request.onerror = () => reject(request.error);
        });
    }

    // Audio Blob Methods
    async saveAudio(id, blob) {
        await this.initPromise;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['audio'], 'readwrite');
            const store = transaction.objectStore('audio');
            const request = store.put(blob, id);
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    async getAudio(id) {
        await this.initPromise;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['audio'], 'readonly');
            const store = transaction.objectStore('audio');
            const request = store.get(id);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async deleteAudio(id) {
        await this.initPromise;
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['audio'], 'readwrite');
            const store = transaction.objectStore('audio');
            const request = store.delete(id);
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }
}

export const dbRequest = new StorageService();
