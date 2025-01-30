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
document.querySelectorAll('.resize-button').forEach(button => {
    let interval;
    const change = button.onclick.toString().includes('-5') ? -2 : 2;
    ['mousedown', 'touchstart'].forEach(event => 
        button.addEventListener(event, () => interval = setInterval(() => resizePanel(change), 50))
    );
    ['mouseup', 'mouseleave', 'touchend'].forEach(event => 
        button.addEventListener(event, () => clearInterval(interval))
    );
});
function updatePreview() {
    const content = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
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
        const blob = new Blob([content], { type: 'text/html' });
        const blobURL = URL.createObjectURL(blob);
        const iframe = document.getElementById('preview');
        if (iframe.src) {
            URL.revokeObjectURL(iframe.src);
        }
        
        iframe.src = blobURL;
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
function showNotification(message, type = 'success') {
    const overlay = document.createElement('div');
    overlay.className = `notification-overlay ${type}`;
    overlay.textContent = message;
    document.body.appendChild(overlay);
    setTimeout(() => {
        overlay.classList.add('show');
    }, 10);
    setTimeout(() => {
        overlay.classList.remove('show');
        setTimeout(() => document.body.removeChild(overlay), 300);
    }, 1500);
}
async function sendCode() {
    const room = new URLSearchParams(window.location.search).get('room');
    try {
        const response = await fetch('send_code.php', {
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
        showNotification(
            result.success ? 'Saved successfully!' : `Error: ${result.error}`,
            result.success ? 'success' : 'error'
        );
    } catch (error) {
        showNotification('Connection failed. Please check your internet connection.', 'error');
    }
}
function showConfirmDialog(message) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'notification-overlay';
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.marginBottom = '15px';
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.justifyContent = 'center';
        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Confirm';
        confirmButton.onclick = () => {
            document.body.removeChild(overlay);
            resolve(true);
        };
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.onclick = () => {
            document.body.removeChild(overlay);
            resolve(false);
        };
        buttonContainer.appendChild(confirmButton);
        buttonContainer.appendChild(cancelButton);
        overlay.appendChild(messageDiv);
        overlay.appendChild(buttonContainer);
        document.body.appendChild(overlay);
        setTimeout(() => overlay.classList.add('show'), 10);
    });
}
async function fetchCode() {
    const room = new URLSearchParams(window.location.search).get('room');
    const isInitialLoad = !document.getElementById('html').value && 
                          !document.getElementById('css').value && 
                          !document.getElementById('js').value;
    if (!isInitialLoad) {
        const confirmed = await showConfirmDialog('Are you sure you want to fetch code? This will overwrite your current code.');
        if (!confirmed) return;
    }
    try {
        const response = await fetch(`fetch_code.php?room=${encodeURIComponent(room)}`);
        const data = await response.json();
        if (data.error) {
            showNotification(`Error: ${data.error}`, 'error');
            return;
        }
        editors.html.value = data.html;
        editors.css.value = data.css;
        editors.js.value = data.js;
        updatePreview();
    } catch (error) {
        showNotification('Connection failed. Please check your internet connection.', 'error');
    }
}
fetchCode();
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
function setupDragAndDrop() {
    const previewPanel = document.querySelector('.preview-panel');
    const previewFrame = document.getElementById('preview');
    const editors = document.querySelectorAll('.editor');
    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.add('drag-over');
        if (this === previewPanel) {
            previewFrame.style.pointerEvents = 'none';
        }
    }
    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.remove('drag-over');
        if (this === previewPanel) {
            previewFrame.style.pointerEvents = 'auto';
        }
    }
    function handleEditorDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        const editorType = this.querySelector('.editor-textarea').dataset.type;
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                const textarea = document.getElementById(editorType);
                textarea.value = content;
                updatePreview();
            };
            reader.readAsText(file);
        });
    }
    function handlePreviewDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                const extension = file.name.split('.').pop().toLowerCase();
                if (extension === 'html') {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(content, 'text/html');
                    const cssContent = Array.from(doc.getElementsByTagName('style'))
                        .map(style => style.textContent)
                        .join('\n');
                    document.getElementById('css').value = cssContent;
                    const jsContent = Array.from(doc.getElementsByTagName('script'))
                        .map(script => script.textContent)
                        .join('\n');
                    document.getElementById('js').value = jsContent;
                    doc.querySelectorAll('style, script').forEach(el => el.remove());
                    const htmlContent = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;
                    document.getElementById('html').value = htmlContent;
                } else {
                    switch(extension) {
                        case 'css':
                            document.getElementById('css').value = content;
                            break;
                        case 'js':
                            document.getElementById('js').value = content;
                            break;
                        default:
                            displayError(`Unsupported file type: ${extension}`, null, 'warn');
                    }
                }
                updatePreview();
            };
            reader.readAsText(file);
        });
    }
    editors.forEach(editor => {
        editor.addEventListener('dragover', handleDragOver);
        editor.addEventListener('dragleave', handleDragLeave);
        editor.addEventListener('drop', handleEditorDrop);
    });
    previewPanel.addEventListener('dragover', handleDragOver);
    previewPanel.addEventListener('dragleave', handleDragLeave);
    previewPanel.addEventListener('drop', handlePreviewDrop);
}
setupDragAndDrop();