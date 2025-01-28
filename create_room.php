<?php
$room = $_POST['room'] ?? '';
if (!preg_match('/^[A-Za-z0-9_]+$/', $room)) {
    die('Invalid room name!');
}
$dir = "rooms/$room";
if (!file_exists($dir)) {
    mkdir($dir, 0755, true);
    file_put_contents("$dir/html.html", '');
    file_put_contents("$dir/css.css", '');
    file_put_contents("$dir/js.js", '');
}

header("Location: index.php?room=$room");
exit;
?>