import { get, ref } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const db = window.db;

    async function getSemester() {
        const profileRef = ref(db, 'studentProfile');
        const snapshot = await get(profileRef);
        const profileData = snapshot.val() || { semester: '5' };
        return profileData.semester;
    }

    const semesterSubjects = {
        '1': ['English', 'Applied Maths 1', 'Applied Physics 1', 'FIT'],
        '2': ['AIT', 'Applied Maths 2', 'Applied Physics 2', 'AE', 'EG', 'MMA', 'EVS'],
        '3': ['OS', 'PIC', 'DBMS', 'DE'],
        '4': ['English 2', 'COA', 'DS', 'OOPS', 'MOOCS'],
        '5': ['WT', 'Python', 'CN', 'Cloud', 'MOOCS'],
        '6': ['NS', 'SE', 'EDM']
    };

    const marksData = {
        '1': {
            sessional1: { 'English': 75, 'Applied Maths 1': 80, 'Applied Physics 1': 78, 'FIT': 82 },
            sessional2: { 'English': 78, 'Applied Maths 1': 85, 'Applied Physics 1': 80, 'FIT': 84 },
            sessional3: { 'English': 80, 'Applied Maths 1': 82, 'Applied Physics 1': 79, 'FIT': 85 }
        },
        '2': {
            sessional1: { 'AIT': 70, 'Applied Maths 2': 76, 'Applied Physics 2': 74, 'AE': 72, 'EG': 78, 'MMA': 75, 'EVS': 80 },
            sessional2: { 'AIT': 72, 'Applied Maths 2': 78, 'Applied Physics 2': 76, 'AE': 74, 'EG': 80, 'MMA': 77, 'EVS': 82 },
            sessional3: { 'AIT': 74, 'Applied Maths 2': 80, 'Applied Physics 2': 78, 'AE': 76, 'EG': 82, 'MMA': 79, 'EVS': 84 }
        },
        '3': {
            sessional1: { 'OS': 85, 'PIC': 82, 'DBMS': 88, 'DE': 80 },
            sessional2: { 'OS': 87, 'PIC': 84, 'DBMS': 90, 'DE': 82 },
            sessional3: { 'OS': 89, 'PIC': 86, 'DBMS': 92, 'DE': 84 }
        },
        '4': {
            sessional1: { 'English 2': 78, 'COA': 83, 'DS': 85, 'OOPS': 80, 'MOOCS': 82 },
            sessional2: { 'English 2': 80, 'COA': 85, 'DS': 87, 'OOPS': 82, 'MOOCS': 84 },
            sessional3: { 'English 2': 82, 'COA': 87, 'DS': 89, 'OOPS': 84, 'MOOCS': 86 }
        },
        '5': {
            sessional1: { 'WT': 88, 'Python': 85, 'CN': 90, 'Cloud': 87, 'MOOCS': 83 },
            sessional2: { 'WT': 90, 'Python': 87, 'CN': 92, 'Cloud': 89, 'MOOCS': 85 },
            sessional3: { 'WT': 92, 'Python': 89, 'CN': 94, 'Cloud': 91, 'MOOCS': 87 }
        },
        '6': {
            sessional1: { 'NS': 86, 'SE': 84, 'EDM': 88 },
            sessional2: { 'NS': 88, 'SE': 86, 'EDM': 90 },
            sessional3: { 'NS': 90, 'SE': 88, 'EDM': 92 }
        }
    };

    function populateMarks(semester) {
        const subjects = semesterSubjects[semester] || semesterSubjects['5'];
        const sessional1Marks = document.getElementById('sessional1Marks');
        const sessional2Marks = document.getElementById('sessional2Marks');
        const sessional3Marks = document.getElementById('sessional3Marks');

        const semesterMarks = marksData[semester] || marksData['5'];

        sessional1Marks.innerHTML = '';
        subjects.forEach(subject => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${subject}</td><td>${semesterMarks.sessional1[subject] || 'N/A'}</td>`;
            sessional1Marks.appendChild(tr);
        });

        sessional2Marks.innerHTML = '';
        subjects.forEach(subject => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${subject}</td><td>${semesterMarks.sessional2[subject] || 'N/A'}</td>`;
            sessional2Marks.appendChild(tr);
        });

        sessional3Marks.innerHTML = '';
        subjects.forEach(subject => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${subject}</td><td>${semesterMarks.sessional3[subject] || 'N/A'}</td>`;
            sessional3Marks.appendChild(tr);
        });
    }

    getSemester().then(semester => populateMarks(semester));
});