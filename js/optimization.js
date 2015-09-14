// optimjs stands for optimize javascript (duh :D)
var optimjs = (function (exports) {

    // export public members
    exports = exports || {};

    // ===================== data preprocessing ==========================

    exports.shuffleIndiciesOf = function (array) {
        var idx = [];
        for (var i = 0; i < array.length; i++) {
            idx.push(i);
        }
        for (var i = 0; i < array.length; i++) {
            var j = Math.floor(Math.random() * i);
            var tmp = idx[i];
            idx[i] = idx[j];
            idx[j] = tmp;
        }
        return idx;
    }

    exports.minimize = function (fnc, x0) {
        // fnc: function which takes array of size N as an input
        // x0: array or real numbers of size N; 
        // serves as initialization of algorithm.

        // solution is a struct, with fields:
        // argument: solution argument
        // fncvalue: function value at optimum

        // maximum absolute gradient magnitude
        var eps = 1e-2;

        var convergence = false;
        var x = x0.slice(); // make copy of initialization
        var alpha = 0.001; // scaling factor

        var pfx = Math.exp(10);
        var fx = fnc(x);
        var pidx = 1;
        while (!convergence) {

            var indicies = optimjs.shuffleIndiciesOf(x);

            convergence = true;

            for (var i = 0; i < indicies.length; i++) {

                x[indicies[i]] += 1e-6;
                var fxi = fnc(x);
                x[indicies[i]] -= 1e-6;
                var dx = (fxi - fx) / 1e-6;

                if (Math.abs(dx) > eps) {
                    convergence = false;
                }

                x[indicies[i]] = x[indicies[i]] - alpha * dx;
                fx = fnc(x);
                
            }

            // this automatically selects step size 
            if (pfx > fx) {
                    alpha = alpha * 1.1;
                }
                else
                {
                    alpha = alpha * 0.7;
                }
            pfx = fx;

            pidx--;
            if (pidx === 0) {
                pidx = 1;
                console.log(fx);
            }

        }

        var solution = {};
        solution.argument = x;
        solution.fncvalue = fx;

        return solution;

    };

    return exports;

})(typeof module != 'undefined' && module.exports);  // add exports to module.exports if in node.js
