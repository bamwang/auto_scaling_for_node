<?php

$n = $argv[1];
function fib($n) {
  if ($n < 2) {
    return 1;
  } else {
    return fib($n - 2) + fib($n - 1);
  }
}
print( fib($n) );
?>