import { auth, db } from './firebase-config.js';
import { get, ref, set } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
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
    const logoutBtn = document.querySelector('.logout-btn');

    // Check authentication state and load profile
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        const rollNo = localStorage.getItem('studentRollNo');
        if (!rollNo) {
            alert('Please login first');
            window.location.href = 'login.html';
            return;
        }

        // Load profile data from localStorage first, fallback to Firebase if not available
        const studentData = JSON.parse(localStorage.getItem('studentData'));
        if (studentData) {
            displayProfileData(studentData, rollNo);
            populateEditForm(studentData, rollNo);
        } else {
            loadProfileDataFromFirebase(rollNo);
        }

        // Event Listeners
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
                name: editName.value.trim(),
                rollNo: editRollNo.value.trim(),
                fatherName: editFatherName.value.trim(),
                branch: editBranch.value,
                semester: editSemester.value,
                mobile: editMobile.value.trim(),
                email: editEmail.value.trim(),
                updatedAt: Date.now()
            };

            try {
                await set(ref(db, `students/${rollNo}`), updatedProfile);
                
                // Update localStorage with new data
                localStorage.setItem('studentData', JSON.stringify(updatedProfile));

                // Update display
                displayProfileData(updatedProfile, rollNo);

                editProfileModal.style.display = 'none';
                alert('Profile updated successfully');
            } catch (error) {
                console.error('Error updating profile:', error);
                alert('Error updating profile');
            }
        });

        // Logout functionality
        logoutBtn.addEventListener('click', () => {
            signOut(auth)
                .then(() => {
                    localStorage.removeItem('studentRollNo');
                    localStorage.removeItem('studentData'); // Clear student data on logout
                    window.location.href = 'login.html';
                })
                .catch((error) => {
                    console.error('Logout error:', error);
                    alert('Error logging out');
                });
        });
    });

    // Function to display profile data
    function displayProfileData(profileData, rollNo) {
        profileName.textContent = profileData.name || 'N/A';
        profileRollNo.textContent = profileData.rollNo || rollNo;
        profileFatherName.textContent = profileData.fatherName || 'N/A';
        profileBranch.textContent = profileData.branch || 'N/A';
        profileSemester.textContent = profileData.semester || 'N/A';
        profileMobile.textContent = profileData.mobile || 'N/A';
        profileEmail.textContent = profileData.email || 'N/A';
    }

    // Function to populate edit form
    function populateEditForm(profileData, rollNo) {
        editName.value = profileData.name || '';
        editRollNo.value = profileData.rollNo || rollNo;
        editFatherName.value = profileData.fatherName || '';
        editBranch.value = profileData.branch || '';
        editSemester.value = profileData.semester || '';
        editMobile.value = profileData.mobile || '';
        editEmail.value = profileData.email || '';
    }

    // Function to load profile data from Firebase (fallback)
    async function loadProfileDataFromFirebase(rollNo) {
        try {
            const profileRef = ref(db, `students/${rollNo}`);
            const snapshot = await get(profileRef);
            
            if (!snapshot.exists()) {
                alert('Profile not found');
                window.location.href = 'login.html';
                return;
            }

            const profileData = snapshot.val();
            localStorage.setItem('studentData', JSON.stringify(profileData)); // Store in localStorage

            displayProfileData(profileData, rollNo);
            populateEditForm(profileData, rollNo);
        } catch (error) {
            console.error('Error loading profile from Firebase:', error);
            alert('Error loading profile data');
        }
    }
});
