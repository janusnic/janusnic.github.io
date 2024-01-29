const footerTemplate = document.createElement('template');

footerTemplate.innerHTML = 
`<style>
.text-start {
    text-align: left;
}
.text-end {
    text-align: right;
}
@media (max-width: 768px) {
  footer .row div {
    margin: 0 auto;
  }
}
.footer-link {
    font-size: 0.85rem;
    color: #999;
    transition: all 0.3s;
}
.footer-link:hover, .footer-link:focus {
    padding-left: 0.6rem;
    color: #fff;
    text-decoration: none;
}
.footer-link:hover::before, .footer-link:focus::before {
    opacity: 1;
}
.list-unstyled{
  list-style: none;
  margin: 0;
  padding:0;
}
.list-unstyled li{
  position: relative;  
}
.bg-dark {
    background-color: rgb(20, 20, 20) !important;
}
.text-white {
  color: white;
}
.container{
    width: 100%;
    padding: 0 1rem;
    margin: 0 auto;
}
.row{
    display: flex;
    margin: 0 auto;
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-between;
}

.col {
  padding-left: 7rem;
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
@media (min-width: 992px) {
    .col-lg-4 {
        flex: 0 0 auto;
        width: calc((100% - 21rem) / 3);
    }
    .col-lg-6 {
        flex: 0 0 auto;
        width: 50%
    }
}
</style>

<footer class="bg-dark text-white py-4">
      <div class="container py-4">
        <div class="row py-5">
          <div class="col col-lg-4 mb-3 mb-md-0">
            <h4 class="text-uppercase mb-3">Customer services</h4>
            <ul class="list-unstyled mb-0">
              <li><a class="footer-link" href="#!">Help &amp; Contact Us</a></li>
              <li><a class="footer-link" href="#!">Returns &amp; Refunds</a></li>
              <li><a class="footer-link" href="#!">Online Stores</a></li>
              <li><a class="footer-link" href="#!">Terms &amp; Conditions</a></li>
            </ul>
          </div>
          <div class="col col-lg-4 mb-3 mb-md-0">
            <h4 class="text-uppercase mb-3">Company Profile</h4>
            <ul class="list-unstyled mb-0">
              <li><a class="footer-link" href="#!">What We Do</a></li>
              <li><a class="footer-link" href="#!">Available Services</a></li>
              <li><a class="footer-link" href="#!">Latest Posts</a></li>
              <li><a class="footer-link" href="#!">FAQs</a></li>
            </ul>
          </div>
          <div class="col col-lg-4 mb-3">
            <h4 class="text-uppercase mb-3">Social media</h4>
            <ul class="list-unstyled mb-0">
              <li><a class="footer-link" href="https://www.twitter.com" target="_blank" title="Twitter" rel="nofollow"><i
                    class="fab fa-twitter"></i> Twitter</a></li>
              <li><a class="footer-link" href="https://www.instagram.com" target="_blank" title="Instagram"
                  rel="nofollow"><i class="fab fa-instagram"></i> Instagram</a></li>
              <li><a class="footer-link" href="https://www.facebook.com" target="_blank" title="Facebook"
                  rel="nofollow"><i class="fab fa-facebook"></i> Facebook</a></li>
              <li><a class="footer-link" href="https://www.facebook.com" target="_blank" title="Facebook"
                  rel="nofollow"><i class="fab fa-facebook"></i> Facebook</a></li>
            </ul>
          </div>
        </div>
        <div class="border-top pt-4" style="border-color: #1d1d1d !important">
          <div class="row">
            <div class="col-lg-6 text-start">
              <p class="small text-muted mb-0">&copy; 2023 All rights reserved.</p>
            </div>
            <div class="col-lg-6 text-end">
              <p class="small text-muted mb-0">Template designed by <a class="text-white" href="#">Shopaholic</a></p>
            </div>
          </div>
        </div>
      </div>
    </footer>`;

export default class Footer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const fontAwesome = document.querySelector('link[href*="font-awesome"]');
    const shadowRoot = this.attachShadow({ mode: 'closed' });

    if (fontAwesome) {
      shadowRoot.appendChild(fontAwesome.cloneNode());
    }

    shadowRoot.appendChild(footerTemplate.content);
  }
}
