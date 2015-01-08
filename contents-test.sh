for (( i = 0; i < 16; i++ )); do
	echo '\n==' ${i}
	for (( j = 0; j < 50; j++ )); do
		curl http://0.0.0.0:1337/${1}/${i}
	done
done