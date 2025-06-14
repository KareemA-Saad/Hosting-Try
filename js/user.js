const auth = window.auth;
const onAuthStateChanged = firebase.auth().onAuthStateChanged.bind(firebase.auth());
const updateEmail = firebase.auth().updateEmail.bind(firebase.auth());
const updatePassword = firebase.auth().updatePassword.bind(firebase.auth());
const EmailAuthProvider = firebase.auth.EmailAuthProvider;
const reauthenticateWithCredential = firebase.auth().reauthenticateWithCredential.bind(firebase.auth());
const sendEmailVerification = firebase.auth().sendEmailVerification.bind(firebase.auth());
import { userDataService } from './userDataService.js';


const userUpdateForm = document.getElementById('user-update-form');
const userEmailInput = document.getElementById('user-email');
const userPasswordInput = document.getElementById('user-password');
const userCurrentPasswordInput = document.getElementById('user-current-password');
const userMessage = document.getElementById('user-message');
const userProfilePic = document.getElementById('user-icon');
const userDisplayName = document.getElementById('user-display-name');

let currentUser = null;

onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        console.log('Current User:', {
            uid: user.uid,
            email: user.email
        });

        const userData = await userDataService.getUserData(user.uid);
        console.log('User Data from Firestore:', userData);

        // Fetch user data
        if (userData) {
            userProfilePic.src = user.photoURL ? user.photoURL : 'img/default-user-icon.png';
            userDisplayName.textContent = userData.displayName || user.email;
            userEmailInput.value = user.email.toLowerCase();
        }
    } else {
        window.location.href = "auth/loginForm.html";
    }
});

userUpdateForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const newEmail = userEmailInput.value.trim().toLowerCase();
    const newPassword = userPasswordInput.value;
    const currentPassword = userCurrentPasswordInput.value;
    try {
        // If email is being changed, require re-authentication
        if (newEmail && newEmail !== currentUser.email) {
            if (!currentPassword) {
                userMessage.textContent = "Please enter your current password to change your email.";
                return;
            }
            const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
            await reauthenticateWithCredential(currentUser, credential);
            await updateEmail(currentUser, newEmail);
            await userDataService.updateUserField(currentUser.uid, 'email', newEmail);
            await sendEmailVerification(currentUser);
            userMessage.textContent = "Email updated! Please check your new email and verify it before logging in again.";
            userPasswordInput.value = '';
            userCurrentPasswordInput.value = '';
            return;
        }
        if (newPassword) {
            await updatePassword(currentUser, newPassword);
        }
        userMessage.textContent = "Update successful!";
        userPasswordInput.value = '';
        userCurrentPasswordInput.value = '';
    } catch (error) {
        console.error('Error updating email or password:', error.code, error.message);
        userMessage.textContent = error.message;
    }
});


