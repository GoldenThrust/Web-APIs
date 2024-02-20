const Default = document.querySelector('.default');
const loaded = document.querySelector('.loaded');
const url = document.querySelector('.url');
const custom = document.querySelector('.custom');
const section = document.querySelector('section');
const srcurl = document.querySelector('#url');

function toggleAll(on) {
    Default.classList.add("d-none");
    loaded.classList.add("d-none");
    url.classList.add("d-none");
    custom.classList.add("d-none");
    on.classList.remove("d-none")
}

const typeFont = {
    'Default': Default,
    'URL': url,
    'Loaded': loaded,
    'Custom': custom
}

const RootManager = document.querySelector('#root-manager');

RootManager.addEventListener('change', (e) => {
    for (const key in typeFont) {
        if (e.target.value === key) {
            toggleAll(typeFont[key]);
        }
    }
});

for (const elem of Default.children) {
    elem.addEventListener("click", (e) => {
        section.style.fontFamily = e.target.innerText;
    })
}

for (const elem of loaded.children) {
    elem.addEventListener("click", (e) => {
        section.style.fontFamily = e.target.innerText;
    })
}

srcurl.addEventListener('change', (e) => {
    let url = URL.createObjectURL(e.target.files[0]);
    const font = new FontFace('myFont', 'url(' + url.toString() + ')');
    font.load().then(() => {
        document.fonts.add(font);
        section.style.fontFamily = 'myfont';
    });
})