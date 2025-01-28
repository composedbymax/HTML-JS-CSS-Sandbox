<!DOCTYPE html>
<html>
<?php
include 'redirect.php'
?>
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
                <button onclick="fetchCode()">Fetch Changes</button>
            </div>
            <iframe id="preview"></iframe>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>