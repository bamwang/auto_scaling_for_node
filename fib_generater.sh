rm -f fib_list.txt
for (( i = 0; i < 100; i++ )); do
echo ${1} >> fib_list.txt
done
for (( i = 0; i < 100; i++ )); do
echo ${2} >> fib_list.txt
done
