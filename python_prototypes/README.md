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


## how to set up everything necessary for this code to work

* You need Python3.5 installed on your system (A version which is tested to work)

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