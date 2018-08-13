# Mathematical Optimization in JavaScript

[![Travis build](https://travis-ci.org/optimization-js/optimization-js.svg?branch=master&style=flat-square)](https://travis-ci.org/optimization-js/optimization-js)
[![Codecov branch](https://img.shields.io/codecov/c/github/optimization-js/optimization-js/master.svg?style=flat-square)](https://codecov.io/gh/optimization-js/optimization-js)
[![Inline docs](http://inch-ci.org/github/optimization-js/optimization-js.svg?branch=master&style=flat-square)](http://inch-ci.org/github/optimization-js/optimization-js)
[![npm](https://img.shields.io/npm/v/optimization-js.svg?style=flat-square)](https://www.npmjs.com/package/optimization-js)
[![npm](https://img.shields.io/npm/dw/optimization-js.svg?style=flat-square)](https://www.npmjs.com/package/optimization-js)
[![npm](https://img.shields.io/npm/dt/optimization-js.svg?style=flat-square)](https://www.npmjs.com/package/optimization-js)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![GitHub license](https://img.shields.io/github/license/optimization-js/optimization-js.svg?style=flat-square)](https://github.com/optimization-js/optimization-js/blob/master/LICENSE)

A javascript library implementing useful multivariate function optimization procedures, which allow to find a local minimum of some function of a vector argument. Such argument is a javascript array.

## Example

Example zero order optimization in JavaScript (no need to provide gradient information!):

```
 <script src="./optimization.js"></script>
 <script>
 
// objective that needs to be minimized
fnc = function (v) {
  var result = 0.0;
  for (var i = 0; i < v.length; i++){
    result = result + v[i] * v[i]
  }
  return result;
};

var x0 = [1.0, -1.0, 0.5, -0.5, 0.25, -0.25]; // a somewhat random initial vector

// Powell method can be applied to zero order unconstrained optimization
var solution = optimjs.minimize_Powell(fnc, x0);

</script>
```

For more examples, check out `examples` folder. 

## Usage

For use in browser, use this:
```
<script src="https://unpkg.com/optimization-js@latest/dist/optimization.js"></script>
```

In order to use this in node, use npm:
```bash
npm install optimization-js
```

## Documentation

Documentation is hosted on github pages here: [http://optimization-js.github.io/optimization-js/](http://optimization-js.github.io/optimization-js/).

## Available algorithms:

Gradient free:
* **Genetic optimization algorithms** Useful when your function takes as input arguments of 
mixed type, such as categorical and numerical values.  
* **Variation of Powell zero order minimization method.** Very useful method for prototyping. Typically works decently for problems with 100 - 1000 variables (vector argument size).

Requires gradient:
* **Limited memory Broyden–Fletcher–Goldfarb–Shanno method (L-BFGS).** Very popular and powerful minimization algorithm. Uses approximation to the Hessian based on recorded gradients over the last m function evaluations. Involves numerical division, and because of this can be unstable, so use at your own risk.
* **Vanilla gradient descent.** Performs gradient descent using user provided function and its gradient. Can be used instead of L-BFGS in case the latter is unstable on your problem.

See JavaScript files in `examples` folder for examples on how to use the algorithms.