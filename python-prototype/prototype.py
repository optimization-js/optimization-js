from time import time
import numpy as np
from skopt.space import Real, Integer, Categorical
from scipy.optimize import OptimizeResult


class RandomOptimizer():
    def __init__(self, dimensions, tolerance=1e-3):
        self.dims = dimensions
        self.tol = tolerance
        self.result = OptimizeResult()
        self.result.x = None
        self.result.message = "No feasible solution found yet"
        self.result.fun = np.inf

    def next(self):
        return [d.rvs()[0] for d in self.dims]

    def tell(self, x, f_value, constraint_violation, f_grad, c_grad):
        if constraint_violation is None:
            constraint_violation = 0

        if self.result.fun > f_value and constraint_violation < self.tol:
            self.result.x = x
            self.result.message = None
            self.result.fun = f_value


def base_minimize(solver, function, dimensions, stopping_condition, x0=None,
                   constraint=None, function_gradient=None,
                   constraint_gradient=None, tolerance=1e-3):
    """
    Base minimization for different optimization algos
    """

    start_time = time()
    solver = solver(dimensions, tolerance)

    while time()-start_time<stopping_condition:
        p = solver.next()

        violation = None
        if constraint is not None:
            violation = constraint(p)

        f_grad = None
        if function_gradient is not None:
            f_grad = function_gradient(p)

        c_grad = None
        if constraint_gradient is not None:
            c_grad = constraint_gradient(p)

        f_value = function(p)

        solver.tell(p, f_value, violation, f_grad, c_grad)

    return solver.result


def random_minimize(*args, **kwargs):
    """
    No strategy like random strategy
    """

    return base_minimize(RandomOptimizer, *args, **kwargs)



