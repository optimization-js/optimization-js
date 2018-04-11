# Unconstrained, first and zero order gradient descent in JavaScript

A javascript library implementing useful multivariate function optimization procedures, which allow to find a local minimum of some function of a vector argument. Such argument is a javascript array. 

## Example usage

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

For a more detailed example of least squares regression, see `index.html`. 

## Available algorithms:

* **Variation of Powell zero order minimization method.** Very useful method for prototyping. Only requires that a function can be computed (derivative need not be provided!), and typically works fine for problems with 100 - 1000 variables (vector argument size). 
* **Limited memory Broyden–Fletcher–Goldfarb–Shanno method (L-BFGS).** Very popular and powerful minimization algorithm. Uses approximation to the Hessian based on recorded gradients over the last m function evaluations. Involves numerical division, and because of this can be unstable, so use at your own risk.
* **Vanilla gradient descent.** Performs gradient descent using user provided function and its gradient. Can be used instead of L-BFGS in case the latter is unstable on your problem.
* **Stochastic gradient descent.** Efficient for finding local minimum of optimization problems involving objective function of the form f(w) = ∑ <sub>i ∈ [n]</sub> g<sub>i</sub>(w). For such objectives, gradient is estimated with a subset of the sum, where such subset is seleted randomly at every iteration. Such method is widely used for predictive modelling with large datasets.

