import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db, app } from "./firebase-config.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";

let auth = getAuth(app);

function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartCount = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
  let cartCountElement = document.querySelector("#cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }
}

let isRendering = false;

async function displayCartItems() {
  if (isRendering) return;
  isRendering = true;

  let cartContainer = document.querySelector(".cart-item-container");
  if (!cartContainer) return;

  cartContainer.innerHTML = "";


  let user = auth.currentUser;
  let userId = user ? user.uid : null;

  let cartItems = [];

  if (userId) {

    let cartsRef = collection(db, "carts");
    let q = query(cartsRef, where("userId", "==", userId));
    let cartSnapshot = await getDocs(q);

    let cartTotal = 0;
    cartSnapshot.forEach((docSnap) => {
      let item = docSnap.data();
      item._id = docSnap.id;
      cartItems.push(item);
    });


    localStorage.setItem("cart", JSON.stringify(cartItems));

  } else {

    cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  }


  if (cartItems.length === 0) {
    cartContainer.innerHTML = "<p style='color:#fff'>Your cart is empty.</p>";
    updateCartCount();
    isRendering = false;
    return;
  }


  cartItems.forEach((item) => {
    let itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="cart-item-img" />
      <div class="cart-item-info">
        <p class="cart-item-title">${item.title || item.name}</p>
        <p class="cart-item-quantity">Quantity: ${item.quantity}</p>
        <p class="cart-item-price">${item.price}$</p>
        <p class="cart-item-color"><span style="display: block;width: 20px;
          height: 20px;
          background-color: ${item.colorHEX};
          border-radius: 50%; border:1px solid #fff ;
          margin-bottom:10px;"></span></p>
      </div>
      <button class="delete-btn"
        data-docid="${item._id || ''}"
        data-id="${item.id}"
        data-color="${item.color}"
        title="Delete item"
        style="background:none; border:none; cursor:pointer; font-size:22px; color:#e74c3c;">
        <i class="fas fa-trash-alt"></i>
      </button>
    `;
    cartContainer.appendChild(itemDiv);
  });


  let checkoutBtn = document.createElement("button");
  checkoutBtn.className = "checkout-btn checkout-z";
  checkoutBtn.textContent = "Checkout";
  checkoutBtn.addEventListener("click", () => {
    window.location.href = "../cart.html";
  });
  cartContainer.appendChild(checkoutBtn);
  cartContainer.classList.add("render-side-z");


  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async function () {
      let docId = this.dataset.docid;
      let itemId = this.dataset.id;
      let itemColor = this.dataset.color;

      await removeItemFromFirestoreAndLocal(docId, itemId, itemColor, userId);
      displayCartItems();
    });
  });

  updateCartCount();
  isRendering = false;
}


async function removeItemFromFirestoreAndLocal(docId, itemId, itemColor, userId) {
  try {
    if (userId && docId) {

      await deleteDoc(doc(db, "carts", docId));
    }


    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let updatedCart = cart.filter(item => !(item.id === itemId && item.color === itemColor));
    localStorage.setItem("cart", JSON.stringify(updatedCart));

  } catch (error) {
    alert("Error removing item from cart. Please try again.");
  }
}

document.addEventListener("DOMContentLoaded", () => {

  onAuthStateChanged(auth, () => {
    displayCartItems();
  });

  displayCartItems();
});

export { displayCartItems, updateCartCount, removeItemFromFirestoreAndLocal };
