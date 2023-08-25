<?php
$len = 0;
function getBuffer(string $filename): string
{
    $file = "";
    $buf = fopen($filename, "r");

    while ($line = fgets($buf))
        $file .= $line;

    fclose($buf);
    return $file;
}

function writetoBuffer(string $filename, string $content): void
{
    $buf = fopen($filename, "w");
    fwrite($buf, $content);
    fclose($buf);
}


$json = json_decode(getBuffer('log'), true);
if (!empty($json))
{
    $len = count($json);
}
if (isset($_POST['log']))
{
    $json[$len] = json_decode($_POST['log'], true);
    writetoBuffer('log', json_encode($json,  JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
}
