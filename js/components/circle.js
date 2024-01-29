export default class Circle extends HTMLElement {

    radius = 50;
    color = "red";

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
    }

    render() {
        this.shadow.innerHTML = `
            <style>
                .circle {
                    width: ${this.radius}px;
                    height: ${this.radius}px;
                    background-color: ${this.color};
                    border-radius: 50%;
                    margin-bottom: 20px;
                }
            </style>
            <div>
                <h2>My Circle</h2>
                <div class="circle" id='circle'></div>
                <div>
                    <input value="${this.radius}" id="radius" type="number" min="1" placeholder="radius"/>
                    <input value="${this.color}" id="color" type="text" placeholder="color"/>
                </div>
            </div> 
        `;
    }

    connectedCallback() {
        this.render();
    }
 
}