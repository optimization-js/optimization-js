# Python prototypes

Python has some excellent packages for optimization, such as scipy.optimize. In this folder, prototypes for some algorithms are first developed in python, in order to compare them with existing software. Then these algorithms are translated into JavaScript implementation. 

This is done with intent to produce algorithms which have a good "average" empirical performance. In particular, a basic baseline to compare to is random exploration algorithm; An algorithm should significantly outperform such simplistic approach.

In the above paragraph significant means that the confidence intervals for objective value found by algorithm should not overlap with interval of random algorithm, and the mean found objective for the algorithm should be better than those of random.

## Examples

See `ga.py` for example prototype; See `evaluate.py` to see how to use benchmark and how to compare different methods.

After you run the evaluation script, you will have `data.csv` file, with confidence intervals for objectives for your method. You can copy the column of this csv file corresponding to the name of the function that implements your method into `comparison.csv`, and then you can use the function `get_average_ranking('comparison.csv')` from `bbop` package to compare your algorithm to others. Lower value for your algorithm is better. So the code could be:

```python
from bbob.evaluation import get_average_ranking
get_average_ranking('comparison.csv')
```

See also `compare.py`.

## Benchmarking results with other existing methods

Currently, [optimization-js](https://github.com/optimization-js/optimization-js/) 
supports two variants of genetic optimization algorithm, that can be used for
black box optimization with variables of mixed type. 
A range of algorithms from python ecosystem were used for comparison, as well as 
the set of testing objective functions from `evalset` package, maintained by SigOpt.
For evaluation procedure details, please see [here](https://github.com/iaroslav-ai/scikit-optimize-benchmarks#how-performance-is-calculated).
The performance of an algorithm is measured by its average rank on all optimization problems;
That is, performance of 3.0 means that relative to other algorithms, the algorithm
is typically outperformed by some other 2 algorithms. The average rank can be fractional,
as different algorithms can perform different on different problems.

The results are given below. Results in bold are for the algorithms in this library.

| Algorithm | Rank |
| --------- |------| 
| [gpyopt_minimize](https://github.com/SheffieldML/GPyOpt) | 1.47 |
| [gp_minimize](https://github.com/scikit-optimize/scikit-optimize)| 2.31 |
| [forest_minimize](https://github.com/scikit-optimize/scikit-optimize)| 2.31 |
| [**rs_minimise**](https://github.com/optimization-js/optimization-js/blob/64c7ff7c39471dde9cce09e8bf9735770829d305/python_prototypes/ga.py#L161)| **2.41**|
| [gbrt_minimize](https://github.com/scikit-optimize/scikit-optimize)| 3.57 |
| [**ga_minimize**](https://github.com/optimization-js/optimization-js/blob/64c7ff7c39471dde9cce09e8bf9735770829d305/python_prototypes/ga.py#L12)| **3.78**|
| [smac_minimize](https://github.com/automl/SMAC3)| 4.26 |
| [hyperopt_minimize](https://github.com/hyperopt/hyperopt)| 4.42 |
| random exploration | 6.42 |

**Note**: An interesting observation is that model - free methods such as 
`rs_minimize` could actually be
quite competitive. This is especially useful in cases where evaluation of 
objective is much cheaper than estimation of next point using e.g. Gaussian Process.
Determining next point in `rs_minimize` takes microseconds at most, and hence can be
used in such situation to explore much more points per unit of time, which typically
leads to comparable or even better objective than with BO.

Another scenario where this could be useful is when many evaluations of objective
are necessary to reach optimum solution, as methods like `rs_minimize` scale easily,
and are straightforward to parallelize. 

To reproduce, see `evaluate.py` and `compare.py`.

## How to set up everything necessary for this code to work

* You need Python3.5 installed on your system (this is a version that this code is tested with)

* If you use Visual Code to run python, configure the use of correct python (3.5) if you by default the proper version does not run. To check this, ensure that the following script raises an error:

```python
print "hello"
```

If it does not, consider this : https://stackoverflow.com/questions/43313903/how-to-setup-visual-studio-code-to-find-python-3-interpreter-in-windows-10 .

* Install python packages: Scikit-Optimize, Pandas, https://github.com/iaroslav-ai/scikit-optimize-benchmarks and https://github.com/sigopt/evalset.git .

For evalset for example you can install it using 

```bash 
pip3 install https://github.com/sigopt/evalset/archive/master.zip
```

Alternatively, you can clone the repository, navigate to the repository in terminal, and run 

```bash
pip3 install -e .
```

In the latter version you can easier edit the code.
Here is example bash code to install everything:
```bash
git clone https://github.com/iaroslav-ai/scikit-optimize-benchmarks.git
cd scikit-optimize-benchmarks
pip3 install -e .
cd ..
pip3 install https://github.com/sigopt/evalset/archive/master.zip
```

* You should be good to go!