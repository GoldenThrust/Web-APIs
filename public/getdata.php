<?php
header('Content-Type: application/json');

require_once 'utils.php';

try {
    $record = readfromBuffer('record');
    print(json_encode(['message' => $record, 'length' => strlen($record), 'status' => 'success']));
} catch (Exception $e) {
    print(json_encode(['message' => $e->getMessage(), 'length' => 0, 'status' => 'error']));
}