let searchProduct = document.querySelector(".search-product");
let searchToggle = document.getElementById("searchToggle");
let searchInput = document.getElementById("searchInput");
let errorLoad = document.getElementById("error-load");

searchToggle.addEventListener("click", () => {
    searchProduct.classList.toggle("active");
    if (searchProduct.classList.contains("active")) {
        searchInput.focus();
    } else {
        searchInput.value = "";
        showAllProducts();
        errorLoad.style.display = "none";
    }
});

searchInput.addEventListener("input", () => {
    let input = searchInput.value.trim().toLowerCase();

    if (input === "") {
        showAllProducts();
        errorLoad.style.display = "none";
        return;
    }

    let productCards = document.querySelectorAll(".product-card-m");
    let matchedCount = 0;

    productCards.forEach(card => {
        let title = card.querySelector("h3")?.innerText.toLowerCase() || "";
        let category = card.getAttribute("data-category")?.toLowerCase() || "";
        let priceText = card.querySelector(".price-m")?.innerText.replace('$', '') || "";
        let price = priceText.trim();

        let match = title.includes(input) || category.includes(input) || price.includes(input);

        if (match) {
            card.style.display = "block";
            matchedCount++;
        } else {
            card.style.display = "none";
        }
    });

    if (matchedCount === 0) {
        errorLoad.innerText = "No products found";
        errorLoad.style.display = "flex";
    } else {
        errorLoad.style.display = "none";
    }
});

function showAllProducts() {
    let productCards = document.querySelectorAll(".product-card-m");
    productCards.forEach(card => {
        card.style.display = "block";
    });
}
