import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';
import { getDatabase, ref, get } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js';

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
const auth = getAuth(app);
const database = getDatabase(app);

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    const rollNo = localStorage.getItem('studentRollNo');
    if (!rollNo) {
        console.error('No roll number found in localStorage');
        signOut(auth).then(() => window.location.href = 'login.html');
        return;
    }

    loadSyllabusData(rollNo);
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth).then(() => {
        localStorage.removeItem('studentRollNo');
        localStorage.removeItem('studentData'); // Clear student data on logout
        window.location.href = 'login.html';
    }).catch((error) => {
        console.error('Logout error:', error);
    });
});

const syllabusLinks = {
    '1': 'syllabus/sem1.pdf',
    '2': 'syllabus/sem2.pdf',
    '3': 'syllabus/sem3.pdf',
    '4': 'syllabus/sem4.pdf',
    '5': 'syllabus/sem5.pdf',
    '6': 'syllabus/sem6.pdf'
};

function loadSyllabusData(rollNo) {
    const semesterSelect = document.getElementById('semesterSelect');
    const syllabusLink = document.getElementById('syllabusLink');

    const studentData = JSON.parse(localStorage.getItem('studentData'));
    if (studentData) {
        const studentSemester = studentData.semester || '1';
        semesterSelect.value = studentSemester;
        updateSyllabusLink(studentSemester);
    } else {
        fetchStudentData(rollNo); // Fallback to fetch from DB if localStorage is empty
    }

    semesterSelect.addEventListener('change', (e) => {
        const semester = e.target.value;
        updateSyllabusLink(semester);
    });
}

async function fetchStudentData(rollNo) {
    const semesterSelect = document.getElementById('semesterSelect');
    const syllabusLink = document.getElementById('syllabusLink');

    try {
        const studentRef = ref(database, `students/${rollNo}`);
        const studentSnapshot = await get(studentRef);
        const studentData = studentSnapshot.val();

        const studentSemester = studentData && studentData.semester ? studentData.semester : '1';
        localStorage.setItem('studentData', JSON.stringify(studentData)); // Store in localStorage
        semesterSelect.value = studentSemester;
        updateSyllabusLink(studentSemester);
    } catch (error) {
        console.error('Error fetching student data:', error);
        alert('Error fetching semester: ' + error.message);
        semesterSelect.value = '1';
        updateSyllabusLink('1');
    }
}

function updateSyllabusLink(semester) {
    const syllabusLink = document.getElementById('syllabusLink');
    if (semester && syllabusLinks[semester]) {
        syllabusLink.href = syllabusLinks[semester];
        syllabusLink.style.display = 'inline-block';
    } else {
        syllabusLink.style.display = 'none';
    }
}
