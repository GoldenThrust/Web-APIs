<?php

use function PHPSTORM_META\type;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once 'utils.php';

$len = 0;

$json = json_decode(readfromBuffer('log'), true);

if (!empty($json)) {
    $len = count($json);
}

if (isset($_POST['log'])) {
    $json[$len] = json_decode($_POST['log'], true);
    writetoBuffer('log', json_encode($json,  JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}


$input = file_get_contents('php://input');
$req = json_decode($input, true);

// Debugging output to check the structure of $req
echo "<pre>";
print_r($req);
echo "</pre>";

// Check if 'record' key exists in the decoded JSON input
if (isset($req['record'])) {
    foreach ($req['record'] as $record) {
        appendtoBuffer('record', $record['content']);
    }
} else {
    echo "Warning: 'record' key is not defined in the input.";
}
echo "This is Web API Backend ";
