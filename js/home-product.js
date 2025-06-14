import { collection, onSnapshot, query, limit } from "firebase/firestore";
import { db } from "./firebase-config.js";

export let productsInHome = (db) => {
    let productsCollection = collection(db, 'productsData');
    let productsQuery = query(productsCollection, limit(3));

    onSnapshot(productsQuery, (snapshot) => {
        let productsArray = [];

        snapshot.docs.forEach(doc => {
            let products = doc.data();
            products.id = doc.id;
            productsArray.push(products)
        });

        let saleFlex = document.getElementById('sale-flex');
        let template = document.getElementById('product-template');

        // Clear old content if needed
        saleFlex.innerHTML = '';

        productsArray.forEach(product => {
    let clone = template.cloneNode(true);
    clone.style.display = "block";
    clone.id = ""; // Remove ID to avoid duplication

    let img = clone.querySelector('img');
    let h3 = clone.querySelector('h3');
    let del = clone.querySelector('del');
    let span = clone.querySelector('span');

    img.src = product.image;
    img.alt = product.title;
    h3.innerText = product.title;
    del.innerText = (product.originalPrice || (product.price * 1.2)).toFixed(2) + "$";
    span.innerText = product.price + "$";

    clone.addEventListener("click", () => {
        window.location.href = `productDetails.html?id=${product.id}`;
    });

    saleFlex.appendChild(clone);
});

    });
}
document.addEventListener("DOMContentLoaded", () => {
    productsInHome(db);
});