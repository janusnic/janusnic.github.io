import { Store } from '/js/modules/store.js';

export const findItem = (items, id) => items.find(item => item.id == id);

export const filterItem = (items, id) => items.filter(item => item.id != id);

const changeStyle = (item) => item.classList.add(["not-empty"]);


export function cartItemsAmount(cart) {
    const totalInCart = document.getElementById('total-in-cart');
    if (!+totalInCart.innerText) {
        changeStyle(totalInCart);
    }
    totalInCart.textContent = cart.reduce((prev, cur) => prev + cur.amount, 0);
}


export function saveCart(cart){
    Store.set('basket', cart);
    cartItemsAmount(cart);
}


function saveWishList(wishlist){
    Store.set('wishlist', wishlist);
}

function prev(target) {
    let val = target.previousElementSibling.value;
    val++;
    target.previousElementSibling.value = val;
}

function next(target) {
    let val = target.nextElementSibling.value;
    if(val > 1){
        val--;
    }
    target.nextElementSibling.value = val;
}


export async function fetchData(url){
    return await fetch(url, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(response => {
        if(response.status >= 400){
            return response.json().then(err => {
                const error = new Error('Something went wrong!')
                error.data = err
                throw error
            })
        }
        return response.json()
    })
}