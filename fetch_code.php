<?php
header('Content-Type: application/json');
$room = $_GET['room'] ?? '';
if (!preg_match('/^[A-Za-z0-9_]+$/', $room) || !is_dir("rooms/$room")) {
    echo json_encode(['error' => 'Invalid room']);
    exit;
}
try {
    echo json_encode([
        'html' => file_get_contents("rooms/$room/html.html") ?: '',
        'css' => file_get_contents("rooms/$room/css.css") ?: '',
        'js' => file_get_contents("rooms/$room/js.js") ?: ''
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>