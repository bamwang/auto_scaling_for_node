touch purejs/fibstep/${2}
sh fib.sh ${3} ${1} ${5} > /dev/null &
sleep 5
sh fib_lite.sh ${4} ${1} ${5} > purejs/fibstep/${2} &
tail -F purejs/fibstep/${2}
