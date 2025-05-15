<?php include '../check_auth.php';?>
<?php include 'redirect.php' ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <title>CODEVANILLA - <?= htmlspecialchars($room) ?></title>
  <meta charset="UTF-8">
  <meta name="description" content="CODEVANILLA Coding Rooms">
  <meta name="author" content="github.com/composedbymax">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">  
  <meta name="theme-color" content="#1a1a1a">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <link rel="apple-touch-icon" href="/logo.png">
  <link rel="icon" href="/favicon.ico" type="image/x-icon">
  <meta name="robots" content="noindex, nofollow">
  <meta name="referrer" content="no-referrer">
  <meta http-equiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains; preload">
  <meta http-equiv="X-Content-Type-Options" content="nosniff">
  <meta http-equiv="X-XSS-Protection" content="1; mode=block">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <link rel="stylesheet" href="root.css">
  <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <div class="editor-panel">
            <div class="editor">
                <h3>HTML</h3>
                <textarea id="html" class="editor-textarea" data-type="html"></textarea>
                <div class="drop-zone" data-target="html">Drop HTML files here</div>
            </div>
            <div class="editor">
                <h3>CSS</h3>
                <textarea id="css" class="editor-textarea" data-type="css"></textarea>
                <div class="drop-zone" data-target="css">Drop CSS files here</div>
            </div>
            <div class="editor">
                <h3>JavaScript</h3>
                <textarea id="js" class="editor-textarea" data-type="js"></textarea>
                <div class="drop-zone" data-target="js">Drop JavaScript files here</div>
            </div>
        </div>
        <div class="preview-panel">
            <div class="toolbar">
                <button onclick="sendCode()">Send</button>
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