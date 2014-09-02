def str(n)
  str = "";
  toBeAppended = "0";
  for i in 0..n do
  	str += toBeAppended;
  end
 	return n;
end
n = Integer(ARGV[0]);
# puts(n);
puts(str(n))
