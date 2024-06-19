<?php
function writetoBuffer(string $filename, string $content): void
{
    $buf = fopen($filename, "w");
    fwrite($buf, $content);
    fclose($buf);
}

function appendtoBuffer(string $filename, string $content): void
{
    $buf = fopen($filename, "a");
    fwrite($buf, $content . PHP_EOL);
    fclose($buf);
}

function readfromBuffer(string $filename): string
{
    $buf = fopen($filename, "r");
    $filesize = filesize($filename);
    $content = fread($buf, $filesize == 0 ? 1 : $filesize);
    fclose($buf);
    return $content;
}
