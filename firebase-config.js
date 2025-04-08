import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBzguLoHs-7yrbSal8IBDqnKL8MWwlUJZA",
    authDomain: "tmcp-a366e.firebaseapp.com",
    databaseURL: "https://tmcp-a366e-default-rtdb.firebaseio.com",
    projectId: "tmcp-a366e",
    storageBucket: "tmcp-a366e.firebasestorage.app",
    messagingSenderId: "136159734708",
    appId: "1:136159734708:web:5f33b5cd7535c09227e0e1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
