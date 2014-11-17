var express = require('express');
var app = express();

function fib(n) {
  if (n < 2) {
    return 1;
  } else {
    return fib(n - 2) + fib(n - 1);
  }
}

/*** For reference, and to save you looking at the revision history,
 *   this is the previous implementation.

var async = require('async');
var fibonacci = function(n, callback) {
    if (n <= 2) {
        callback(null, 1);
        return;
    }
    async.series({
        n2: function(next) {
            process.nextTick(function() { fibonacci(n - 2, next); });
        },
        n1: function(next) {
            process.nextTick(function() { fibonacci(n - 1, next); });
        },
    }, function(err, results) {
        callback(null, results.n1 + results.n2);
    });
}
fibonacci = async.memoize(fibonacci);
 */

app.get('/:n', function(req, res) {
    var number=fib(req.params.n);
    res.send(''+number);
});


app.listen(3000);