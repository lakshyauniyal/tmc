import { get, ref, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const db = window.db; // Access global db

    // Load student profile data from Firebase
    const profileName = document.getElementById('profileName');
    const profileRollNo = document.getElementById('profileRollNo');
    const profileBranch = document.getElementById('profileBranch');
    const profileEmail = document.getElementById('profileEmail');
    const profileSemester = document.getElementById('profileSemester');

    async function loadProfileData() {
        const profileRef = ref(db, 'studentProfile');
        const snapshot = await get(profileRef);
        const profileData = snapshot.val() || {
            name: 'John Doe',
            rollNo: 'ST12345',
            branch: 'Computer Science',
            email: 'student@example.com',
            semester: '5'
        };

        profileName.textContent = profileData.name;
        profileRollNo.textContent = profileData.rollNo;
        profileBranch.textContent = profileData.branch;
        profileEmail.textContent = profileData.email;
        profileSemester.textContent = profileData.semester;

        return profileData.semester;
    }

    // Subject mapping by semester
    const semesterSubjects = {
        '1': ['English', 'Applied Maths 1', 'Applied Physics 1', 'FIT'],
        '2': ['AIT', 'Applied Maths 2', 'Applied Physics 2', 'AE', 'EG', 'MMA', 'EVS'],
        '3': ['OS', 'PIC', 'DBMS', 'DE'],
        '4': ['English 2', 'COA', 'DS', 'OOPS', 'MOOCS'],
        '5': ['WT', 'Python', 'CN', 'Cloud', 'MOOCS'],
        '6': ['NS', 'SE', 'EDM']
    };

    // Populate subjects based on semester
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

    // Load profile data and populate subjects
    loadProfileData().then(semester => populateSubjects(semester));

    // Assignment upload logic
    const assignmentUploadForm = document.getElementById('assignmentUploadForm');
    const assignmentSubject = document.getElementById('assignmentSubject');
    const assignmentNumber = document.getElementById('assignmentNumber');
    const assignmentFile = document.getElementById('assignmentFile');
    const uploadStatus = document.getElementById('uploadStatus');

    assignmentUploadForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const subject = assignmentSubject.value;
        const assignNo = assignmentNumber.value;
        const file = assignmentFile.files[0];

        if (!subject || !assignNo || !file) {
            uploadStatus.textContent = 'Please fill all fields and select a PDF file.';
            uploadStatus.style.color = 'var(--notification-error-bg)';
            return;
        }

        if (file.type !== 'application/pdf') {
            uploadStatus.textContent = 'Only PDF files are allowed.';
            uploadStatus.style.color = 'var(--notification-error-bg)';
            return;
        }

        const profileRef = ref(db, 'studentProfile');
        const snapshot = await get(profileRef);
        const profileData = snapshot.val() || {};
        const rollNo = profileData.rollNo || 'ST12345';

        const fileName = `${subject}${assignNo}.pdf`;
        const assignmentPath = `assignments/${rollNo}/${fileName}`;

        await set(ref(db, assignmentPath), {
            subject,
            assignNo,
            rollNo,
            fileName: file.name,
            timestamp: new Date().toISOString()
        });

        uploadStatus.textContent = `Assignment uploaded successfully: ${fileName}`;
        uploadStatus.style.color = 'var(--notification-success-bg)';
        assignmentUploadForm.reset();
    });
});