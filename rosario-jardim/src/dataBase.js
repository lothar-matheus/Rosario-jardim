import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDRhYOHHpT7WjVoV3Q1EwvQQH7QinLl720",
  authDomain: "rosariojardim-461dc.firebaseapp.com",
  databaseURL: "https://rosariojardim-461dc-default-rtdb.firebaseio.com",
  projectId: "rosariojardim-461dc",
  storageBucket: "rosariojardim-461dc.appspot.com",
  messagingSenderId: "724547893889",
  appId: "1:724547893889:web:48390dd263e803ca3f6b80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app)

export { database };
