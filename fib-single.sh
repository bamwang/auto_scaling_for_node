for (( i = 0; i < ${2}; i++ )); do
	curl -sL http://0.0.0.0:3001/${1} -m 2000 -w "%{time_starttransfer}\t%{time_total}\n"
done
