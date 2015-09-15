A javascript library implementing useful multivariate function optimization procedures, which allow to find a local minimum of some function of a vector argument. Such argument is a javascript array. 

For example usage, see index.html.

Currently, implemented are:

**Simple version of the Powell zero order minimization method.** Very useful method for prototyping. Only requires that a function can be computed (derivative need not be provided!), and typically works fine for problems with 100 - 1000 variables (vector argument size). 

**Simple gradient descent.** Requires user to provide the gradient of the function in order to converge to the local minimum.

**L-BFGS** Very popular and powerful descent algorithm. Uses approximation to the Hessian based on recorded values of the gradient over the last m iterations. Involves numerical division, and because of this currently unstable (maybe a bug) so use at your own risk.