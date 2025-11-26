// Firebase Configuration
// ⚠️ WICHTIG: Diese Datei enthält öffentliche Firebase-Konfiguration
// Die apiKey ist öffentlich und sicher für Client-Side Nutzung
// Echte Sicherheit kommt durch Firestore Security Rules!
// 
// ⚠️ SECURITY NOTE: Diese Config ist öffentlich sichtbar im Frontend.
// Das ist bei Firebase normal und sicher, da die echte Sicherheit
// durch Firestore Security Rules gewährleistet wird.

export const firebaseConfig = {
  apiKey: "AIzaSyDF2qsdE0bbpI_ANm5Goh0SmoWarrzOGYQ",
  authDomain: "road2skill-af55a.firebaseapp.com",
  projectId: "road2skill-af55a",
  storageBucket: "road2skill-af55a.firebasestorage.app",
  messagingSenderId: "533346184642",
  appId: "1:533346184642:web:fe1d644238b6b1ef85fa5b",
  measurementId: "G-JVTCCDR8XQ",
};

// ⚠️ WICHTIG FÜR PRODUCTION:
// 1. Firestore Security Rules deployen (siehe firestore.rules)
// 2. Keine sensiblen API Keys hier speichern
// 3. Backend-Proxy für externe APIs verwenden

