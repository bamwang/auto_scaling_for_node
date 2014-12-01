touch ${2}
sh listing.sh ${3} ${1} > /dev/null &
usleep 200
sh listing.sh ${4} ${1} > purejs/step/${2} &
tail -F purejs/step/${2}