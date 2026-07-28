// Shared handshake keys between the preloader, the Viewing, and the Choreographer.
export const LOADER_KEY = "mh-loaded"; // sessionStorage: preloader already shown this session
export const READY_EVENT = "mh:ready"; // fired when the preloader releases the page
export const VIEWING_KEY = "mh-viewing"; // sessionStorage: route arrived via the Viewing
