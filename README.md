A javascript library implementing useful multivariate function optimization procedures, which allow to find a local minimum of some function of a vector argument. Such argument is a javascript array. 

For example usage, see index.html.

Currently, implemented are:

**Modified version of the Powell zero order minimization method.** Very useful method for prototyping. Only requires that a function can be computed (derivative need not be provided!), and typically works fine for problems with 100 - 1000 variables (vector argument size). 