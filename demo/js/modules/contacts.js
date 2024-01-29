const makeTitle = (icon, title) => `
<h3><svg class="svg-icon mb-4 text-primary svg-icon-light">
    <use xlink:href="#${icon}"> </use>
</svg> ${title}</h3>`;

export const makeContacts = (item) => {
    let content = makeTitle(item.icon, item.title);
    for (let [key, value] of Object.entries(item)){
        if (!(key == 'icon' || key == 'title')) {
            if (key == 'email') {
                value = `<a class="btn btn-link" href="mailto:">${value}</a>`;
            }
            content += `<p>${value}</p>`;
        }
    }
    return content;
} 
