import { auth } from './firebase-config.js';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    onAuthStateChanged,
    sendPasswordResetEmail
} from "firebase/auth";
import { userDataService } from './userDataService.js';

// UI Update
const updateUserUI = (user) => {
    const userIcon = document.getElementById('user-icon');
    const loginText = document.getElementById('login-text');
    if (userIcon && loginText) {
        userIcon.src = user.photoURL || 'default-user-icon.png';
        loginText.textContent = user.displayName ? user.displayName.split(' ')[0] : user.email;
    }
};

// Validation
const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);
const isStrongPassword = (password) => /[A-Z]/.test(password) && /[^A-Za-z0-9]/.test(password);

// Auth Handlers
const handleEmailAuth = async (email, password, displayName, isSignUp = false) => {
    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    if (!password) {
        alert("Password is required.");
        return;
    }
    if (isSignUp) {
        if (!displayName.trim()) {
            alert("Display name is required.");
            return;
        }
        if (password.length < 8) {
            alert("Password must be at least 8 characters.");
            return;
        }
        if (!isStrongPassword(password)) {
            alert("Password must contain at least one uppercase letter and one special character.");
            return;
        }
    }

    try {
        const userCredential = isSignUp
            ? await createUserWithEmailAndPassword(auth, email, password)
            : await signInWithEmailAndPassword(auth, email, password);

        if (isSignUp) {
            await updateProfile(userCredential.user, { displayName });
            await userDataService.saveUserData(userCredential.user.uid, {
                uid: userCredential.user.uid,
                email: email,
                displayName: displayName,
                role: "user",
                createdAt: new Date().toISOString()
            });
        }
        updateUserUI(userCredential.user);
        window.location.href = '../index.html';
    } catch (error) {
        alert(error.message);
    }
};

const handleGoogleAuth = async (isSignUp = false) => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const existingUserData = await userDataService.getUserData(result.user.uid);
        const role = existingUserData?.role || "user";

        if (isSignUp || !existingUserData) {
            await userDataService.saveUserData(result.user.uid, {
                uid: result.user.uid,
                email: result.user.email.toLowerCase(),
                displayName: result.user.displayName,
                role: role,
                createdAt: existingUserData?.createdAt || new Date().toISOString()
            });
        }
        updateUserUI(result.user);
        window.location.href = '../index.html';
    } catch (error) {
        alert(error.message);
    }
};

// Auth State Change
onAuthStateChanged(auth, (user) => {
    if (!user && window.location.pathname.includes('user.html')) {
        window.location.href = './auth/loginForm.html';
    }
});

// Form Initialization
export const initLoginForm = () => {
    const loginForm = document.getElementById('login-form');
    const googleSignInBtn = document.getElementById('google-signin');
    const forgotPasswordLink = document.querySelector('.forgot-link-k');
    const emailInput = document.getElementById('email');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = emailInput.value.trim().toLowerCase();
            const password = document.getElementById('password').value;
            await handleEmailAuth(email, password);
        });
    }

    if (googleSignInBtn) {
        googleSignInBtn.addEventListener('click', () => handleGoogleAuth(false));
    }

    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = emailInput.value.trim().toLowerCase();
            if (!email) {
                alert("Please enter your email address first.");
                return;
            }
            try {
                await sendPasswordResetEmail(auth, email);
                alert("Password reset email sent! Check your inbox.");
            } catch (error) {
                alert(error.message);
            }
        });
    }
};

export const initSignupForm = () => {
    const signupForm = document.getElementById('signup-form');
    const googleSignupBtn = document.getElementById('google-signup');

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim().toLowerCase();
            const password = document.getElementById('password').value;
            const displayName = document.getElementById('display-name').value;
            await handleEmailAuth(email, password, displayName, true);
        });
    }

    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', () => handleGoogleAuth(true));
    }
};