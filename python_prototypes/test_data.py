"""
This script is used to test how 'complex' particular
dataset used for demos is, based on python tools.
"""

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline

from sklearn.svm import LinearSVC
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.dummy import DummyClassifier

import pandas as pd
import numpy as np

def read_dataset(years):
    Xy = pd.read_csv('python_prototypes/data/bankruptcy_after_'+str(years)+'_years.csv')
    Xy = Xy.replace('?', np.nan)
    Xy = Xy.fillna(0.0)
    Xy = Xy.as_matrix()

    X, y = Xy[:, :-1], Xy[:, -1]

    X = X.astype('float')
    y = y.astype('int')

    return X, y

X_train, X_test, y_train, y_test = train_test_split(*read_dataset(5), **{'random_state': 1})
#X_train, y_train = read_dataset(1)
#X_test, y_test = read_dataset(5)

gbrt = {
    'model': [GradientBoostingClassifier()],
    'model__n_estimators': [2 ** i for i in range(1, 10)]
}

lsvm = {
    'model': [LinearSVC(dual=False, max_iter=100000)],
    'model__C': [10.0 ** i for i in range(-6, 6)],
    'model__penalty': ['l1', 'l2']
}

knnc = {
    'model': [KNeighborsClassifier()],
    'model__n_neighbors': [i for i in range(1, 100, 5)]
}

model = GridSearchCV(
    estimator = Pipeline([
        ('scale', StandardScaler()),
        ('model', DummyClassifier())
    ]),
    param_grid = [lsvm],
    cv=5,
    n_jobs= -1,
    verbose=1
)

dummy = DummyClassifier(strategy='most_frequent')

model.fit(X_train, y_train)
dummy.fit(X_train, y_train)

print('Dummy accuracy:')
print(dummy.score(X_test, y_test))
print('Model score:')
print(model.score(X_test, y_test))