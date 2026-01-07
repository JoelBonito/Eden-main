import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock do Firebase
vi.mock('firebase/compat/app', () => ({
    default: {
        initializeApp: vi.fn(),
        auth: vi.fn(() => ({
            onAuthStateChanged: vi.fn(),
            currentUser: null,
        })),
        firestore: vi.fn(() => ({
            collection: vi.fn(),
        })),
        storage: vi.fn(() => ({
            ref: vi.fn(),
        })),
    },
}));

vi.mock('./services/firebase', () => ({
    auth: {
        onAuthStateChanged: vi.fn(),
        currentUser: null,
    },
    db: {
        collection: vi.fn(() => ({
            doc: vi.fn(() => ({
                get: vi.fn(),
                set: vi.fn(),
                update: vi.fn(),
                delete: vi.fn(),
                onSnapshot: vi.fn(),
            })),
            orderBy: vi.fn(() => ({
                get: vi.fn(),
            })),
        })),
    },
    storage: {
        ref: vi.fn(),
    },
    functions: {
        httpsCallable: vi.fn(),
    },
}));
