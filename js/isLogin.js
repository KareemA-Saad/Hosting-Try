import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "firebase/auth";

export function IsLogin(page) {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                window.location.href = "./../loginForm.html";
                reject("User not logged in");
            } else {
                resolve(user);
            }
        });
    });
}
