"use strict";

import { Store } from '/js/modules/store.js';
import {populateProductList, addProductToCartButton } from '/js/modules/catalog.js';
import { detailButton} from '/js/modules/modal.js';
import {makeContacts} from '/js/modules/contacts.js';
import { populateShoppingCart, renderCart } from '/js/modules/cart.js';
import { cartItemsAmount, fetchData } from '/js/modules/helpers.js';
import { populateCategories, renderCategory, renderSelect, renderShowOnly } from '/js/modules/categories.js';
import Footer from '/js/components/footer.js';
customElements.define('footer-component', Footer);
import Services from '/js/components/services.js';
customElements.define('service-component', Services);
import Breadcrumb from './components/breadcrumb.js';
customElements.define('breadcrumb-component', Breadcrumb);
import Carousel from './components/carousel.js';
customElements.define('carousel-component', Carousel);
let cart = [];
let wishlist = [];

function main() {

    cart = Store.init('basket');
	wishlist = Store.init('wishlist');
    cartItemsAmount(cart);

    // const url = 'http://localhost:3000';
    const url = 'https://my-json-server.typicode.com/couchjanus/db';
    

    const productContainer = document.querySelector('.product-container');

    fetchData(`${url}/products`)
    .then(products => {
        if (productContainer) {
            productContainer.innerHTML = populateProductList(products);	
            addProductToCartButton(cart);
            // addProductToWishListButton();
            detailButton(cart, products);

            const selectPicker = document.querySelector('.selectpicker');
            if(selectPicker) {
                renderSelect(selectPicker, products, productContainer, cart);
            }

            const showOnly = document.querySelector(".show-only");
            if (showOnly) {
                renderShowOnly(showOnly, products, productContainer);
            }
            
            const categoryContainer = document.getElementById('category-container');

            if(categoryContainer) {
                fetchData(`${url}/categories`)
                .then(categories => {
                    populateCategories(categoryContainer, categories);
                    renderCategory(productContainer, '#category-container', products, cart);
                });
            }
        }

        const cartPage = document.getElementById('cart-page');
        if(cartPage) {
            const shoppingCartItems = cartPage.querySelector('.shopping-cart-items');
            shoppingCartItems.innerHTML = populateShoppingCart(cart, products);
            renderCart(shoppingCartItems, cart);
        }
    });

    const contactSidebar = document.querySelector('.contact-sidebar');

    if (contactSidebar) {
        const addressBox =  document.querySelector('.contact-sidebar .address');
        let content = '';
        for (let [key, value] of Object.entries(contacts)) {
            content += makeContacts(value);
        }
        addressBox.innerHTML = content;
    }
    
}
  
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", (event) => {
        main();
    });
} else {
    main();
}
