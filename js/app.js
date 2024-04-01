"use strict";

const currency = (total) => parseFloat(Math.round(total * 100) / 100).toFixed(2);

const compare = (key, order='acs') => (a, b) => {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) return 0;
    
    const A = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
    const B = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    comparison = (A > B) ? 1 : -1;
    return (order === 'desc') ? -comparison : comparison;
}

const findByProps = function(items, props, what) {
    let founds = [];
    items.find((item, i) => {
        if (item[props] === what) {
            founds.push(items[i]);
        }            
    })
    return founds;
}

const findItem = (items, id) => items.find(item => item.id == id);
const filterItem = (items, id) => items.filter(item => item.id != id);


function Store() {

    this.init = function(key) {
        if(!this.isset(key)) {
            this.set(key, []); 
        }      
      return this.get(key);
    }
  
    this.get = function(key) {
        let value = localStorage.getItem(key);
        return value === null ? null : JSON.parse(value);
    }
  
    this.set = function(key,value) {
          return localStorage.setItem(key,JSON.stringify(value));
    }
  
    this.unset = function(key) {
          if(this.isset(key))
              return localStorage.removeItem(key);
          else
              return null;
    }
  
    this.clear = function() {
          return localStorage.clear();
    }
  
    this.isset = function(key) {
        return this.get(key) !== null;
    }
}


function Product(id, name, price, image) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.image = image;
}

const Singleton = (function () {
    let instance;

    function createInstance(tax, ship) {
        let object = new Cart(tax, ship);
        return object;
    }

    return {
        getInstance: function (tax, ship) {
            if (!instance) {
                instance = createInstance(tax, ship);
            }
            return instance;
        }
    };
})();

function CardProduct(item) {
    
    this.item = item;
   
    const detailTemplate = (item) =>  `
    <div class="detail-container">
        <div class="col-left">
            <img src="${item.image}">
        </div>
        <div class="col-right">
            <div class="info-container">
                <h2 class="info-header">${item.name}</h2>
                <div class="info-price">Price: <span class="price">${item.price}</span></div>
                <div class="info-shipping">Free shipping</div>
               <div class="info-button to-cart" data-id="${item.id}">
                    <a href="#!" class="btn btn-submit add-to-cart"><i class="fas fa-cart-plus"></i> Add to Cart</a>
                </div>
                <h2 class="qty-header py-2">Amount:</h2>     
                <div class="qty qty-buttons">
                    <div class="number-input quantity" data-id="${item.id}">
                        <button class="btn btn-dec">-</button>
                        <input class="quantity-result"
                                        type="number" 
                                        value="1"
                                        min="1"
                                        max="10"
                                        required 
                                        />
                        <button class="btn btn-inc">+</button>
                    </div>
                </div>
                <div class="info-description">${item.description}</div>
                <div class="info-link">
                <a class="btn-link far fa-heart add-to-wishlist" href="#!" data-id="${item.id}">&nbsp;Add to wish list</a>
                </div>
            </div>    
        </div>
      </div>
    `;
    


    const showButton = this.item.querySelector(".show-details");
    const dialog = document.querySelector("dialog");
    const closeButton = dialog.querySelector("dialog .close");
    let dialogMain = dialog.querySelector("dialog .dialog-main");
    

    function renderModal(modalWindow){
        modalWindow.querySelector('.btn-inc').addEventListener('click', e => {
            let val = e.target.previousElementSibling.value;
            val++;
            e.target.previousElementSibling.value = val;
        });
      
        modalWindow.querySelector('.btn-dec').addEventListener('click', e => {
            let val = e.target.nextElementSibling.value;
            if(val > 1){
                val--;
            }
            e.target.nextElementSibling.value = val;
        });
        
        let quantityResult = modalWindow.querySelector('.quantity-result');
        let addToCart = modalWindow.querySelector('.add-to-cart');
      
        addToCart.addEventListener('click', event => {
            let id = event.target.closest('.to-cart').dataset.id;
            let product = productList.getProductById(id);
            product = {...product, amount: +quantityResult.value};

            shoppingCart.addItemToCart(product);
        }); 
      
      }
    
    showButton.addEventListener("click", event => {
        let parent = event.target.closest('.product');
        let id = parent.dataset.id;
        dialogMain.innerHTML = detailTemplate(productList.getProductById(id))
        dialog.showModal();
        renderModal(dialogMain)
    });
  
    
    closeButton.addEventListener("click", () => {
        dialog.close();
    });

    const addToCartButton = this.item.querySelector('.add-to-cart');

    addToCartButton.addEventListener('click', this);
    
    this.handleEvent = function(event) {
        let parent = event.target.closest('.product');
        let id = parent.dataset.id;
        let product = productList.getProductById(id);
        product = {...product, amount: 1};
        shoppingCart.addItemToCart(product);
    } 
}

