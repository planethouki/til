import numpy as np

def softmax(a):
    c = np.max(a)
    exp_a = np.exp(a-c) # against overflow
    sum_exp_a = np.sum(np.exp(a-c))
    y = exp_a / sum_exp_a
    return y

print(softmax(np.array([1010, 1000, 990])))
