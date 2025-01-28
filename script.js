const editors = {
    html: document.getElementById('html'),
    css: document.getElementById('css'),
    js: document.getElementById('js')
};
const preview = document.getElementById('preview').contentWindow.document;
let timeout;
function resizePanel(change) {
    const editorPanel = document.querySelector('.editor-panel');
    const previewPanel = document.querySelector('.preview-panel');
    let currentWidth = parseFloat(getComputedStyle(editorPanel).width);
    let containerWidth = parseFloat(getComputedStyle(editorPanel.parentElement).width);
    let currentPercentage = (currentWidth / containerWidth) * 100;
    let newPercentage = Math.min(Math.max(currentPercentage + change, 30), 90);
    editorPanel.style.width = `${newPercentage}%`;
    previewPanel.style.width = `${100 - newPercentage}%`;
    window.dispatchEvent(new Event('resize'));
}
function updatePreview() {
    const content = `
        <html>
            <head>
                <style>${editors.css.value}</style>
            </head>
            <body>
                ${editors.html.value}
                <script>${editors.js.value}<\/script>
            </body>
        </html>
    `;
    preview.open();
    preview.write(content);
    preview.close();
}
Object.values(editors).forEach(editor => {
    editor.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(updatePreview, 500);
    });
});
async function saveCode() {
    const room = new URLSearchParams(window.location.search).get('room');
    const response = await fetch('save_code.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            room,
            html: editors.html.value,
            css: editors.css.value,
            js: editors.js.value
        })
    });
    const result = await response.json();
    alert(result.success ? 'Saved successfully!' : `Error: ${result.error}`);
}
async function fetchCode() {
    const room = new URLSearchParams(window.location.search).get('room');
    const response = await fetch(`fetch_code.php?room=${encodeURIComponent(room)}`);
    const data = await response.json();
    if (data.error) {
        alert(`Error: ${data.error}`);
        return;
    }
    editors.html.value = data.html;
    editors.css.value = data.css;
    editors.js.value = data.js;
    updatePreview();
}
fetchCode();