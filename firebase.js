import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBTzwXmLElAixhakM2ca9uh4oyiHP5Jdvc",
    authDomain: "twittercloneorwhatt.firebaseapp.com",
    projectId: "twittercloneorwhatt",
    storageBucket: "twittercloneorwhatt.appspot.com",
    messagingSenderId: "1098731735485",
    appId: "1:1098731735485:web:929524bd2fd6726d8fead4"
  };

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const db = getFirestore();
  const storage = getStorage();
  
  export default app;
  export { db, storage };