<?php
$room = $_GET['room'] ?? '';
if (!preg_match('/^[A-Za-z0-9_]+$/', $room) || !is_dir("rooms/$room")) {
    header("Location: create_room.html");
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Code Room: <?= htmlspecialchars($room) ?></title>
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