'use strict';
import { fetchData } from '/js/modules/helpers.js';

const carouselTemplate = document.createElement('template');

carouselTemplate.innerHTML = `
 <style>
  .carousel {
	  align-items: center;
	  background: #fff;
	  display: flex;
	  justify-content: center;
	}

	@keyframes scroll {
	  0% {
	    transform: translateX(0);
	  }
	  100% {
	    transform: translateX(calc(-250px * 7));
	  }
	}

	.slider {
	  background: white;
	  box-shadow: 0 10px 20px -5px rgba(0, 0, 0, 0.125);
	  height: 100px;
	  margin: auto;
	  overflow: hidden;
	  position: relative;
	  width: 960px;
	}

	.slider::before, .slider::after {
	  background: linear-gradient(to right, white 0%, rgba(255, 255, 255, 0) 100%);
	  content: "";
	  height: 100px;
	  position: absolute;
	  width: 200px;
	  z-index: 2;
	}

	.slider::after {
	  right: 0;
	  top: 0;
	  transform: rotateZ(180deg);
	}

	.slider::before {
	  left: 0;
	  top: 0;
	}

	.slider .slide-track {
	  animation: scroll 40s linear infinite;
	  display: flex;
	  width: calc(250px * 14);
	}

	.slide {
	  height: 100px;
	  width: 250px;
	}

	.slide img {
	    display: block;
	    height: 100px;
	    width: 250px;
	    object-fit: cover;
	}

	.category-item {
	    display: block;
	    position: relative;
	}
	  
	.category-item img {
	    transition: all 0.3s;
	}
	  
	.category-item-title {
	    display: inline-block;
	    padding: 0.5rem 1rem;

	    color: #343a40;
	    background: #fff;
	    font-size: 0.8rem;
	    text-transform: uppercase;
	    letter-spacing: 0.07em;

	    position: absolute;
	    top: 50%;
	    left: 50%;

	    transform: translate(-50%, -50%);
	    box-shadow: 0 0 5px rgba(0, 0, 0, 0.07);
	  
	}
	  
	.category-item:hover img {
	    opacity: 0.7;
	}


</style>

<div class="carousel">
  <div class="slider">
    <div class="slide-track">

    </div>
  </div>
</div>
`;

export default class Carousel extends HTMLElement {
  
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    const templateContent = carouselTemplate.content;
    this.shadow.appendChild(templateContent.cloneNode(true));
  }

  connectedCallback() {
    this.setupCarousel();
  }

  get url() {
    return this.getAttribute('url');
  }

  get site_url() {
    return this.getAttribute('site_url');
  }

  carouselItemTemplate = (item) => `
    <div class="slide carousel-item">
    <a class="category-item" href="#!" data-category="${item.id}">
        <img src="${this.site_url}/images/product-${item.id}.jpg" alt="Electronic" height="100" with="250">
        <strong class="category-item-title" data-category="${item.id}">${item.name}</strong>
    </a>
    </div>`;

  setupCarousel() {
  	const container = this.shadow.querySelector('.slide-track');
  	( () => { 
        fetchData(`${this.url}/categories`)
        .then(categories => {
	  	    const sliced_categories = categories.slice(0, 7);
			const concated_categories = sliced_categories.concat(categories.slice(0, 7));
            let result = concated_categories.map(item => this.carouselItemTemplate(item)).join(" ");
	        container.innerHTML = result;
        });
    })();
  }
}