function Cart(tax = 0.07, shipping = 0) {
    console.log("Cart constructor", this);
    this.tax = tax;
    this.shipping = shipping;
    
    const store = new Store();

    let cart = store.init('basket');

    this.saveCart = function() {
        store.set('basket', cart);
        cartAmount.textContent = this.totalAmount();
    }

    function Item (id, price, amount) {
        this.id = id;
        this.price = price;
        this.amount = amount;
    }
    // 
    this.addItemToCart = function(product) {
        // console.log(product);
        let inCart = cart.some(item => item.id === product.id);

        if (inCart){
            let index = cart.findIndex(item => item.id === product.id);
            cart[index].amount += product.amount;
        }else{
            let item = new Item(product.id, product.price, product.amount);
            cart.push(item);
        }
        this.saveCart();
    }

    this.setCountForItem = function(id, amount) {
        for (let i in cart) {
            if(cart[i].id === id) {
                cart[i].amount = amount;
            }
        }
    }

    this.totalAmount = function() {
        let total = cart.reduce((prev, cur) => prev + cur.amount, 0);
        return total;
    }

    this.totalInCart = function() {
        let total = cart.reduce((prev, cur) => prev + cur.price*cur.amount, 0);
        return currency(total*(1 + this.tax) + this.shipping);
    }

    this.setCartTotal = function (shoppingCartItems) {

        let tmpTotal = 0;
        let subTotal = 0;
        
        cart.map(item => {
            let price = shoppingCartItems.querySelector(`#id${item.id} .product-price`).textContent;
            tmpTotal = +price * item.amount;
            
            shoppingCartItems.querySelector(`#id${item.id} .product-subtotal`).textContent = parseFloat(tmpTotal.toFixed(2));
    
            subTotal += parseFloat(tmpTotal.toFixed(2));
        });
        
        document.querySelector('.cart-subtotal').textContent = this.totalInCart();
        document.querySelector('.cart-tax').textContent = this.tax;
        document.querySelector('.cart-shipping').textContent = this.shipping;
        document.querySelector('.cart-total').textContent = (+this.totalInCart() + +this.tax + +this.shipping).toFixed(2);
    }

    this.removeItemFromCart = function(id) {
        for (let item in cart) {
            if (cart[item].id === id) {
                cart[item].amount--;
                if (cart[item].amount === 0) {
                    cart.splice(item, 1);
                }
                break;
            }
        }
        this.saveCart();
    }

    this.removeAllItemFromCart = function(id) {
        for (let item in cart) {
            if (cart[item].id === id) {
                cart.splice(item, 1);
                break;
            }
        }
        this.saveCart();
    }

    this.clearCart = function() {
        cart = [];
        this.saveCart();
    }

    const cartItemTemplate = (item, product) => `
    <div class="row cart-item" id="id${product.id}">
        <div class="cell"><img src="${product.image}" alt="${product.name}" height="30"></div>
        <div class="cell">${product.name}</div>
        <div class="cell">
            <span class="product-price price">${product.price}</span>
        </div>
        <div class="cell">
            <div class="number-input quantity" data-id="${product.id}">
                <button class="btn btn-dec">-</button>
                <input class="quantity-result"
                type="number" 
                value="${item.amount}"
                min="1"
                max="10"
                required 
                />
                <button class="btn btn-inc">+</button>
            </div>
        </div>
        <div class="cell">
            <span class="product-subtotal price">0</span>
        </div>
        <div class="cell">
            <a href="#!" class="fas fa-trash-alt" data-id="${product.id}"></a>
        </div>
    </div>
    `;


    this.populateShoppingCart = (products) => {
        let result = `<div class="row header">
        <div class="cell">Cover</div>
        <div class="cell">Product</div>
        <div class="cell">Price</div>
        <div class="cell">Quantity</div>
        <div class="cell">Total</div>
        <div class="cell">Action</div>
    </div>`;
        cart.forEach(item => {
            result += cartItemTemplate(item, findItem(products, item.id))
        });
        return result;
    }

    this.renderCart = function(shoppingCartItems) {
        
        this.setCartTotal(shoppingCartItems);

        shoppingCartItems.addEventListener('click', event => {
          
            if(event.target.classList.contains('fa-trash-alt')){
            
            cart = filterItem(cart, event.target.dataset.id);
            
            this.setCartTotal(shoppingCartItems);

            this.saveCart();

            event.target.closest('.cart-item').remove();
        
          }else if(event.target.classList.contains('btn-inc')) {
            
            let tmp = findItem(cart, event.target.closest('.quantity').dataset.id);
            
            tmp.amount += 1;
            event.target.previousElementSibling.value = tmp.amount;
    
            this.setCartTotal(shoppingCartItems);
            this.saveCart();
                    
          }else if(event.target.classList.contains('btn-dec')) {
            let tmp = findItem(cart, event.target.closest('.quantity').dataset.id);
            
            if(tmp !== undefined && tmp.amount > 1) {
              tmp.amount -= 1;
              event.target.nextElementSibling.value = tmp.amount;
            }else{
              cart = filterItem(cart, event.target.dataset.id);
              event.target.closest('.cart-item').remove();
            }
            this.setCartTotal(shoppingCartItems);
            this.saveCart();
          }
        })
    }

}
const starsTemplate = (n) => Array(n).fill('&starf;').concat(Array(5 - n).fill('&star;')).join('');

