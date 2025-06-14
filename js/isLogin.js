const auth = window.auth;
const onAuthStateChanged = firebase.auth().onAuthStateChanged.bind(firebase.auth());

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
