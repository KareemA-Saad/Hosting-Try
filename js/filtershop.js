import { setCurrentCategoryFilter } from "./state.js";
import { getProductsFromFireStore } from "./shop.js";

let filterLinks = document.querySelectorAll('#filter a');

filterLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();

        filterLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");

        setCurrentCategoryFilter(link.getAttribute("data-category"));

        getProductsFromFireStore(true);
    });
});
