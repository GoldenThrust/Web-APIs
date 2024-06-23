const find = document.getElementById('find');
const section = document.querySelector('section');

find.addEventListener("input", (e) => {
    search(e.target.value);
});

section.addEventListener('input', (e) => {
    search(find.value);
})


function search(value) {
    const text = section.textContent.toLowerCase();
    const indices = [];

    if (!CSS.highlights) {
        alert("CSS Custom Highlight API not supported.");
        return;
    }

    CSS.highlights.delete("find");

    const str = value.trim().toLowerCase();

    if (!str) {
        return;
    }

    let head = 0;

    while (head < text.length) {
        const index = text.indexOf(str, head);
        if (index === -1) break;

        head = index + str.length;
        indices.push(index);
    }

    CSS.highlights.set("find",
        new Highlight(
            ...indices.map((index) => {
                const range = new Range();
                range.setStart(section.childNodes[0], index);
                range.setEnd(section.childNodes[0], index + str.length);
                return range;
            })
        )
    );
}