
from skopt.benchmarks import branin

# helper functions for evaluation of genetic algo
from bbob.evaluation import parallel_evaluate, calculate_metrics, get_average_ranking

import pandas as pd

import os
path = os.path.dirname(os.path.realpath(__file__))
csv_path = os.path.join(path, 'comparison.csv')


class AlgoWrapper():
    def __init__(self, fnc, params):
        self.params = params
        self.fnc = fnc
        self.__name__ = fnc.__name__
    
    def __call__(self, obj, dims, n_calls):
        return self.fnc(obj, dims, n_calls, **self.params)

class AgloObjective():
    def __init__(self, fnc, tasks):
        self.fnc = fnc

        self.partitions = {
            'train': [], 
            'test': []
        }

        for i in range(len(tasks)):
            partition = self.partitions['test'] if i % 3 == 0 else self.partitions['train']
            partition.append(tasks[i])
    
    def evaluate(self, fnc, params=None, mode="train"):
        partition = self.partitions[mode]

        if params is not None:
            wrapper = AlgoWrapper(fnc, params)        
        else:
            wrapper = fnc

        r = parallel_evaluate(
            solvers=[wrapper],
            task_subset=partition,  # set to None to evaluate on all tasks
            n_reps=128, # number of repetitions
            eval_kwargs={'n_calls': 64},
            joblib_kwargs={'n_jobs': -1, 'verbose': 10}
        )

        p = calculate_metrics(r) # returns pandas dataframe
        
        # load the dataframe with existing results
        df = pd.read_csv(csv_path)

        # get the names of the functions that were actually used.
        # it is assumed that these functions are present in the 
        # loaded csv as well.
        names = [f.__name__ for f in partition]
        df = df.set_index('Unnamed: 0')

        # select only the names of tasks in partition
        df = df.loc[names]

        # insert found results
        df[fnc.__name__] = p[fnc.__name__]
        
        # drop index for proper compatibility with get_average_ranking function
        df = df.reset_index()

        rankings = get_average_ranking(df)
        thisranking = rankings[fnc.__name__]

        # want to minimize ranking. Less ranking means more performant algorithm
        obj = thisranking / len(rankings)
        
        print('rankings:', rankings)
        print('objective:', thisranking)

        return obj
    
    def __call__(self, p):
        return self.evaluate(self.fnc, p)
