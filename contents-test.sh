for (( i = 0; i < 16; i++ )); do
	echo 
	echo ---${i}
	for (( j = 0; j < 50; j++ )); do
		curl http://127.0.0.1:1337/${1}/${i} 2>/dev/null |xargs expr
	done
done