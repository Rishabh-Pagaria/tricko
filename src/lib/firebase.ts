import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKY7N0BHn5QedT15xuV_rHrn-yzm38y3o",
  authDomain: "trick0.firebaseapp.com",
  projectId: "trick0",
  storageBucket: "trick0.firebasestorage.app",
  messagingSenderId: "262029838740",
  appId: "1:262029838740:web:5ec13eecd1fb9df259e781",
  measurementId: "G-56V328J9GN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase instances
export const auth = getAuth(app);
export const db = getFirestore(app);

export default { auth, db };