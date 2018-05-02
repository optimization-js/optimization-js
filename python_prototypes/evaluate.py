"""This script can be used to compare different 
algorithms between each other."""

from skopt.benchmarks import branin

# helper functions for evaluation of genetic algo
from bbob.evaluation import parallel_evaluate, plot_results, calculate_metrics, get_average_ranking
from bbob.tracks import ampgo

from ga import ga_minimize, rs_minimize
from skopt import dummy_minimize

r = parallel_evaluate(
    solvers=[dummy_minimize, rs_minimize],
    task_subset=ampgo,  # set to None to evaluate on all tasks
    n_reps=8, # number of repetitions
    eval_kwargs={'n_calls': 64},
    joblib_kwargs={'n_jobs': 1, 'verbose': 10})

p = calculate_metrics(r) # returns pandas dataframe
p.to_csv('data.csv')
print(get_average_ranking('data.csv'))
#plot_results(r)
