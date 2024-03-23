import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: process.env.React_App_apiKey,
  authDomain: process.env.React_App_authDomain,
  projectId: process.env.React_App_projectId,
  storageBucket: process.env.React_App_storageBucket,
  messagingSenderId: process.env.React_App_messagingSenderId,
  appId: process.env.React_App_appId,
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();
export const database = {
  users: firestore.collection("users"),
  docs: firestore.collection("docs"),
  files: firestore.collection("files"),
  date: firebase.firestore.FieldValue.serverTimestamp(),
};

export const storage = firebase.storage();  

export const auth = firebase.auth();
