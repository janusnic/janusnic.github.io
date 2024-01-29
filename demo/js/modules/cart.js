
import { findItem, filterItem, saveCart } from '/js/modules/helpers.js';

const cartItemTemplate = (item, product) => `
<tr class="cart-item" id="id${product.id}">
    <td class="" scope="row"><a class="reset-anchor d-block" href="detail.html"><img src="${product.image}" alt="${product.name}" height="30">${product.name}</a></td>
    <td class="" scope="row"><span class="mb-0 small">$<span class="product-price">${product.price}</span></span></td>
    <td class="qty" scope="row">
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
    </td>
    <td class="" scope="row"><span class="mb-0 small">$<span class="product-subtotal">0</span></span></td>
    
    <td class="" scope="row">
        <a class="remove" href="#!"><i class="fas fa-trash-alt small text-muted" data-id="${product.id}"></i></a>
    </td>
</tr>
`;


export const populateShoppingCart = (cart, products) => {
    let result = '';
    cart.forEach(item => {
        result += cartItemTemplate(item, findItem(products, item.id))
    });
    return result;
}


function setCartTotal(shoppingCartItems, cart) {
    let tmpTotal = 0;
    let subTotal = 0;
    cart.map(item => {
        let price = shoppingCartItems.querySelector(`#id${item.id} .product-price`).textContent;
        tmpTotal = +price * item.amount;
        
        shoppingCartItems.querySelector(`#id${item.id} .product-subtotal`).textContent = parseFloat(tmpTotal.toFixed(2));

        subTotal += parseFloat(tmpTotal.toFixed(2));
    });

    let cartTax = (subTotal * 0.07).toFixed(2);

    document.querySelector('.cart-subtotal').textContent = subTotal;
    document.querySelector('.cart-tax').textContent = cartTax;
    document.querySelector('.cart-total').textContent = +subTotal + +cartTax;
}

export function renderCart(shoppingCartItems, cart) {
    setCartTotal(shoppingCartItems, cart);
    shoppingCartItems.addEventListener('click', event => {
      if(event.target.classList.contains('fa-trash-alt')){
        cart = filterItem(cart, event.target.dataset.id);
        setCartTotal(shoppingCartItems, cart);
        saveCart(cart);
        event.target.closest('.cart-item').remove();
    
      }else if(event.target.classList.contains('btn-inc')) {
        
        let tmp = findItem(cart, event.target.closest('.quantity').dataset.id);
        
        tmp.amount += 1;
        event.target.previousElementSibling.value = tmp.amount;

        setCartTotal(shoppingCartItems, cart);
        saveCart(cart);
                
      }else if(event.target.classList.contains('btn-dec')) {
        let tmp = findItem(cart, event.target.closest('.quantity').dataset.id);
        
        if(tmp !== undefined && tmp.amount > 1) {
          tmp.amount -= 1;
          event.target.nextElementSibling.value = tmp.amount;
        }else{
          cart = filterItem(cart, event.target.dataset.id);
          event.target.closest('.cart-item').remove();
        }
        setCartTotal(shoppingCartItems, cart);
        saveCart(cart);
      }
    })
}