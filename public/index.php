<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

require_once 'utils.php';

$len = 0;

$json = json_decode(readfromBuffer('log'), true);

$jsn = file_get_contents('php://input');
print($jsn);

if (!empty($json))
{
    $len = count($json);
}

if (isset($_POST['log']))
{
    $json[$len] = json_decode($_POST['log'], true);
    writetoBuffer('log', json_encode($json,  JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}

if (isset($_POST['record'])) {
    appendtoBuffer('record', $_POST['record']);
}

echo "This is Web API Backend ". var_dump($GLOBALS);