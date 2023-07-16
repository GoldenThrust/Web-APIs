<?php
date_default_timezone_set('Africa/Lagos');
if (isset($_POST['foldername'])) {
    $text = $_POST['text'];
    $folderName = $_POST['foldername'];
    $date = $_POST['date'];

    // Validate and sanitize input
    $folderName = htmlspecialchars($folderName);
    $text = htmlspecialchars($text) . "\nPHP time \n" . date("F j, Y, g:i a") . "\nJavaScript time\n$date";

    // Create directory if it doesn't exist
    if (!is_dir($folderName)) {
        if (!mkdir($folderName, 0777, true)) {
            die("Failed to create directory.");
        }
    }

    $filename = $_POST['filename'];
    $filePath = $folderName . '/' . $filename;

    // Open file for writing
    $file = fopen($filePath, 'w');
    if ($file === false) {
        die("Unable to open file for writing.");
    }

    if (fwrite($file, $text) === false) {
        fclose($file);
        die("Failed to write to file.");
    }

    fclose($file);
}
?>
