// vitest.setup.ts

// Fixes Node 25+ native localStorage clashing with jsdom
if (typeof window !== 'undefined') {
  let store: Record<string, string> = {};

  const localStorageMock = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = String(value); },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; },
    getLength: () => Object.keys(store).length,
    key: (index: number) => Object.keys(store)[index] || null,
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
}