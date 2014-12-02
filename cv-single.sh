cat pic_list.txt | xargs -I%{pic} curl -s http://0.0.0.0:3000/%{pic} -m 2000 -w "%{time_starttransfer}\t%{time_total}\n"
