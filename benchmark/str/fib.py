import sys

def str(n):
	_str = ""
	_toBeAppended = "0"
	for x in range(1, n):
		_str += _toBeAppended
	return n

n = int( sys.argv[1] )
# print n
print str(n)