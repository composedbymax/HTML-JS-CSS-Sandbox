<!DOCTYPE html>
<html lang="en">
<?php include 'redirect.php' ?>
<head>
    <title>Code Room: <?= htmlspecialchars($room) ?></title>
    <link rel="stylesheet" href="root.css">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <div class="editor-panel">
            <div class="editor">
                <h3>HTML</h3>
                <textarea id="html"></textarea>
            </div>
            <div class="editor">
                <h3>CSS</h3>
                <textarea id="css"></textarea>
            </div>
            <div class="editor">
                <h3>JavaScript</h3>
                <textarea id="js"></textarea>
            </div>
        </div>
        <div class="preview-panel">
            <div class="toolbar">
                <button onclick="saveCode()">Save</button>
                <button onclick="fetchCode()">Fetch</button>
                <button onclick="toggleConsole()">Console</button>
                <button onclick="toggleTheme()">Theme</button>
                <div class="dropdown">
                    <button onclick="toggleDropdown()">Download</button>
                    <div id="downloadDropdown" class="dropdown-content">
                        <button onclick="downloadHTML()">HTML</button>
                        <button onclick="downloadCSS()">CSS</button>
                        <button onclick="downloadJS()">JS</button>
                    </div>
                </div>
            </div>
            <div class="resize-buttons">
                    <button class="resize-button" onclick="resizePanel(-5)">◀</button>
                    <button class="resize-button" onclick="resizePanel(5)">▶</button>
                </div>
            <iframe id="preview"></iframe>
            <div id="error-console" class="error-console"></div>
        </div>
    </div>
    <script src="script.js" async></script>
</body>
</html>