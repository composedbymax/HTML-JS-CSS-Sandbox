const editors = {
    html: document.getElementById('html'),
    css: document.getElementById('css'),
    js: document.getElementById('js')
};
const preview = document.getElementById('preview').contentWindow.document;
let timeout;
document.body.classList.toggle('dark-theme', localStorage.getItem('darkTheme') === 'true');
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('darkTheme', document.body.classList.contains('dark-theme'));
}
function resizePanel(change) {
    const editorPanel = document.querySelector('.editor-panel');
    const previewPanel = document.querySelector('.preview-panel');
    let currentWidth = parseFloat(getComputedStyle(editorPanel).width);
    let containerWidth = parseFloat(getComputedStyle(editorPanel.parentElement).width);
    let currentPercentage = (currentWidth / containerWidth) * 100;
    let newPercentage = Math.min(Math.max(currentPercentage + change, 20), 90);
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
                <script>
                    (function() {
                        const consoleOutput = {
                            log: window.parent.displayError,
                            error: (msg) => window.parent.displayError(msg, null, 'error'),
                            warn: (msg) => window.parent.displayError(msg, null, 'warn'),
                            info: (msg) => window.parent.displayError(msg, null, 'info'),
                            debug: (msg) => window.parent.displayError(msg, null, 'debug')
                        };
                        Object.keys(consoleOutput).forEach(method => {
                            console[method] = function(...args) {
                                const message = args.map(arg => 
                                    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                                ).join(' ');
                                consoleOutput[method](message);
                            };
                        });
                        window.onerror = function(msg, url, line, col, error) {
                            window.parent.displayError(msg, line, 'error');
                            return false;
                        };
                        window.onunhandledrejection = function(event) {
                            window.parent.displayError('Unhandled Promise: ' + event.reason, null, 'error');
                        };
                    })();
                    try {
                        ${editors.js.value}
                    } catch (error) {
                        console.error('Script Error: ' + error.message);
                    }
                <\/script>
            </body>
        </html>
    `;
    try {
        preview.open();
        preview.write(content);
        preview.close();
    } catch (error) {
        displayError('Preview Error: ' + error.message, null, 'error');
    }
}
function displayError(message, line = null, type = 'error') {
    const errorConsole = document.getElementById('error-console');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message ' + type;
    const timestamp = new Date().toLocaleTimeString();
    const lineInfo = line ? `[Line ${line}]` : '';
    const typeLabel = type.toUpperCase();
    errorDiv.textContent = `[${timestamp}] ${typeLabel} ${lineInfo}: ${message}`;
    errorConsole.appendChild(errorDiv);
    errorConsole.scrollTop = errorConsole.scrollHeight;
}
function toggleConsole() {
    const console = document.getElementById('error-console');
    console.classList.toggle('visible');
}
Object.values(editors).forEach(editor => {
    editor.addEventListener('input', () => {
        clearTimeout(timeout);
        document.getElementById('error-console').innerHTML = '';
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
} fetchCode();
function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}
function downloadHTML() {
    const content = document.getElementById('html').value;
    downloadFile(content, 'index.html');
}
function downloadCSS() {
    const content = document.getElementById('css').value;
    downloadFile(content, 'styles.css');
}
function downloadJS() {
    const content = document.getElementById('js').value;
    downloadFile(content, 'script.js');
}
function toggleDropdown() {
    document.getElementById("downloadDropdown").classList.toggle("show");
}
window.onclick = function(event) {
    if (!event.target.matches('.dropdown button')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}