import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase-config.js";

// Get category from URL
let params = new URLSearchParams(window.location.search);
let category = params.get("category");

let categoryTitle = document.getElementById("category-title");
if (categoryTitle && category) {
  categoryTitle.innerText = `منتجات: ${category}`;
}

export async function displayProductByCategory(db) {
  if (!category) return;

  try {
    let productsRef = collection(db, 'productsData');
    let q = query(productsRef, where("category", "==", category));
    let querySnapshot = await getDocs(q);

    let container = document.getElementById("products-container");
    if (!container) return;

    container.innerHTML = ""; 

    if (querySnapshot.empty) {
      container.innerText = "لا توجد منتجات في هذه الفئة.";
      return;
    }

    querySnapshot.forEach(docSnap => {
      let product = docSnap.data();
      let productId = docSnap.id;

      let catTitle = document.getElementById('cat-title');
      if (catTitle) catTitle.innerText = product.category;

      let productCard = document.createElement("div");
      productCard.classList.add("product-card");

      let img = document.createElement("img");
      img.src = product.image;
      img.alt = product.title;

      let title = document.createElement("h3");
      title.innerText = product.title;

      let price = document.createElement("p");
      price.innerText = product.price + "$";

      let button = document.createElement("button");
      button.classList.add("button-z");
      button.innerText = "View Details";

      button.addEventListener("click", (e) => {
        e.stopPropagation();
        window.location.href = `productDetails.html?id=${productId}`;
      });

      productCard.addEventListener("click", () => {
        window.location.href = `productDetails.html?id=${productId}`;
      });

      productCard.appendChild(img);
      productCard.appendChild(title);
      productCard.appendChild(price);
      productCard.appendChild(button);

      container.appendChild(productCard);
    });

  } catch (error) {
    console.error("خطأ أثناء جلب المنتجات:", error);
  }
}

function renderCartItems() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let container = document.querySelector(".cart-item-container");
  container.innerHTML = "";

  cart.forEach((item, index) => {
    let itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="cart-item-img" />
      <div class="cart-item-info">
        <p class="cart-item-title">${item.title}</p>
        <p class="cart-item-color">Color: ${item.color}</p>
        <p class="cart-item-quantity">Quantity: ${item.quantity}</p>
        <p class="cart-item-price">${item.price} EGP</p>
      </div>
      <button style="margin-left:30px;" class="cart-item-delete" data-index="${index}">🗑️</button>
    `;
    container.appendChild(itemDiv);
  });


  if (cart.length > 0) {
    let checkoutBtn = document.createElement("button");
    checkoutBtn.className = "checkout-btn checkout-z";
    checkoutBtn.textContent = "Checkout 🛒";
    checkoutBtn.addEventListener("click", () => {
      window.location.href = "../cart.html";
    });

    container.appendChild(checkoutBtn);
    container.classList.add('render-side-z')
  }


  document.querySelectorAll(".cart-item-delete").forEach((btn) => {
    btn.addEventListener("click", function () {
      let index = parseInt(this.dataset.index);
      cart.splice(index, 1);
      localStorage.setItem("cart", JSON.stringify(cart));
      renderCartItems();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  displayProductByCategory(db);
});
