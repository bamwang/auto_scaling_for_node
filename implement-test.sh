times=100
echo ${times}~${1}
sum=0
for (( j = 0; j < ${times}; j++ )); do
	item=`curl -sL http://127.0.0.1:${1}/1 -w "\n%{time_total}\n" 2>/dev/null | tail -n 1`
	# echo ${item}
	sum=`echo "scale=5;${sum}+${item}" | bc`
done
echo "scale=4;${sum}/${times}" | bc
