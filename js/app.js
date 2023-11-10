//   タイトルをカラフルに
function colorizeTitles() {
    document.querySelectorAll('.colorful').forEach(el => {
        Array.from(el.childNodes).forEach(child => {
            if (child.nodeType === 3 && child.textContent.trim().length > 0) {
                const fragment = document.createDocumentFragment();
                Array.from(child.textContent).forEach(letter => {
                    const span = document.createElement('span');
                    span.textContent = letter;
                    fragment.appendChild(span);
                });
                el.replaceChild(fragment, child);
            }
        });
    });
}

//  お絵描き機能
let isDrawing = false;
let oldX = 0;
let oldY = 0;
const canvas = document.querySelector("#drawarea");
const ctx = canvas.getContext("2d");
const boldLineInput = document.querySelector("#bold_line");
const colorInput = document.querySelector("#color");

function setDrawingAttributes() {
    ctx.strokeStyle = colorInput.value;
    ctx.lineWidth = boldLineInput.value;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
}

function startDrawing(e) {
    isDrawing = true;
    [oldX, oldY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;
    setDrawingAttributes();
    ctx.beginPath();
    ctx.moveTo(oldX, oldY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [oldX, oldY] = [e.offsetX, e.offsetY];
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', () => isDrawing = false);
canvas.addEventListener('mouseout', () => isDrawing = false);

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    boldLineInput.value = 3;
    colorInput.value = "#cccccc";
}

document.querySelector("#clear_btn").addEventListener("click", () => {
    clearCanvas();
});

// メモ機能
function saveMemo() {
    const title = document.querySelector("#title").value;
    const text = document.querySelector("#text").value;
    const timestamp = Date.now();
    const imageData = canvas.toDataURL();
    const memo = { title, text, timestamp, image: imageData };
    localStorage.setItem(timestamp.toString(), JSON.stringify(memo));
    appendMemo(memo);
    document.querySelector('#title').value = "";
    document.querySelector('#text').value = "";
    clearCanvas();
}

document.querySelector("#save").addEventListener("click", saveMemo);

document.querySelector("#clear").addEventListener("click", () => {
    localStorage.clear();
    document.querySelector("#pages").innerHTML = '';
});

// function appendMemo({ title, text, timestamp, image }) {
//     const dateStr = new Date(timestamp).toLocaleString('ja-JP');
//     const listElement = document.createElement('li');
//     listElement.innerHTML = `
//         <p>${dateStr}</p>
//         <p>${title}</p>
//         <img src="${image}" alt="${title}">
//         <p>${text}</p>
//     `;
//     document.querySelector("#list").appendChild(listElement);
// }

function appendMemo({ title, text, timestamp, image }) {
    const dateStr = new Date(timestamp).toLocaleString('ja-JP');
    const pageElement = document.createElement('label');
    pageElement.innerHTML = `
        <input type="checkbox" />
        <span style="z-index: 95;">
            <p>${dateStr}</p>
            <p>${title}</p>
            <img src="${image}" alt="${title}">
            <p>${text}</p>
        </span>
        <span class="dummy">
            <p>${dateStr}</p>
            <p>${title}</p>
            <img src="${image}" alt="${title}">
            <p>${text}</p>
        </span>
    `;
    console.log(pageElement);
    document.querySelector("#pages").appendChild(pageElement);
}

function loadMemos() {
    Object.keys(localStorage).sort().forEach(key => {
        const memo = JSON.parse(localStorage.getItem(key));
        if (memo) {
            appendMemo(memo);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    colorizeTitles();
    loadMemos();
});
