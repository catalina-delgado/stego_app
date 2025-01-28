import numpy as np
import matplotlib as mpl
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import backend as K

from tfkan.layers import DenseKAN

import shap

from io import BytesIO
from PIL import Image