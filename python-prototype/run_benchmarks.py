import numpy as np
from bbob.evaluation import parallel_evaluate, calculate_metrics
from bbob.tracks import ampgo
from prototype import random_minimize


def evaluate_opt_alg(solver, problem, seed=0, stopping_criterion=10):
    np.random.seed(seed)
    fnc = problem()

    if hasattr(fnc, 'constraint'):
        constraint = fnc.constraint
    else:
        constraint = None

    res = solver(fnc, fnc.space, stopping_criterion, constraint)

    return res

r = parallel_evaluate(
    solvers=random_minimize,
    task_subset=ampgo,
    n_reps=32,
    eval_kwargs={'stopping_criterion': 0.25},
    joblib_kwargs={'n_jobs': -1, 'verbose': 10},
    eval_function=evaluate_opt_alg,
)
metrics = calculate_metrics(r)
metrics.to_csv('data.csv')