function ProductList(products) {
    
    this.products = products;

    this.productTemplate = (product) => `
        <article class="product" data-id="${product.id}">
            <div class="icons">
                <a href="#!" class="fas fa-shopping-cart add-to-cart"></a>
                <a href="#!" class="fas fa-heart add-to-wishlist"></a>
                <a href="#!" class="fas fa-eye show-details"></a>
            </div>
            <div class="image">
                <div class="badge bg-${product.badge.bg}">${product.badge.title}</div>
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="content" data-id="${product.id}">
                <h3 class="product-name">${product.name}</h3>
                <span><span class="price"></span><span class="price product-price">${product.price}</span></span> <span class="starf">${starsTemplate(product.stars)}</span>
            </div>                    
        </article>`;

    this.populateProductList = function (products) {
        let content = "";
        products.forEach(item => content += this.productTemplate(item))
        return content;
    }

    this.getProductById = (id) => this.products.find(item => item.id == id);
}

const distinctSections = (items) => {
    let mapped = [...items.map(item => item.section)];
    let unique = [...new Set(mapped)];
    return unique;
}
    
const liElement = (obj) => `<li class=""><a class="reset-anchor category-item" href="#!" data-id="${obj.id}">${obj.name}</a></li>`;

const ulElement = (items) => {
    let ul = document.createElement('ul');
    ul.setAttribute('class', "list-unstyled categories small text-muted");

    let res = '';
    for (let item of items) {
        res += liElement(item);
    }
    ul.innerHTML = res;
    return ul;
}

function categoriesCollation(distinct, categories) {
    let results = [];
    let i = 0;
        
    for (let section of distinct) {
        results[i] = categories.filter(obj => obj.section === section);
        i++;
    }
    return results;
}

let sectionName = section => {
    let div = document.createElement('div');
    div.setAttribute('class', "py-2 px-4 bg-dark text-white mb-1"); 
    div.innerHTML = `<strong class="small text-uppercase fw-bold">${section}</strong>`;
    return div;
}

const populateCategories = (categoryContainer, categories) => {
    
    let distinct = distinctSections(categories);
    let collation = categoriesCollation(distinct, categories);
    
    for (let i = 0; i < distinct.length; i++) {
        categoryContainer.append(sectionName(distinct[i]));
        categoryContainer.append(ulElement(collation[i]));
    } 
}

function renderCategory(productContainer, selector, products) {
    const categoryItems = document.querySelectorAll(selector);

    categoryItems.forEach(item => item.addEventListener('click', e =>  {
        e.preventDefault();
                
        if (e.target.classList.contains('category-item')){
            const category = e.target.dataset.id;
            const categoryFilter = items => items.filter(item => item.category == category);
            productContainer.innerHTML = productList.populateProductList(categoryFilter(products));
        }else{
            productContainer.innerHTML = productList.populateProductList(products);
        }
        let productCards = productContainer.querySelectorAll('.product');

        productCards.forEach(item => new CardProduct(item));

    }));
}

const sortingOrders = [
    {key:"default", value: "Default sorting"}, 
    {key:"popularity", value:"Popularity Products"}, 
    {key:"low-high", value:"Low to High Price"}, 
    {key:"high-low", value:"High to Low Price"}
];

const sortingOptions = () => sortingOrders.map(item => `<option value="${item.key}">${item.value}</option>`).join(' ');

function renderSelect(selectPicker, products, productContainer) {
    selectPicker.innerHTML = sortingOptions();
    selectPicker.addEventListener('change', function() {
        switch(this.value) {
            case 'low-high':
                productContainer.innerHTML = productList.populateProductList(products.sort(compare('price', 'asc')));
                break;
            case 'high-low':
                productContainer.innerHTML = productList.populateProductList(products.sort(compare('price', 'desc')));
                break;
            case 'popularity':
                productContainer.innerHTML = productList.populateProductList(products.sort(compare('stars', 'desc')));
                break;
            default:
                productContainer.innerHTML = productList.populateProductList(products.sort(compare('id', 'asc')));
        } 
        let productCards = productContainer.querySelectorAll('.product');
        productCards.forEach(item => new CardProduct(item));
    });
}

