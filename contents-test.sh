times=20
echo ${times}~${1}
for (( i = 0; i < 20; i++ )); do
	sum=0
	for (( j = 0; j < ${times}; j++ )); do
		item=`curl http://127.0.0.1:1337/${1}/${i} 2>/dev/null |xargs expr`
		sum=`expr ${sum} + ${item}`
	done
	expr ${sum} / ${times}
done