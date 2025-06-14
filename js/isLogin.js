import { auth } from "./firebase-config.js";

const onAuthStateChanged = auth.onAuthStateChanged.bind(auth);

export function IsLogin(page) {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                window.location.href = "./../auth/loginForm.html";
                reject("User not logged in");
            } else {
                resolve(user);
            }
        });
    });
}
