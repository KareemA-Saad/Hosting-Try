import { collection, getDocs, query, where, addDoc, serverTimestamp, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase-config.js";
import { showInvoicePopup } from "./invoice.js";
import { IsLogin } from './isLogin.js';

window.addEventListener("load", () => {
    IsLogin()
        .then((user) => {
            let userId = user.uid;
            initPayPal(db, userId);
        })
        .catch(() => {
            window.location.href = "./../auth/loginForm.html";
        });
});

async function getCartItemsFromFirestoreByUser(db, userId) {
    let cartRef = collection(db, "carts");
    let q = query(cartRef, where("userId", "==", userId));
    let querySnapshot = await getDocs(q);

    let cartItems = [];
    querySnapshot.forEach(document => {
        cartItems.push({ 
            firestoreId: document.id, 
            ...document.data()
        });
    });

    return cartItems;
}

async function calculateTotalAmount(cartItems) {
    let total = 0;
    for (let item of cartItems) {
        let priceBeforeDiscount = parseFloat(item.price);
        let discount = parseFloat(item.discountPercentage);
        let priceAfterDiscount = priceBeforeDiscount * (1 - discount / 100);
        total += priceAfterDiscount * (item.quantity);
    }
    return total.toFixed(2);
}

export async function initPayPal(db, userId) {
    let cartItems = await getCartItemsFromFirestoreByUser(db, userId);
    if (cartItems.length === 0) {
        return;
    }
    paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'white',
            shape: 'rect',
            label: 'pay',
            tagline: false,
            height: 45
        },
        createOrder: async function (data, actions) {
            
            let cartItemsCurrent = await getCartItemsFromFirestoreByUser(db, userId);
            if (cartItemsCurrent.length === 0) {
                alert("Your cart is empty!");
                return;
            }
            let valueShouldPay = await calculateTotalAmount(cartItemsCurrent);
            if (valueShouldPay <= 0) {
                alert("Invalid total amount.");
                return;
            }
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: valueShouldPay
                    }
                }]
            });
        },
        onApprove: async function (data, actions) {
            return actions.order.capture().then(async function (details) {
                
                let cartItemsCurrent = await getCartItemsFromFirestoreByUser(db, userId);
                let cartItemIds = cartItemsCurrent.map(item => item.firestoreId); 
                let valueShouldPay = await calculateTotalAmount(cartItemsCurrent);
                let paidAmount = details.purchase_units[0].amount.value;
                if (Number(paidAmount).toFixed(2) === valueShouldPay) {
                    let productsWithQuantity = cartItemsCurrent.map(item => ({
                        id: item.firestoreId,
                        code: item.code || "",
                        description: item.description || "",
                        image: item.image || "",
                        price: item.price || 0,
                        discount: item.discountPercentage || 0,
                        quantity: item.quantity || 0,
                        title: item.title || ""
                    }));
                    let orderData = {
                        userId: userId,
                        payerName: details.payer.name.given_name + " " + details.payer.name.surname,
                        payerEmail: details.payer.email_address,
                        transactionId: details.id,
                        paidAmount: paidAmount,
                        currency: details.purchase_units[0].amount.currency_code,
                        createdAt: serverTimestamp(),
                        products: productsWithQuantity,
                        status: "completed"
                    };
                    try {
                        await addDoc(collection(db, "orders"), orderData);
                        
                        for (let cartId of cartItemIds) {
                            await deleteDoc(doc(db, "carts", cartId));
                        }
                        showInvoicePopup(orderData);
                        setTimeout(() => {
                            window.location.reload();
                        }, 8000);
                    } catch (error) {
                        alert("Payment mismatch. Expected: $" + valueShouldPay + " but got: $" + paidAmount);
                    }
                } else {
                    alert("Payment mismatch. Expected: $" + valueShouldPay + " but got: $" + paidAmount);
                }
            });
        }
    }).render('#paypal-button-container');
}
