from .imports import tf, K
from .kerascam import GradCAM
from .layers.transformer import Transformer
from .layers.cnn import SEBlock
from .layers.swint import ReshapeLayer, PatchEmbedding, PatchMerging, SwinTBlock, PPMConcat
import os

class Map(GradCAM):
    def __init__(self, model_name, imageSrc):
        self.model_name = model_name
        self.imageSrc = imageSrc
        self.input_image = self.get_img_array(self.imageSrc, (256, 256))
        self.pred_index = 1
        
    @staticmethod
    def __Tanh3(x):
        T3 = 3
        tanh3 = K.tanh(x)*T3
        return tanh3

    def generate_gradcam(self):
        model_path = os.path.join(os.path.dirname(__file__), 'models', f"{self.model_name}.hdf5")
        
        if self.model_name == "CVT":
            layer_name = 'conv2d_27'
            model = tf.keras.models.load_model(model_path, custom_objects={
                '__Tanh3':self.__Tanh3,
                'transformer':Transformer
            })
        if self.model_name == "SwintBlocks":
            layer_name = 'conv2d_4'
            model = tf.keras.models.load_model(model_path, custom_objects={
                '__Tanh3':self.__Tanh3,
                'SEBlock':SEBlock,
                'ReshapeLayer':ReshapeLayer,
                'PatchEmbedding':PatchEmbedding,
                'PatchMerging':PatchMerging,
                'SwinTBlock':SwinTBlock,
                'PPMConcat':PPMConcat
            }) 
        
        
        # Print what the top predicted class is
        if isinstance(self.input_image, type(None)):
            return {
                "error": "Error loading image"
            }
        preds = model.predict(self.input_image)
        print("Predicted:", self.decode_predictions(preds)) 
        
        gradcam = self.make_gradcam_heatmap(self.input_image, model, layer_name)  
        image_base64 = self.export_and_overlay_gradcam(self.imageSrc, gradcam, self.model_name, layer_name)
        
        return {
            "model_name": self.model_name,
            "layer_name": layer_name,
            "prediction": float(preds[0][self.pred_index]),
            "class_prediction": self.decode_predictions(preds)[0][1],
            "image": image_base64
        }
