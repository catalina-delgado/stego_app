from .imports import tf, keras, np, mpl, plt, cv2, BytesIO, Image
import base64
import requests
import os

class GradCAM():
    def __init__(self):
        super(GradCAM, self).__init__()
        os.environ["KERAS_BACKEND"] = "tensorflow"
        
    def get_img_array(self, img_url, size):
        try:
            response = requests.get(img_url)
            response.raise_for_status()  # Check if the request was successful
            image = Image.open(BytesIO(response.content))
            image_array = np.array(image)
            image = cv2.resize(image_array, size)
            if len(image.shape) == 2:  # Grayscale image
                image = np.expand_dims(image, axis=-1)
            image = np.expand_dims(image, axis=0)
            return image
        except Exception as e:
            print(f"Error loading image: {e}")
            return None
    
    def make_gradcam_heatmap(self, img_array, model, last_conv_layer_name, pred_index=None):
        grad_model = tf.keras.models.Model(
            [model.inputs], [model.get_layer(last_conv_layer_name).output, model.output]
        )
        
        with tf.GradientTape() as tape:
            last_conv_layer_output, preds = grad_model(img_array)
            if pred_index is None:
                pred_index = tf.argmax(preds[0])
            class_channel = preds[:, self.pred_index]
            
        grads = tape.gradient(class_channel, last_conv_layer_output)
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        last_conv_layer_output = last_conv_layer_output[0]
        heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)
        heatmap = tf.maximum(heatmap, 0) / tf.math.reduce_max(heatmap)
        return heatmap.numpy()
    
    def export_and_overlay_gradcam(self, img_array, heatmap, model_name, layer_name):
        heatmap = np.uint8(255 * heatmap)
        jet = mpl.colormaps["jet"]
        jet_colors = jet(np.arange(256))[:, :3]
        jet_heatmap = jet_colors[heatmap]
        
        jet_heatmap = keras.utils.array_to_img(jet_heatmap)
        jet_heatmap = jet_heatmap.resize((img_array.shape[1], img_array.shape[0]))
        jet_heatmap = keras.utils.img_to_array(jet_heatmap)
        
        superimposed_img = jet_heatmap * 0.4 + img_array
        superimposed_img = np.squeeze(superimposed_img, axis=0)  # deleted dim batch
        superimposed_img = keras.utils.array_to_img(superimposed_img)
        
        output_filename = f"gradcam_{model_name}_{layer_name}.png"
        buffered = BytesIO()
        superimposed_img.save(buffered, format="PNG")
        buffered.seek(0)
        
        image_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
        
        return image_base64

        
    def decode_predictions(self, preds):
        """
        Decodes the model predictions to convert indices into readable labels.

        Args:
            preds (numpy.ndarray): Model output, an array with class probabilities.
        Returns:
            list: List of tuples (class_id, label, probability).
        """
        class_labels = {0: "cover", 1: "stego"}
        # Get index with highest probability
        if len(preds.shape) == 1: 
            idx = int(np.argmax(preds)) 
            confidence = preds[idx]
        else:  
            idx = int(np.argmax(preds, axis=1)[0])  
            confidence = preds[0][idx]

        print("idx:", idx) 
        
        label = class_labels[idx]
        confidence = preds[0][idx]
        return [(idx, label, confidence)]
