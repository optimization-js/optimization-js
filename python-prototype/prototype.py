from time import time
import numpy as np
from skopt.space import Real, Integer, Categorical
from scipy.optimize import OptimizeResult

def gen_minimize_1(function, dimensions, stopping_condition, x0=None,
                   constraint=None, function_gradient=None,
                   constraint_gradient=None, tolerance=1e-3):
    """
    A first iteration of intelligent general purpose optimization algorithm.
    """

    start_time = time()

    best_obj = np.inf
    best_violation = np.inf
    best_x = None
    failure = True
    message = "Failed to satisfy constraints"
    idx  = 0

    while time()-start_time<stopping_condition:
        idx += 1

        x = [d.rvs()[0] for d in dimensions]
        obj = function(x)

        if constraint is not None:
            violation = constraint(x)
        else:
            violation = 0.0

        if violation > tolerance:
            continue

        if obj < best_obj:
            best_obj = obj
            best_violation = violation
            best_x = x
            failure = False
            message = ""

    result = OptimizeResult()
    result.x = best_x
    result.message = message
    result.fun = best_obj

    return result






