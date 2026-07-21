// global.d.ts
// This file extends the global Window interface with custom properties
// used in the application (e.g., for storing audio references globally).

declare global {
  interface Window {
    /**
     * Optional reference to an HTMLAudioElement stored globally.
     * Commonly used as a workaround for browser autoplay restrictions
     * or to control audio playback from anywhere in the app.
     */
    audioElement?: HTMLAudioElement;
  }
}

// This empty export ensures TypeScript treats this file as a module.
// Without it, you might get errors about augmenting the global scope.
export {};