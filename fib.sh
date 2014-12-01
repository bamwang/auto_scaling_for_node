for (( i = 0; i < ${1}; i++ )); do
	curl -sL http://0.0.0.0:${2}/${3} -m 2000 -w "%{time_starttransfer}\t%{time_total}\n" &
done