import {populateProductList, addProductToCartButton } from '/js/modules/catalog.js';
import {detailButton} from '/js/modules/modal.js';

function distinctSections(items){
    let mapped = [...items.map(item => item.section)];
    let unique = [...new Set(mapped)];
    return unique
}

let liElement = (obj) => `
  <li class="">
    <a class="reset-anchor category-item" href="#!" data-id="${obj.id}">${obj.name}</a>
</li>`;

let ulElement = (items) => {
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
    div.setAttribute('class', "py-2 px-4 bg-dark text-white mb-3"); 
    div.innerHTML = `<strong class="small text-uppercase fw-bold">${section}</strong>`;
    return div;
}

export function renderCategory(productContainer, selector, products, cart) {
    const categoryItems = document.querySelectorAll(selector);
    categoryItems.forEach(item => item.addEventListener('click', e => 
      {
        e.preventDefault();
            
        if (e.target.classList.contains('category-item')){
            const category = e.target.dataset.id;
            const categoryFilter = items => items.filter(item => item.category == category);
            productContainer.innerHTML = populateProductList(categoryFilter(products));
        }else{
            productContainer.innerHTML = populateProductList(products);
        }
        addProductToCartButton(cart)
        detailButton(cart, products);
      })
    )
}

export const populateCategories = (categoryContainer, categories) => {
    
    let distinct = distinctSections(categories);

    let collation = categoriesCollation(distinct, categories);

    for (let i = 0; i < distinct.length; i++) {
        categoryContainer.append(sectionName(distinct[i]));
        categoryContainer.append(ulElement(collation[i]));
    } 
}




const sortingOrders = [
    {key:"default", value: "Default sorting"}, 
    {key:"popularity", value:"Popularity Products"}, 
    {key:"low-high", value:"Low to High Price"}, 
    {key:"high-low", value:"High to Low Price"}
];

export const sortingOptions = () => sortingOrders.map(item => `<option value="${item.key}">${item.value}</option>`).join(' ');


let compare = (key, order='acs') => (a, b) => {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) return 0;
    
    const A = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
    const B = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    
    comparison = (A > B) ? 1 : -1;
    
    return (order === 'desc') ? -comparison : comparison;
}


export function renderSelect(selectPicker, products, productContainer, cart) {
    selectPicker.innerHTML = sortingOptions();
    selectPicker.addEventListener('change', function() {
        switch(this.value) {
            case 'low-high':
                productContainer.innerHTML = populateProductList(products.sort(compare('price', 'asc')));
                addProductToCartButton(cart)
                break;
            case 'high-low':
                productContainer.innerHTML = populateProductList(products.sort(compare('price', 'desc')));
                addProductToCartButton(cart)
                break;
            case 'popularity':
                productContainer.innerHTML = populateProductList(products.sort(compare('stars', 'asc')));
                addProductToCartButton(cart)
                break;
            default:
                productContainer.innerHTML = populateProductList(products.sort(compare('id', 'asc')));
                addProductToCartButton(cart)
        } 
    });


}


const badgeTemplate = (item) => `<div class="form-check mb-1">
<input class="form-check-input" type="checkbox" id="id-${item}" value="${item}" name="badge">
<label class="form-check-label" for="id-${item}">${item}</label>
</div>`;

const renderList = (products, value) => populateProductList(products.filter(product => product.badge.title.includes(value)));

export const renderShowOnly = (showOnly, products, productContainer) => {
    
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
                productContainer.innerHTML = populateProductList(products);
        })
    })
  }