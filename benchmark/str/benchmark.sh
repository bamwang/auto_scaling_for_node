rm -f results/*
for i in 1 10 100 1000 10000 100000 1000000 10000000 100000000 ; do
	echo $i;
	(time node fib $i;) 2> results/$i-node.txt;
	echo node >> results/$i-node.txt;
	(time java fib $i;) 2> results/$i-java.txt;
	echo java >> results/$i-java.txt;
	(time php fib.php $i;) 2> results/$i-php.txt;
	echo php >> results/$i-php.txt;
	(time python fib.py $i;) 2> results/$i-python.txt;
	echo python >> results/$i-python.txt;
	(time ruby fib.rb $i;) 2> results/$i-ruby.txt;
	echo ruby >> results/$i-ruby.txt;
done