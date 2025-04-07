import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js';
import { getAuth, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';
import { getDatabase, ref, get, set } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js';

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

    loadStudentData(rollNo);
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

function loadStudentData(rollNo) {
    const studentData = JSON.parse(localStorage.getItem('studentData'));
    if (studentData) {
        document.getElementById('profileName').textContent = studentData.name || 'N/A';
        document.getElementById('profileEmail').textContent = studentData.email || 'N/A';
        document.getElementById('profileRollNo').textContent = rollNo;
        document.getElementById('profileBranch').textContent = studentData.branch || 'N/A';
        document.getElementById('profileSemester').textContent = studentData.semester || 'N/A';
        populateSubjects(studentData.semester || '5');
    } else {
        console.error('No student data in localStorage, fetching from DB');
        fetchStudentData(rollNo); // Fallback to fetch from DB if localStorage is empty
    }
}

async function fetchStudentData(rollNo) {
    try {
        const studentRef = ref(database, `students/${rollNo}`);
        const snapshot = await get(studentRef);
        const data = snapshot.val();
        if (data) {
            localStorage.setItem('studentData', JSON.stringify(data)); // Store in localStorage
            document.getElementById('profileName').textContent = data.name || 'N/A';
            document.getElementById('profileEmail').textContent = data.email || 'N/A';
            document.getElementById('profileRollNo').textContent = rollNo;
            document.getElementById('profileBranch').textContent = data.branch || 'N/A';
            document.getElementById('profileSemester').textContent = data.semester || 'N/A';
            populateSubjects(data.semester || '5');
        } else {
            throw new Error('Student data not found');
        }
    } catch (error) {
        console.error('Error fetching student data:', error);
        alert('Error fetching data: ' + error.message);
    }
}

const semesterSubjects = {
    '1': ['English', 'Applied Maths 1', 'Applied Physics 1', 'FIT'],
    '2': ['AIT', 'Applied Maths 2', 'Applied Physics 2', 'AE', 'EG', 'MMA', 'EVS'],
    '3': ['OS', 'PIC', 'DBMS', 'DE'],
    '4': ['English 2', 'COA', 'DS', 'OOPS', 'MOOCS'],
    '5': ['WT', 'Python', 'CN', 'Cloud', 'MOOCS'],
    '6': ['NS', 'SE', 'EDM']
};

function populateSubjects(semester) {
    const assignmentSubject = document.getElementById('assignmentSubject');
    const subjects = semesterSubjects[semester] || semesterSubjects['5'];
    assignmentSubject.innerHTML = '<option value="">Select Subject</option>';
    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        option.textContent = subject;
        assignmentSubject.appendChild(option);
    });
}

const assignmentUploadForm = document.getElementById('assignmentUploadForm');
assignmentUploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const rollNo = localStorage.getItem('studentRollNo');
    if (!rollNo) {
        uploadStatus.textContent = 'User not authenticated. Please log in.';
        uploadStatus.style.color = 'var(--error-color)';
        return;
    }

    const subject = document.getElementById('assignmentSubject').value;
    const assignNo = document.getElementById('assignmentNumber').value;
    const file = document.getElementById('assignmentFile').files[0];
    const uploadStatus = document.getElementById('uploadStatus');

    if (!subject || !assignNo || !file) {
        uploadStatus.textContent = 'Please fill all fields and select a PDF file.';
        uploadStatus.style.color = 'var(--error-color)';
        return;
    }

    if (file.type !== 'application/pdf') {
        uploadStatus.textContent = 'Only PDF files are allowed.';
        uploadStatus.style.color = 'var(--error-color)';
        return;
    }

    const fileName = `${subject}${assignNo}.pdf`;
    const assignmentPath = `assignments/${rollNo}/${fileName}`;

    try {
        await set(ref(database, assignmentPath), {
            subject,
            assignNo,
            rollNo,
            fileName: file.name,
            timestamp: new Date().toISOString()
        });

        uploadStatus.textContent = `Assignment uploaded successfully: ${fileName}`;
        uploadStatus.style.color = 'var(--success-color)';
        assignmentUploadForm.reset();
    } catch (error) {
        console.error('Upload error:', error);
        uploadStatus.textContent = 'Error uploading assignment: ' + error.message;
        uploadStatus.style.color = 'var(--error-color)';
    }
});
