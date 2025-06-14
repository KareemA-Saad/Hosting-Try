import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {getFirestore,collection,getDocs,addDoc,deleteDoc,doc,updateDoc} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { userDataService } from './userDataService.js';

let firebaseConfig = {
  apiKey: "AIzaSyDOL8EAF_5kYHAom1fZ_7UiAxWcWIJ5Aok",
  authDomain: "pack-go-5d568.firebaseapp.com",
  projectId: "pack-go-5d568",
  storageBucket: "pack-go-5d568.firebasestorage.app",
  messagingSenderId: "525870091383",
  appId: "1:525870091383:web:06655ed6e02bcf40e28a72",
  measurementId: "G-R9DE3EBPD2"
};

let app = initializeApp(firebaseConfig);
let db = getFirestore(app);
let productsRef = collection(db, "productsData");

let form = document.querySelector("#productForm");
let productList = document.querySelector("#productList");
let toggleFormBtn = document.getElementById("toggleFormBtn");

let editId = null;

let signoutBtn = document.createElement('button');
signoutBtn.id = 'dashboard-signout-btn';
signoutBtn.textContent = 'Sign Out';
signoutBtn.style.position = 'fixed';
signoutBtn.style.top = '20px';
signoutBtn.style.right = '20px';
signoutBtn.style.zIndex = '1000';
document.body.appendChild(signoutBtn);

signoutBtn.addEventListener('click', async () => {
  await signOut(auth);
  window.location.href = 'auth/loginForm.html';
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "auth/loginForm.html";
    return;
  }
  let userData = await userDataService.getUserData(user.uid);
  if (!userData || userData.role !== 'admin') {
    window.location.href = "index.html";
  }
});

toggleFormBtn.addEventListener("click", () => {
  form.classList.toggle("hidden");
  editId = null;
  form.reset();
});

async function loadProducts() {
  productList.innerHTML = "";
  let snapshot = await getDocs(productsRef);
  snapshot.forEach((docSnap) => {
    let data = docSnap.data();
    let row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${data.image || ''}" alt="Product" /></td>
      <td>${data.title}</td>
      <td>${data.category}</td>
      <td>$${data.price} <br> ${data.discountPercentage}% off</td>
      <td>${data.quantity}</td>
      <td><span style="background:${data.colorHEX};padding:2px 8px;border-radius:4px;">${data.color}</span></td>
      <td>
        <button class="action-btn edit-btn" onclick="editProduct('${docSnap.id}', ${JSON.stringify(data).replace(/"/g, '&quot;')})">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteProduct('${docSnap.id}')">Delete</button>
      </td>
    `;
    productList.appendChild(row);
  });
}

window.deleteProduct = async (id) => {
  await deleteDoc(doc(db, "productsData", id));
  loadProducts();
};

window.editProduct = (id, data) => {
  form.classList.remove("hidden");
  toggleFormBtn.scrollIntoView({ behavior: "smooth" });

  form.code.value = data.code;
  form.title.value = data.title;
  form.description.value = data.description;
  form.category.value = data.category;
  form.price.value = data.price;
  form.discountPercentage.value = data.discountPercentage;
  form.quantity.value = data.quantity;
  form.returnPolicy.value = data.returnPolicy;
  form.color.value = data.color;
  form.colorHEX.value = data.colorHEX;
  form.image.value = data.image;
  form.info.value = data.info;
  editId = id;
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let data = {
    code: Number(form.code.value),
    title: form.title.value,
    description: form.description.value,
    category: form.category.value,
    price: Number(form.price.value),
    discountPercentage: Number(form.discountPercentage.value),
    quantity: Number(form.quantity.value),
    returnPolicy: form.returnPolicy.value,
    color: form.color.value,
    colorHEX: form.colorHEX.value,
    image: form.image.value,
    info: form.info.value
  };
  if (editId) {
    await updateDoc(doc(db, "productsData", editId), data);
    editId = null;
  } else {
    await addDoc(productsRef, data);
  }
  form.reset();
  form.classList.add("hidden");
  loadProducts();
});

loadProducts();
