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
let pageCount = 99;

function saveMemo() {
    const title = document.querySelector("#title").value;
    const text = document.querySelector("#text").value;
    const timestamp = Date.now();
    const imageData = canvas.toDataURL();
    const memo = { title, text, timestamp, image: imageData };
    localStorage.setItem(timestamp.toString(), JSON.stringify(memo));
    loadMemos();
    document.querySelector('#title').value = "";
    document.querySelector('#text').value = "";
    clearCanvas();
}

document.querySelector("#save").addEventListener("click", saveMemo);

document.querySelector("#clear").addEventListener("click", () => {
    localStorage.clear();
    document.querySelector("#pages").innerHTML = '';
});

function appendMemo(memo1, memo2, pageCount) {
    const dateStr1 = new Date(memo1.timestamp).toLocaleString('ja-JP');
    let memo2Content = '';

    if (memo2) {
        const dateStr2 = new Date(memo2.timestamp).toLocaleString('ja-JP');
        memo2Content = `
            <p>${dateStr2}</p>
            <p>${memo2.title}</p>
            <img src="${memo2.image}" alt="${memo2.title}">
            <p>${memo2.text}</p>
        `;
    }

    const pageElement = document.createElement('label');
    pageElement.innerHTML = `
        <input type="checkbox" />
        <span class="page-contents" style="z-index:${pageCount};">
            <p>${dateStr1}</p>
            <p>${memo1.title}</p>
            <img src="${memo1.image}" alt="${memo1.title}">
            <p>${memo1.text}</p>
        </span>
        <span class="page-contents" class="dummy">${memo2Content}</span>
    `;
    console.log(pageElement);
    document.querySelector("#pages").appendChild(pageElement);
}

function loadMemos() {
    document.querySelector("#pages").innerHTML="";
    const keys = Object.keys(localStorage).sort();

    for (let i = 0; i < keys.length; i += 2) {
        const memo1 = JSON.parse(localStorage.getItem(keys[i]));
        const memo2 = i + 1 < keys.length ? JSON.parse(localStorage.getItem(keys[i + 1])) : null;

        if (memo1) {
            appendMemo(memo1, memo2, pageCount);
            pageCount -= 2; 
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    colorizeTitles();
    loadMemos();
});