const badgeTemplate = (item) => `<div class="form-check mb-1">
<input class="form-check-input" type="checkbox" id="id-${item}" value="${item}" name="badge">
<label class="form-check-label" for="id-${item}">${item}</label>
</div>`;


const renderList = (products, value) => productList.populateProductList(products.filter(product => product.badge.title.includes(value)));


const renderShowOnly = (showOnly, products, productContainer) => {
    
    let badges = [...new Set([...products.map(item => item.badge.title)].filter(item => item != ''))];

    showOnly.innerHTML = badges.map(item => badgeTemplate(item)).join(" ");

    let checkboxes = showOnly.querySelectorAll('input[name="badge"]')
    
    let values = [];
    
    checkboxes.forEach(item => {
        item.addEventListener("change", e => {
            if (e.target.checked) {
                values.push(item.value)
                
                productContainer.innerHTML = values.map(value => renderList(products, value)).join("");
            }else {
                if (values.length != 0) {
                    values.pop(item.value)
                    
                    productContainer.innerHTML = values.map(value => renderList(products, value)).join("");
                }
            }
            if (values.length == 0)
                productContainer.innerHTML = productList.populateProductList(products);
                let productCards = productContainer.querySelectorAll('.product');
                productCards.forEach(item => new CardProduct(item));
        });
        
    });
    
}

let cartAmount = document.getElementById('cart-amount');
// let shoppingCart = new Cart();
let shoppingCart = Singleton.getInstance(0.2, 15);
let productList = new ProductList(products);
cartAmount.textContent = shoppingCart.totalAmount();

function main() {
    const productContainer = document.querySelector('.product-container');
    
    if (productContainer) {

    
        productContainer.innerHTML = productList.populateProductList(products);	

        let productCards = productContainer.querySelectorAll('.product');

        productCards.forEach(item => new CardProduct(item));

        const sidebar = document.getElementById('sidebar');

        if (sidebar) {
            const categoryContainer = document.getElementById('category-container');

            populateCategories(categoryContainer, categories);
            
            renderCategory(productContainer, '#category-container', products);
        }


        const selectPicker = document.getElementById('selectpicker');

        if(selectPicker) {
            renderSelect(selectPicker, products, productContainer);
        }

        const showOnly = document.querySelector(".show-only");
        if (showOnly) {
            renderShowOnly(showOnly, products, productContainer);
        }
    }
    const cartPage = document.getElementById('cart-page');
		if(cartPage) {
			const shoppingCartItems = cartPage.querySelector('.cart-main .table');
			shoppingCartItems.innerHTML = shoppingCart.populateShoppingCart(products);
			shoppingCart.renderCart(shoppingCartItems);
	}
        
}

const template = document.createElement("template");
    
template.innerHTML = `
<footer class="mb-3">
        <div class="container page-footer">
            <section class="footer-main">
                <div class="footer-main-item">
                    <h3 class="footer-title">About</h3>
                    <ul>
                        <li><a href="">Services</a></li>
                        <li><a href="">Profiles</a></li>
                        <li><a href="">Prices</a></li>
                        <li><a href="">Customers</a></li>
                        <li><a href="./exercises/index.html">Exercises</a></li>
                    </ul>
                </div>
                <div class="footer-main-item">
                    <h3 class="footer-title">Resources</h3>
                    <ul>
                        <li><a href="">Docs</a></li>
                        <li><a href="">Blog</a></li>
                        <li><a href="">eBooks</a></li>
                        <li><a href="">Webinars</a></li>
                    </ul>
                </div>
                <div class="footer-main-item">
                    <h3 class="footer-title">Contact</h3>
                    <ul>
                        <li><a href="">Help</a></li>
                        <li><a href="">Sales</a></li>
                        <li><a href="">Advertise</a></li>
                    </ul>
                </div>
            </section>

            <section class="footer-social py-3">
                <ul class="footer-social-list">
                    <li><a href=""><i class="fab fa-facebook"></i></a></li>
                    <li><a href=""><i class="fab fa-twitter"></i></a></li>
                    <li><a href=""><i class="fab fa-instagram"></i></a></li>
                    <li><a href=""><i class="fab fa-github"></i></a></li>
                    <li><a href=""><i class="fab fa-linkedin"></i></a></li>
                    <li><a href=""><i class="fab fa-youtube"></i></a></li>
                </ul>
            </section>
           
            <section class="footer-ligal py-3">
                <ul class="footer-ligal-list">
                    <li><a href="#">Terms &amp; Conditions</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">&copy; 2024 Copyright Shopaholic Inc.</a></li>
                </ul>
                
            </section>
        </div>
    </footer>
`;
  
// Clone the new row and insert it into the table

const clone = template.content.cloneNode(true);
document.body.appendChild(clone);

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        main();
    });
} else {
    main();
}
