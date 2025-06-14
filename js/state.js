let currentCategoryFilter = "all";
let currentOrder = "title";
let currentTypeOrder = "asc";

let productsArray = [];

function setCurrentCategoryFilter(category) {
    currentCategoryFilter = category;
}

function getCurrentCategoryFilter() {
    return currentCategoryFilter;
}

function setCurrentOrder(order) {
    currentOrder = order;
}

function getCurrentOrder() {
    return currentOrder;
}

function setCurrentTypeOrder(typeOrder) {
    currentTypeOrder = typeOrder;
}

function getCurrentTypeOrder() {
    return currentTypeOrder;
}

function setProductsArray(products) {
    productsArray = products;
}

function getProductsArray() {
    return productsArray;
}

export {
    setCurrentCategoryFilter, getCurrentCategoryFilter,
    setCurrentOrder, getCurrentOrder,
    setCurrentTypeOrder, getCurrentTypeOrder,
    setProductsArray, getProductsArray
};
