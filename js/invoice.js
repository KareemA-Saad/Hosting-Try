export function showInvoicePopup(orderData) {
    document.getElementById("invName").textContent = orderData.payerName;
    document.getElementById("invEmail").textContent = orderData.payerEmail;
    document.getElementById("invTransactionId").textContent = orderData.transactionId;

    let date = new Date();
    if (orderData.createdAt && typeof orderData.createdAt.toDate === "function") {
        date = orderData.createdAt.toDate();
    }
    document.getElementById("invDate").textContent = date.toLocaleString();

    document.getElementById("invAmount").textContent = orderData.paidAmount;
    document.getElementById("invCurrency").textContent = orderData.currency;

    let tbody = document.getElementById("productRows");
    tbody.innerHTML = "";

    orderData.products.forEach(product => {
        let row = document.createElement("tr");

        let titleCell = document.createElement("td");
        titleCell.textContent = product.title;
        row.appendChild(titleCell);

        let qtyCell = document.createElement("td");
        qtyCell.textContent = product.quantity;
        row.appendChild(qtyCell);

        let priceCell = document.createElement("td");
        priceCell.textContent = `$${product.price.toFixed(2)}`;
        row.appendChild(priceCell);

        let discount = document.createElement("td");
        discount.textContent = `${product.discount.toFixed(2)}%`;
        row.appendChild(discount);

        let totalCell = document.createElement("td");
        let priceAfterDiscount = product.price * (1 - product.discount / 100);
        totalCell.textContent = `$${(priceAfterDiscount * product.quantity).toFixed(2)}`;
        row.appendChild(totalCell);

        tbody.appendChild(row);
    });

    document.getElementById("invoicePopup").style.display = "flex";
}
