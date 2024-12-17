import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVGY9nytyGbixxxtVm5XsH_BiL0BKV9s0",
  authDomain: "tesis-8a63a.firebaseapp.com",
  projectId: "tesis-8a63a",
  storageBucket: "tesis-8a63a.appspot.com",
  messagingSenderId: "819865917094",
  appId: "1:819865917094:web:d854e54958965a689f0667",
};

export const initFirebase = initializeApp(firebaseConfig);
export const db = getFirestore(initFirebase);
