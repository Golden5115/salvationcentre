// src/lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDGljAR20BYI6EpU6qawAwwCz9r_VTHm0U",
  authDomain: "rccg-salvation-centre-7f983.firebaseapp.com",
  projectId: "rccg-salvation-centre-7f983",
  storageBucket: "rccg-salvation-centre-7f983.firebasestorage.app",
  messagingSenderId: "814696395876",
  appId: "1:814696395876:web:bcc6893c08c116f79cdb71",
  measurementId: "G-3R21XFTVRT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);

export default app;