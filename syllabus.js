import { get, ref } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const db = window.db;
    const semesterSelect = document.getElementById('semesterSelect');
    const syllabusLink = document.getElementById('syllabusLink');

    const syllabusLinks = {
        '1': 'syllabus/sem1.pdf',
        '2': 'syllabus/sem2.pdf',
        '3': 'syllabus/sem3.pdf',
        '4': 'syllabus/sem4.pdf',
        '5': 'syllabus/sem5.pdf',
        '6': 'syllabus/sem6.pdf'
    };

    async function getSemester() {
        const profileRef = ref(db, 'studentProfile');
        const snapshot = await get(profileRef);
        const profileData = snapshot.val() || { semester: '5' };
        return profileData.semester;
    }

    function updateSyllabusLink(semester) {
        if (semester && syllabusLinks[semester]) {
            syllabusLink.href = syllabusLinks[semester];
            syllabusLink.style.display = 'inline-block';
        } else {
            syllabusLink.style.display = 'none';
        }
    }

    getSemester().then(studentSemester => {
        semesterSelect.value = studentSemester;
        updateSyllabusLink(studentSemester);
    });

    semesterSelect.addEventListener('change', (e) => {
        const semester = e.target.value;
        updateSyllabusLink(semester);
    });
});