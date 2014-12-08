tail -n ${1} fib_list.txt | xargs -P 1000 -I%{pic} curl -sL http://0.0.0.0:${2}/%{pic} -m 2000 -w "%{time_starttransfer}\t%{time_total}\n"
