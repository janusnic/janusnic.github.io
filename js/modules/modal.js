import { findItem } from '/js/modules/helpers.js';
import {addProductToCart} from '/js/modules/catalog.js';

const modalTemplate = (product) =>`
<div class="modal" id="productView">
    <div class="modal-dialog">
      <a href="#!" title="Close" class="close btn-close fas fa-times"></a>
      <div class="modal-body">
        <aside><img src="${product.image}"></aside>
        <main>
          <div class="info-container">
            <div class="info-header"><h2>${product.name}</h2></div>

            <div class="info-price">$${product.price}</div>
            <div class="info-shipping">Free shipping</div>
                    
            <div class="info-button to-cart" data-id="${product.id}">
                <a href="#!" class="btn btn-submit add-to-cart"><i class="fas fa-cart-plus"></i> Add to Cart</a>
            </div>

            <h3 class="qty-header py-2">Amount:</h3>     
                        
            <div class="qty qty-buttons">
                <div class="number-input quantity" data-id="${product.id}">
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

            <div class="info-description">${product.description}</div>
            <a class="btn btn-link text-dark text-decoration-none" href="#!" data-id="${product.id}"><i class="far fa-heart add-to-wishlist"></i>Add to wish list</a>
          </div>
        </main>
      </div>
    </div>
</div>
`;

function renderModal(modalWindow, cart){
  modalWindow.querySelector('.btn-inc').addEventListener('click', e => {
      // prev(e.target)
      let val = e.target.previousElementSibling.value;
      val++;
      e.target.previousElementSibling.value = val;
  });

  modalWindow.querySelector('.btn-dec').addEventListener('click', e => {
      // next(e.target)
      let val = e.target.nextElementSibling.value;
      if(val > 1){
          val--;
      }
      e.target.nextElementSibling.value = val;
  });
  
  let quantityResult = modalWindow.querySelector('.quantity-result');
  let addToCart = modalWindow.querySelector('.add-to-cart');

  addToCart.addEventListener('click', event => {
      let productId = event.target.closest('.to-cart').dataset.id;
      addProductToCart(cart, {id:productId}, +quantityResult.value);
  }); 

  modalWindow.querySelector('.add-to-wishlist').addEventListener('click', event => {
      let productId = event.target.dataset.id;
      addProductToWishList({id:productId});
  });
}

function toggleModal(modalWindow, cart, param, product={}){
 if(modalWindow.innerHTML==''){
  modalWindow.innerHTML =  modalTemplate(product);
  renderModal(modalWindow, cart);
 }else{
  modalWindow.innerHTML = '';
 }
  modalWindow.style.display = param;
}

export function detailButton(cart, products){
  const modalWindow = document.querySelector('.modal-window');
  let detailButtons = catalog.querySelectorAll('.detail');
      
  detailButtons.forEach(button => {
      button.addEventListener('click', (event) => {
          let productId = event.target.closest('.icons').dataset.id;
          let product = findItem(products, productId);

          toggleModal(modalWindow, cart, 'block', product);
     
          document.querySelector('.btn-close').addEventListener('click', event => {
              event.preventDefault();
              toggleModal(modalWindow, cart, 'none');
          });
      });
  });
}