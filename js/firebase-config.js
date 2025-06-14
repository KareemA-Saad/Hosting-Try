// Firebase App and services are loaded via CDN in index.html
// This file initializes Firebase using the global firebase object

window.firebaseConfig = {
  apiKey: "AIzaSyDOL8EAF_5kYHAom1fZ_7UiAxWcWIJ5Aok",
  authDomain: "pack-go-5d568.firebaseapp.com",
  projectId: "pack-go-5d568",
  storageBucket: "pack-go-5d568.firebasestorage.app",
  messagingSenderId: "525870091383",
  appId: "1:525870091383:web:06655ed6e02bcf40e28a72",
  measurementId: "G-R9DE3EBPD2"
};

window.firebaseApp = firebase.initializeApp(window.firebaseConfig);
window.db = firebase.firestore();
window.auth = firebase.auth();
window.analytics = firebase.analytics();
