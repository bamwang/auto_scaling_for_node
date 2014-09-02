<?php

$n = $argv[1];
function str($n) {
	$str = "";
	$toBeAppended = "0";
	for ($i=0; $i < $n; $i++) { 
		$str .= $toBeAppended;
	}
	return $n;
}
print( str($n) );
?>