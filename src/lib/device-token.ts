// memory only, never persisted
let deviceToken: string | null = null;

export const deviceTokenStore = {
  get: (): string | null => deviceToken,
  set: (t: string): void => {
    deviceToken = t;
  },
  clear: (): void => {
    deviceToken = null;
  },
};
