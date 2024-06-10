<?php
require_once 'utils.php';

$len = 0;

$json = json_decode(readfromBuffer('log'), true);

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
echo "This is Web API Backend ". var_dump($_POST);