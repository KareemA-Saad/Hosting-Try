

import { doc, getDoc, addDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db, app } from "./firebase-config.js";
import { updateCartCount, displayCartItems } from "./cart-item.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";

let auth = getAuth(app);

async function mergeCartWithFirestore(userId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  for (let cartItem of cart) {

    cartItem.userId = userId;

    let q = query(
      collection(db, "carts"),
      where("userId", "==", userId),
      where("id", "==", cartItem.id),
      where("color", "==", cartItem.color)
    );

    let snapshot = await getDocs(q);

    if (!snapshot.empty) {
      let docRef = snapshot.docs[0].ref;
      let existing = snapshot.docs[0].data();
      let newQuantity = existing.quantity + cartItem.quantity;
      await updateDoc(docRef, { quantity: newQuantity });
    } else {
      await addDoc(collection(db, "carts"), cartItem);
    }
  }


  localStorage.setItem("userId", userId);
  updateCartCount();

}


onAuthStateChanged(auth, async (user) => {
  if (user) {
    let userId = user.uid;
    let savedUserId = localStorage.getItem("userId");

    if (userId !== savedUserId) {
      await mergeCartWithFirestore(userId);
    }
  }
});

export async function getProductDetails(id, db) {
  try {
    if (!id) {
      let container = document.getElementById("product-details-container");
      if (container)
        container.innerHTML = `<p>No product ID provided in URL.</p>`;
      return;
    }

    let docRef = doc(db, "productsData", id);
    let docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      displayProductDetails({ id: docSnap.id, ...docSnap.data() });
    } else {
      let container = document.getElementById("product-details-container");
      if (container) container.innerHTML = `<p>Product not found</p>`;
      alert("This Product is not Available");
    }
  } catch (error) {
    let container = document.getElementById("product-details-container");
    if (container)
      container.innerHTML = `<p>Error loading product details.</p>`;
    console.error(error);
  }
  updateCartCount();

}

function displayProductDetails(product) {
  let priceBeforeDiscount = parseFloat(product.price);
  let discount = parseFloat(product.discountPercentage);
  let priceAfterDiscount = (priceBeforeDiscount * (1 - discount / 100)).toFixed(2);
  let container = document.getElementById("product-details-container");
  if (!container) return;

  container.innerHTML = `
    <div class="breadcrumbs"></div>

    <section class="product-section">
      <div class="product-images">
        <img src="${product.image}" alt="${product.title}" />
      </div>
      <div class="product-info">
        <h1>${product.title}</h1>
        <div class="product-price">
          <span class="old-price">$${priceBeforeDiscount}</span>
          <span class="sale-price">$${priceAfterDiscount}</span>
        </div>
        <form id="add-to-cart-form">
          <span style="display: block;width: 30px;
          height: 30px;
          background-color: ${product.colorHEX};
          border-radius: 50%; border:1px solid #fff ;
          margin-bottom:10px;"></span>          
          <input type="hidden" name="color" value="${product.colorHEX}" />
          <label for="quantity">Quantity:</label>
          <input type="number" id="quantity" name="quantity" value="1" min="1" max=${product.quantity} required />
          <div class="product-buttons">
            <button type="submit" class="add-cart-btn">Add to Cart</button>
            <button type="button" id="buy" class="buy-now-btn">Buy Now</button>
          </div>
        </form>

        <div class="product-details">
          <h2>Product Info</h2>
          <p>${product.description}</p>
        </div>
        <div class="product-details">
          <h2>Return and Refund Policy</h2>
          <p>${product.returnPolicy}</p>
        </div>
      </div>
    </section>
  `;

  let form = document.getElementById("add-to-cart-form");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    await handleAddToCart(product);
    let container = document.querySelector(".cart-item-container");
    if (container) {
      container.classList.add("active");
      displayCartItems();
    }
  });

  let buy = document.getElementById("buy");
  buy.addEventListener("click", async function (e) {
    e.preventDefault();
    await handleAddToCart(product);
    window.location.href = "cart.html";
  });
  updateCartCount();

}

async function handleAddToCart(product) {
  let form = document.getElementById("add-to-cart-form");
  let color = form.color.value;
  let quantity = parseInt(form.quantity.value);

  let userId = localStorage.getItem("userId");

  let cartItem = {
    id: product.id,
    title: product.title,
    price: product.price,
    color,
    quantity,
    image: product.image,
    description: product.description,
    code: product.code,
    discountPercentage: product.discountPercentage
  };

  if (userId) {
    cartItem.userId = userId;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let existingIndex = cart.findIndex(
    (item) => item.id === cartItem.id && item.color === cartItem.color
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push(cartItem);
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  try {
    await addOrUpdateCartItem(cartItem);
  } catch (error) {
    console.error("Error saving to Firestore:", error);
  }

  updateCartCount();
}

async function addOrUpdateCartItem(cartItem) {
  if (!cartItem.userId) return;

  let cartsRef = collection(db, "carts");
  let q = query(
    cartsRef,
    where("userId", "==", cartItem.userId),
    where("id", "==", cartItem.id),
    where("color", "==", cartItem.color)
  );
  let querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    let docRef = querySnapshot.docs[0].ref;
    let existingData = querySnapshot.docs[0].data();
    let newQuantity = existingData.quantity + cartItem.quantity;
    await updateDoc(docRef, { quantity: newQuantity });
  } else {
    await addDoc(cartsRef, cartItem);
  }
  updateCartCount();

}

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.toLowerCase().endsWith("productdetails.html")) {
    let urlParams = new URLSearchParams(window.location.search);
    let productId = urlParams.get("id");
    if (productId) {
      getProductDetails(productId, db).catch(console.error);
    }
  }

  updateCartCount();
  displayCartItems();
});
