times=100
echo ${times}~${1}
sum=0
for (( j = 0; j < ${times}; j++ )); do
	ab -n ${j} -c ${j} http://0.0.0.0:1337/ | grep 'Total:'
done
# echo "scale=4;${sum}/${times}" | bc
