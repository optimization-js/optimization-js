A javascript library implementing useful multivariate function optimization procedures, which allow to find a local minimum of some function of a vector argument. Such argument is a javascript array. 

For example usage, see index.html.

Currently, implemented are:

**Variation of Powell zero order minimization method.** Very useful method for prototyping. Only requires that a function can be computed (derivative need not be provided!), and typically works fine for problems with 100 - 1000 variables (vector argument size). 

**Limited memory Broyden–Fletcher–Goldfarb–Shanno method (L-BFGS).** Very popular and powerful descent algorithm. Uses approximation to the Hessian based on recorded values of the gradient over the last m iterations. Involves numerical division, and because of this currently unstable (maybe a bug) so use at your own risk.

**Gradient descent.** Performs gradient descent using user provided function and it gradient. Can be used instead of L-BFGS in case the latter is unstable on your problem.

**Stochastic gradient descent.** Very efficient for data fitting problems, and thus widely used with huge datasets for L2 regression or neural network training. Requires that optimization objective can be written as f(w) = \sum_{i \in [n]} g(w).

