import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebase-config.js";

const db = getFirestore(app);
const auth = getAuth(app);
const tbody = document.getElementById("ordersTableBody");
import { IsLogin } from './isLogin.js';
document.addEventListener("DOMContentLoaded", () => {
    IsLogin()
        .then(async (user) => {
            const userId = user.uid;
            console.log("Logged in:", userId);

            const q = query(
                collection(db, "orders"),
                where("userId", "==", userId)
            );

            const snapshot = await getDocs(q);

            snapshot.forEach(doc => {
                const order = doc.data();
                const orderId = doc.id;

                const tr = document.createElement("tr");
                tr.innerHTML = `
                <td data-label="Order no.">${order.transactionId || orderId}</td>
                <td data-label="Order date">${formatDate(order.createdAt)}</td>
                <td data-label="Bill-to name">${order.status}</td>
                <td data-label="Total">$${parseFloat(order.paidAmount).toFixed(2)}</td>
                <td data-label="Track & trace">
                <a href="orderDetails.html?orderId=${orderId}">View details</a>
                </td>
                `;

                tbody.appendChild(tr);
            });
        })
        .catch((err) => {
            console.error("❌", err);
        });
});

// دالة تنسيق التاريخ
function formatDate(timestamp) {
    if (!timestamp || typeof timestamp.toDate !== "function") return "N/A";
    return timestamp.toDate().toLocaleDateString();
}
