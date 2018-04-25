"""Searches for optimal on average hyperparameters.
This works as follows:
1. all available benchmarks are split into training and testing parts
2. parameters of the algorithm are optimized on training part
3. the found best parameters of the algorithm are evaluated on the test set
"""

from bbob.tracks import ampgo

# algorithm whose hypers will be optimized
from ga import ga_minimize, rs_minimize

from algooptimizer import AgloObjective

from skopt.space import Real, Integer
from skopt import gp_minimize

obj = AgloObjective(rs_minimize, ampgo.problems)

# n_random_starts=10, tournament_fraction=0.2, mutation_rate=0.05

dims = [
    ['n_random_starts', Integer(1, 20)],
    ['mutation_rate', Real(1e-3, 1.0, prior='log-uniform')],
]

space = [v[1] for v in dims]

def point_to_dict(p):
    return  dict(zip([v[0] for v in dims], p))

def to_minimize(p):
    p = point_to_dict(p)
    v = obj(p)
    print(p, v)
    return v

mode = {'evaluate'}
best_p = None

if 'optimize' in mode:
    # optimization of optimization!
    sol = gp_minimize(to_minimize, space, n_calls=64)
    best_p = sol.x

    # convert to dictionary
    best_p = point_to_dict(best_p)

    print('!!!!!!!!!!Best point found thus far!!!!!!!!!!')
    print(best_p)
    print('fun = ', sol.fun)
    print('!!!!!!!!!!Best point found thus far!!!!!!!!!!')

if "evaluate" in mode:
    # test the performance on test set
    print(obj.evaluate(rs_minimize, best_p, mode='train'))
    print(obj.evaluate(rs_minimize, best_p, mode='test'))
