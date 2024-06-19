<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once 'utils.php';

try {
    $record = readfromBuffer('record');
    print(json_encode(['message' => $record, 'length' => strlen($record), 'status' => 'success']));
} catch (Exception $e) {
    print(json_encode(['message' => $e->getMessage(), 'length' => 0, 'status' => 'error']));
}