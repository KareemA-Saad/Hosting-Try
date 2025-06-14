import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { userDataService, getCurrentUserUid } from './userDataService.js';

const logoutBtn = document.getElementById('logout-btn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            // Get current user's cart from Firestore before signing out
            const currentUser = auth.currentUser;
            if (currentUser) {
                // Clear only the local storage cart
                localStorage.removeItem('cart');

                // Update UI elements
                const cartCount = document.getElementById('cart-count');
                if (cartCount) {
                    cartCount.textContent = '0';
                }

                const cartContainer = document.querySelector('.cart-item-container');
                if (cartContainer) {
                    cartContainer.innerHTML = '<p style="color:#fff">Your cart is empty.</p>';
                }
            }

            // Sign out
            await signOut(auth);
            window.location.reload();
        } catch (error) {
            console.error('Error during logout:', error);
            alert('Error during logout. Please try again.');
        }
    });
}

onAuthStateChanged(auth, (user) => {
    //console.log('Auth state changed:', user); // Debug: log user object

    const userIconDefault = document.getElementById('user-icon-default');
    const userIconImg = document.getElementById('user-icon-img');
    const loginText = document.getElementById('login-text');
    const userLink = document.getElementById('user-link');

    if (user) {
        userDataService.setCurrentUser(user);
        console.log('Current UID:', getCurrentUserUid());
        // Fetch user data and redirect admin to dashboard
        userDataService.getUserData(user.uid).then(userData => {
            if (userData && userData.role === 'admin') {
                if (!window.location.pathname.endsWith('dashboard.html')) {
                    window.location.href = 'dashboard.html';
                }
            }
        });
        // Toggle user icon
        if (user.photoURL) {
            userIconImg.src = user.photoURL;
            userIconImg.style.display = 'inline-block';
            userIconDefault.style.display = 'none';
        } else {
            userIconImg.style.display = 'none';
            userIconDefault.style.display = 'inline-block';
        }
        // Show user name and signout
        loginText.textContent = (user.displayName || user.email || "Log in").split(' ')[0];
        userLink.href = "user.html";
        if (logoutBtn) logoutBtn.style.display = 'inline';
    } else {
        console.log('User is signed out');
        // Show login and default icon
        userIconImg.style.display = 'none';
        userIconDefault.style.display = 'inline-block';
        loginText.textContent = "Log in";
        userLink.href = "auth/loginForm.html";
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
});



