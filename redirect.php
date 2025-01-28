<?php
$room = $_GET['room'] ?? '';
if (!preg_match('/^[A-Za-z0-9_]+$/', $room) || !is_dir("rooms/$room")) {
    header("Location: create.php");
    exit;
}
?>