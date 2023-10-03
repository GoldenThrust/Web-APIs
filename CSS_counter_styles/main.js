let myRules = document.styleSheets[0].cssRules;
console.log(myRules[0].system = "number");
console.log(myRules[0].system);

let list_style = document.querySelector("#list_style");
let ul = document.querySelectorAll("ul");
let url = document.querySelector("#url");
let urlf = document.querySelector(".urlf");
let custom = document.querySelector(".custom");
let button = document.querySelector("#button");
let image = document.querySelector("#image");
let urlVisible = true;
let customs = {};

customs.symbols = document.getElementById("symbol");
customs.system = document.getElementById("system");
customs.prefix = document.getElementById("prefix");
customs.suffix = document.getElementById("suffix");
customs.pad = document.getElementById("pad");
customs.fallback = document.getElementById("fallback");
custom.negative = document.getElementById("negative");
custom.speakas = document.getElementById("speakas");
custom.additiveSymbols= document.getElementById("additiveSymbols");
custom.range = document.getElementById("range");

for (const key in customs) {
    customs[key].addEventListener("input", (e) => {
        myRules[0][key] = e.target.value;
        console.log(myRules[0]);
    })
}

list_style.addEventListener("change", (e) => {
    ul.forEach((el) => {
        let selected_list = list_style.value;
        hidAndShow(selected_list, 'url', urlf);
        hidAndShow(selected_list, 'custom', custom);
        if (selected_list === 'custom') {
            selected_list = 'custom_id';
        }
        el.style.listStyle = selected_list;
        url.addEventListener("input", () => {
                el.style.listStyle = 'url(' + url.value + ')';
        });

        image.addEventListener("change", (e) => {
            let srcurl = URL.createObjectURL(e.target.files[0]);
            el.style.listStyle = 'url(' + srcurl + ')';
        })
    })
})

button.onclick = () => {
    if (urlVisible) {
        url.classList.add("d_none");
        image.classList.remove("d_none");
    } else {
        image.classList.add("d_none");
        url.classList.remove("d_none");
    }
    urlVisible = !urlVisible;
}

function hidAndShow(el, val, elT) {
    if (el === val) {
        elT.classList.remove('d_none');
    } else {
        elT.classList.add('d_none');
    }
}

