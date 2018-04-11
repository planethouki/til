import sys, os
sys.path.append('./ref')
from dataset.mnist import load_mnist
import numpy as np
from PIL import Image

(x_train, t_train), (x_test, t_test) = \
    load_mnist(flatten=True, normalize=False)

print(x_train.shape)
print(t_train.shape)
print(x_test.shape)
print(t_test.shape)

def img_show(img):
    pil_img = Image.fromarray(np.uint8(img))
    pil_img.show()

img = x_train[0]
label = t_train[0]
print(label) # 5

print(img.shape) # (784,)
img = img.reshape(28,28)
print(img.shape) # (28, 28)

img_show(img)
