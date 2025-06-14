let navbar = document.querySelector('.navbar')
document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active')
    cart.classList.remove('active')
}

let cart = document.querySelector('.cart-item-container')
document.querySelector('.fa-shopping-cart').onclick = () => {
    cart.classList.toggle('active')
    navbar.classList.remove('active')
}

window.onscroll = () => {
    navbar.classList.remove('active')
    cart.classList.remove('active')
}

document.addEventListener('DOMContentLoaded', () => {
    let userContainer = document.querySelector('.user-container');
    let userMenu = document.querySelector('.user-menu');
    let userLink = document.getElementById('user-link');
    let loginText = document.getElementById('login-text');
    let timeoutId;

    
    userContainer.addEventListener('mouseenter', () => {
        if (loginText.textContent !== 'Log in') {
            clearTimeout(timeoutId);
            userMenu.classList.add('active');
        }
    });

    
    userContainer.addEventListener('mouseleave', () => {
        timeoutId = setTimeout(() => {
            userMenu.classList.remove('active');
        }, 100); 
    });

    
    userLink.addEventListener('click', (e) => {
        if (loginText.textContent !== 'Log in') {
            e.preventDefault();
        }
    });
});
