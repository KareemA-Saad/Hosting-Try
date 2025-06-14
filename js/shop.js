import { collection, query, orderBy, limit, startAfter, getDocs, where } from "firebase/firestore";
import { db } from "./firebase-config.js";
import { getCurrentCategoryFilter, getCurrentOrder, getCurrentTypeOrder, setProductsArray } from "./state.js";

let endOfProducts = null;
let productsPerPage = 8;
let isLoading = false;
let errorLoad = document.getElementById("error-load");
let categoryLink = document.getElementById("category-selected");
let products = [];

async function getProductsFromFireStore(loadFirstPage = true) {
    if (isLoading) return;
    if (!loadFirstPage && endOfProducts === null) return;

    isLoading = true;

    try {
        let collectionRef = collection(db, 'productsData');

        let categoryFilter = getCurrentCategoryFilter();
        let order = getCurrentOrder();
        let typeOrder = getCurrentTypeOrder();

        if (loadFirstPage) {
            endOfProducts = null;
            products = [];
            clearProductCards();
        }

        let targetProducts;
        if (categoryFilter === "all") {
            targetProducts = query(collectionRef, orderBy(order, typeOrder));
        } else {
            targetProducts = query(collectionRef, where("category", "==", categoryFilter), orderBy(order, typeOrder));
        }

        let productsQuery;
        if (loadFirstPage) {
            productsQuery = query(targetProducts, limit(productsPerPage));
        } else {
            productsQuery = query(targetProducts, startAfter(endOfProducts), limit(productsPerPage));
        }
        

        let querySnapshot = await getDocs(productsQuery);

        if (querySnapshot.empty) {
            showError("No more products to load");
            endOfProducts = null;
            isLoading = false;
            return;
        }

        endOfProducts = querySnapshot.docs[querySnapshot.docs.length - 1];

        let newProducts = [];
        querySnapshot.forEach(doc => {
            let product = doc.data();
            product.id = doc.id;
            newProducts.push(product);
        });

        products = [...products, ...newProducts];
        setProductsArray(products);

        appendProductCards(newProducts);

    } catch (error) {
        console.error("Firestore load error:", error);
        showError("Can't load more");
    }

    isLoading = false;
}

function clearProductCards() {
    let shopBody = document.getElementById('shop-body-B');
    if (shopBody) {
        shopBody.innerHTML = '';
    }
}

function appendProductCards(products) {
    let shopBody = document.getElementById('shop-body-B');
    if (!shopBody) return;

    products.forEach(product => {
        let productCard = document.createElement("div");
        productCard.className = "product-card-m";
        productCard.setAttribute("data-category", product.category);

        let priceBeforeDiscount = parseFloat(product.price);
        let discount = parseFloat(product.discountPercentage);
        let priceAfterDiscount = (priceBeforeDiscount * (1 - discount / 100)).toFixed(2);

        productCard.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <span class="price-m">${priceAfterDiscount}$</span>
        <span class="price-m" style="text-decoration: line-through; color:var(--dark-grey-color);">${priceBeforeDiscount}$</span>
        <button class="button-z">View Details</button>
        `;

        productCard.addEventListener("click", (e) => {
            if (e.target.tagName !== 'button') {
                window.location.href = `productDetails.html?id=${product.id}`;
            }
        });
        categoryLink.innerText = getCurrentCategoryFilter();
        categoryLink.setAttribute("data-category",getCurrentCategoryFilter());
        shopBody.appendChild(productCard);
    });
}

function showError(message) {
    errorLoad.innerText = message;
    errorLoad.style.display = "flex";
    setTimeout(() => {
        errorLoad.style.display = "none";
    }, 3000);
}

window.addEventListener("load", () => {
    getProductsFromFireStore(true);

    window.addEventListener('scroll', () => {
        let { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading) {
            getProductsFromFireStore(false);
        }
    });
});

export { getProductsFromFireStore, appendProductCards };
