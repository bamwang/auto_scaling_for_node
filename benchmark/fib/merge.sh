cd results
rm -f merged.txt
for i in 1 10 20 30 35 40 ; do
	echo $i >> merged.txt
	ls $i-* | xargs cat >> merged.txt ;
done