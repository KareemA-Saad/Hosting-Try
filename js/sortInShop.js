import { setCurrentOrder, setCurrentTypeOrder } from "./state.js";
import { getProductsFromFireStore } from "./shop.js";

let sortOption = document.getElementById("sort");

sortOption.addEventListener("change", () => {
    let value = sortOption.value;

    switch (value) {
        case "1":
            setCurrentOrder("title");
            setCurrentTypeOrder("desc");
            break;
        case "2":
            setCurrentOrder("price");
            setCurrentTypeOrder("asc");
            break;
        case "3":
            setCurrentOrder("price");
            setCurrentTypeOrder("desc");
            break;
        default:
            setCurrentOrder("title");
            setCurrentTypeOrder("asc");
    }

    getProductsFromFireStore(true);
});
