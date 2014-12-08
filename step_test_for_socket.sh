touch ${2}
sh listing.sh 100 1337 > /dev/null 
echo OK
sleep 5
sh listing.sh ${3} 1337 > /dev/null &
sleep 5
sh listing.sh ${4} ${1} > purejs/step/${2} &
tail -F purejs/step/${2}
