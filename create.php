<?php include '../check_auth.php';?>
<?php require '../nonce.php' ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <title>CODEVANILLA - CODE</title>
    <meta charset="UTF-8">
    <meta name="description" content="CODEVANILLA">
    <meta name="author" content="github.com/composedbymax">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">  
    <meta name="theme-color" content="#070a12">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <link rel="apple-touch-icon" href="/logo.png">
    <link rel="icon" href="/favicon.ico" type="image/x-icon">
    <meta name="robots" content="noindex, nofollow">
    <meta name="referrer" content="no-referrer">
    <meta http-equiv="Strict-Transport-Security" content="max-age=31536000; includeSubDomains; preload">
    <meta http-equiv="Content-Security-Policy" content="script-src 'nonce-<?php echo $_SESSION['nonce']; ?>';">
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="Permissions-Policy" content="geolocation=(), microphone=(self), camera=(self)">
    <meta http-equiv="X-XSS-Protection" content="1; mode=block">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="stylesheet" href="/assets/css/root.css">
    <script nonce="<?php echo htmlspecialchars($_SESSION['nonce']); ?>">window.userLoggedIn = <?php echo isset($_SESSION['user']) ? 'true' : 'false'; ?>;window.userRole = <?php echo isset($_SESSION['user_role']) ? json_encode($_SESSION['user_role']) : 'null'; ?>;</script>
    <style>body{display:flex;justify-content:center;align-items:center;height:100vh;}.container{background-color:var(--d);border-radius:8px;padding:30px;width:100%;max-width:400px;text-align:center;}h1{font-size:24px;margin-bottom:20px;}form{display:flex;flex-direction:column;gap:15px;}input[type="text"]{padding:10px;font-size:16px;border:1px solid #ddd;border-radius:4px;outline:none;transition:border-color 0.3s;}input[type="text"]:focus{border-color:var(--a);}button{padding:12px;background-color:var(--a);border:none;border-radius:4px;font-size:16px;cursor:pointer;transition:background-color 0.3s;color:var(--text);}button:hover{background-color:var(--b);}button:active{background-color:var(--b);}</style>
</head>
<body>
    <div class="container">
        <h1>Create New Coding Room</h1>
        <form action="create_room.php" method="POST">
            <input type="text" name="room" 
                   placeholder="Room Name (letters, numbers, underscores)" 
                   pattern="[A-Za-z0-9_]+" required>
            <button type="submit">Create Room</button>
        </form>
    </div>
    <script src="/assets/js/header.js"defer nonce="<?php echo htmlspecialchars($_SESSION['nonce']); ?>"></script>
</body>
</html>