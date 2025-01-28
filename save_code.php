<?php
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$room = $data['room'] ?? '';

if (!preg_match('/^[A-Za-z0-9_]+$/', $room) || !is_dir("rooms/$room")) {
    echo json_encode(['success' => false, 'error' => 'Invalid room']);
    exit;
}

try {
    file_put_contents("rooms/$room/html.html", $data['html'] ?? '');
    file_put_contents("rooms/$room/css.css", $data['css'] ?? '');
    file_put_contents("rooms/$room/js.js", $data['js'] ?? '');
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>