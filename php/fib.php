<?php

$n = $_GET['n'];
function fib($n) {
  if ($n < 2) {
    return 1;
  } else {
    return fib($n - 2) + fib($n - 1);
  }
}
echo fib($n);
?>