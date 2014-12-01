touch purejs/step/${2}
sh _list.txt ${1} > /dev/null
usleep 500
sh _list.txt ${1} > purejs/step/${2} &
tail -f purejs/step/${2}
