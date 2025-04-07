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

    loadMarksData(rollNo);
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

const semesterSubjects = {
    '1': ['English', 'Applied Maths 1', 'Applied Physics 1', 'FIT'],
    '2': ['AIT', 'Applied Maths 2', 'Applied Physics 2', 'AE', 'EG', 'MMA', 'EVS'],
    '3': ['OS', 'PIC', 'DBMS', 'DE'],
    '4': ['English 2', 'COA', 'DS', 'OOPS', 'MOOCS'],
    '5': ['WT', 'Python', 'CN', 'Cloud', 'MOOCS'],
    '6': ['NS', 'SE', 'EDM']
};

async function loadMarksData(rollNo) {
    const studentData = JSON.parse(localStorage.getItem('studentData'));
    let semester = studentData?.semester || '5';
    const subjects = semesterSubjects[semester] || semesterSubjects['5'];

    // Immediately populate with empty marks (for speed) while fetching
    populateMarks(semester, subjects, {});

    try {
        // Fetch marks from Firebase
        const marksRef = ref(database, `marks/${rollNo}`);
        const marksSnapshot = await get(marksRef);
        const marksData = marksSnapshot.val() || {};

        // If studentData is missing, fetch it as a fallback
        if (!studentData) {
            const studentRef = ref(database, `students/${rollNo}`);
            const studentSnapshot = await get(studentRef);
            const fetchedData = studentSnapshot.val();
            if (fetchedData) {
                localStorage.setItem('studentData', JSON.stringify(fetchedData));
                semester = fetchedData.semester || '5';
                const updatedSubjects = semesterSubjects[semester] || semesterSubjects['5'];
                populateMarks(semester, updatedSubjects, marksData);
            } else {
                populateMarks(semester, subjects, marksData); // Use default semester
            }
        } else {
            populateMarks(semester, subjects, marksData); // Update with fetched marks
        }
    } catch (error) {
        console.error('Error fetching marks data:', error);
        alert('Error fetching marks: ' + error.message);
        // Already populated with N/A, no need to re-populate
    }
}

function populateMarks(semester, subjects, marksData) {
    const sessional1Marks = document.getElementById('sessional1Marks');
    const sessional2Marks = document.getElementById('sessional2Marks');
    const sessional3Marks = document.getElementById('sessional3Marks');

    const sessional1 = marksData.sessional1 || {};
    const sessional2 = marksData.sessional2 || {};
    const sessional3 = marksData.sessional3 || {};

    sessional1Marks.innerHTML = '';
    subjects.forEach(subject => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${subject}</td><td>${sessional1[subject] || 'N/A'}</td>`;
        sessional1Marks.appendChild(tr);
    });

    sessional2Marks.innerHTML = '';
    subjects.forEach(subject => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${subject}</td><td>${sessional2[subject] || 'N/A'}</td>`;
        sessional2Marks.appendChild(tr);
    });

    sessional3Marks.innerHTML = '';
    subjects.forEach(subject => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${subject}</td><td>${sessional3[subject] || 'N/A'}</td>`;
        sessional3Marks.appendChild(tr);
    });
}
