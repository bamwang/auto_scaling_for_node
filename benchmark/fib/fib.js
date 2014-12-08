var n = process.argv[2]? parseInt(process.argv[2]) : 1; 
function fib(n) {
  if (n < 2) {
    return 1;
  } else {
    return fib(n - 2) + fib(n - 1);
  }
}
console.log(fib(n))