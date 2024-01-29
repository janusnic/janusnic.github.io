const template = document.createElement('template');
template.innerHTML = `
<style>
    .crumb {
        align-items: center;
        justify-content: space-between;
    }
            
    .breadcrumb {
                display: flex;
                flex-wrap: wrap;
                padding: 0 0;
                margin-bottom: 1rem;
                font-size: .85rem;
                list-style: none;
            }
   .breadcrumb-item {
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.1em;
            }
            
    .breadcrumb-item+.breadcrumb-item {
                padding-left: .5rem;
            }
            
    .breadcrumb-item+.breadcrumb-item::before {
                float: left;
                padding-right: .5rem;
                color: #ced4da;
                content: var(--bs-breadcrumb-divider,  "/"); 
            }
            
    .breadcrumb-item.active {
                color: #adb5bd;
            }

    .hero {
                background-color: rgba(161, 161, 170, 0.1);
                align-items: center;
                justify-content: space-between;
            }

    .py-5 {
                padding-top: 3rem;
                padding-bottom: 3rem;
            }
    .mt-5 {
                margin-top: 3rem;
            }
    .d-flex {
                display: flex;
            }

    .container {
                width: 100%;
                padding: 4rem; 
                padding: 0 1rem;
                margin: 0 auto;
            }
            
        @media (min-width: 576px) {
            .container {
                max-width: 540px;
            }
        }

        @media (min-width: 768px) {
            .container {
                max-width: 720px;
            }
        }

        @media (min-width: 992px) {
            .container {
                max-width: 960px;
            }
        }

        @media (min-width: 1200px) {
            .container {
                max-width: 1140px;
            }
        }

        @media (min-width: 1400px) {
            .container {
                max-width: 1320px;
            }
        }
</style>
            
<section class="hero py-5 mt-5 bg-light">
    <div class="container py-5"><div class="mt-5 d-flex crumb"></div></div>
</section>`;

export default class Breadcrumb extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.appendChild(template.content);
    }

    get title() {
        return this.getAttribute('title');
    }
    
    get page_title() {
        return this.getAttribute('page_title');
    }

    makeCrumbBlock = () => `
    <h1 class="h2 text-uppercase mb-0">${this.title}</h1>
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb justify-content-end mb-0 px-0 bg-light">
            <li class="breadcrumb-item"><a class="text-dark" href="index.html">Home</a></li>
            <li class="breadcrumb-item active" aria-current="page">${this.page_title}</li>
        </ol>
    </nav>`;

    connectedCallback() {
        const crumb = this.shadow.querySelector('.crumb');
        crumb.innerHTML = this.makeCrumbBlock()
    }
}
