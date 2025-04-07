import { auth, db } from './firebase-config.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { get, ref } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const rollNo = document.getElementById('rollNo').value.trim().toUpperCase();
    const password = document.getElementById('password').value;

    try {
        // Check student data
        const studentRef = ref(db, `students/${rollNo}`);
        const studentSnapshot = await get(studentRef);

        if (!studentSnapshot.exists()) {
            throw new Error('Invalid roll number');
        }

        const studentData = studentSnapshot.val();
        const email = studentData.email;

        // Attempt login with Firebase Authentication
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in:', userCredential.user);

        // Store student data in localStorage
        localStorage.setItem('studentRollNo', rollNo);
        localStorage.setItem('studentData', JSON.stringify(studentData));

        // Redirect to dashboard
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = error.message === 'Invalid roll number'
            ? 'Invalid roll number'
            : error.code === 'auth/wrong-password'
            ? 'Incorrect password'
            : error.code === 'auth/user-not-found'
            ? 'User not found, please sign up'
            : 'Login error: ' + error.message;
        errorMessage.style.display = 'block';
        setTimeout(() => errorMessage.style.display = 'none', 3000);
    }
});
