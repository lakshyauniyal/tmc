import { get, ref, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

document.addEventListener('DOMContentLoaded', () => {
    const db = window.db;

    const profileName = document.getElementById('profileName');
    const profileRollNo = document.getElementById('profileRollNo');
    const profileFatherName = document.getElementById('profileFatherName');
    const profileBranch = document.getElementById('profileBranch');
    const profileSemester = document.getElementById('profileSemester');
    const profileMobile = document.getElementById('profileMobile');
    const profileEmail = document.getElementById('profileEmail');

    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const editProfileForm = document.getElementById('editProfileForm');
    const editName = document.getElementById('editName');
    const editRollNo = document.getElementById('editRollNo');
    const editFatherName = document.getElementById('editFatherName');
    const editBranch = document.getElementById('editBranch');
    const editSemester = document.getElementById('editSemester');
    const editMobile = document.getElementById('editMobile');
    const editEmail = document.getElementById('editEmail');

    async function loadProfileData() {
        const profileRef = ref(db, 'studentProfile');
        const snapshot = await get(profileRef);
        const profileData = snapshot.val() || {
            name: 'John Doe',
            rollNo: 'ST12345',
            fatherName: 'Mr. Doe',
            branch: 'Computer Science',
            semester: '5',
            mobile: '1234567890',
            email: 'student@example.com'
        };

        profileName.textContent = profileData.name;
        profileRollNo.textContent = profileData.rollNo;
        profileFatherName.textContent = profileData.fatherName;
        profileBranch.textContent = profileData.branch;
        profileSemester.textContent = profileData.semester;
        profileMobile.textContent = profileData.mobile;
        profileEmail.textContent = profileData.email;

        editName.value = profileData.name;
        editRollNo.value = profileData.rollNo;
        editFatherName.value = profileData.fatherName;
        editBranch.value = profileData.branch;
        editSemester.value = profileData.semester;
        editMobile.value = profileData.mobile;
        editEmail.value = profileData.email;
    }

    loadProfileData();

    editProfileBtn.addEventListener('click', () => {
        editProfileModal.style.display = 'flex';
    });

    closeModalBtn.addEventListener('click', () => {
        editProfileModal.style.display = 'none';
    });

    cancelEditBtn.addEventListener('click', () => {
        editProfileModal.style.display = 'none';
    });

    editProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const updatedProfile = {
            name: editName.value,
            rollNo: editRollNo.value,
            fatherName: editFatherName.value,
            branch: editBranch.value,
            semester: editSemester.value,
            mobile: editMobile.value,
            email: editEmail.value
        };

        await set(ref(db, 'studentProfile'), updatedProfile);

        profileName.textContent = updatedProfile.name;
        profileRollNo.textContent = updatedProfile.rollNo;
        profileFatherName.textContent = updatedProfile.fatherName;
        profileBranch.textContent = updatedProfile.branch;
        profileSemester.textContent = updatedProfile.semester;
        profileMobile.textContent = updatedProfile.mobile;
        profileEmail.textContent = updatedProfile.email;

        editProfileModal.style.display = 'none';
    });
});