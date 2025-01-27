from .imports import tf, K
from .kerascam import GradCAM
from .layers.transformer import Transformer
import os

class Map(GradCAM):
    def __init__(self, model_name, imageSrc):
        self.model_name = model_name
        self.imageSrc = imageSrc
        print(imageSrc) 
        self.input_image = self.get_img_array(self.imageSrc, (256, 256))
        self.pred_index = 1

    def __Tanh3(self, x):
        T3 = 3
        tanh3 = K.tanh(x)*T3
        return tanh3

    def generate_gradcam(self):
        model_path = os.path.join(os.path.dirname(__file__), 'models', f"{self.model_name}.hdf5")
        print(model_path)
        
        if self.model_name == "cvt":
            layer_name = 'conv2d_27'
            model = tf.keras.models.load_model(model_path, custom_objects={
                '__Tanh3':self.__Tanh3,
                'transformer':Transformer
                })
        
        # Print what the top predicted class is
        preds = model.predict(self.input_image)
        print("Predicted:", self.decode_predictions(preds)) 
        
        gradcam = self.make_gradcam_heatmap(self.input_image, model, layer_name, pred_index=self.pred_index)  
        image_base64 = self.export_and_overlay_gradcam(self.input_image, gradcam, self.model_name, layer_name)
        
        return {
            "model_name": self.model_name,
            "layer_name": layer_name,
            "prediction": float(preds[0][self.pred_index]),
            "class_prediction": self.decode_predictions(preds)[0][1],
            "image": image_base64
        }
