<?php
$output = null;
$return_var = null;
exec('"algorithms/x64/Debug/algorithms.exe"', $output, $return_var);

if ($return_var == 0) {
    echo "C++ program executed successfully\n";
    print_r($output);
} else {
    echo "Error executing C++ program.";
}

