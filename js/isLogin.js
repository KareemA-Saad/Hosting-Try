import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebase-config.js";

let auth = getAuth(app);

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
