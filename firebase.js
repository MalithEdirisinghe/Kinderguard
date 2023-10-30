// import { initializeApp } from 'firebase/app';
// import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getFirestore } from 'firebase/firestore';

// const firebaseConfig = {
//     apiKey: "AIzaSyAMmu62zjgOwpWOrREcwQizllaIdvJwVpM",
//     authDomain: "kinderguard-d163c.firebaseapp.com",
//     projectId: "kinderguard-d163c",
//     storageBucket: "kinderguard-d163c.appspot.com",
//     messagingSenderId: "1012482240286",
//     appId: "1:1012482240286:web:dd521aed35b58cce4d230f"
// };

// // Initialize Firebase if it's not already initialized
// const app = initializeApp(firebaseConfig);

// // Get the Firebase Authentication instance
// // const auth = getAuth();
// const auth = initializeAuth(app, {
//     persistence: getReactNativePersistence(AsyncStorage),
// });
// const db = getFirestore(app);
// export { auth, db };

import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAMmu62zjgOwpWOrREcwQizllaIdvJwVpM",
    authDomain: "kinderguard-d163c.firebaseapp.com",
    projectId: "kinderguard-d163c",
    storageBucket: "kinderguard-d163c.appspot.com",
    messagingSenderId: "1012482240286",
    appId: "1:1012482240286:web:dd521aed35b58cce4d230f"
};

// Initialize Firebase if it's not already initialized
const app = initializeApp(firebaseConfig);

// Get the Firebase Authentication instance
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

// Initialize Firebase Storage
const storage = getStorage(app);

const db = getFirestore(app);

export { auth, db, storage };
