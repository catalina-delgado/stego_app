# Stego App - User Interface
**Stego App** is a web application designed to detect steganographic noise (hidden information) in grayscale images using state-of-the-art deep learning models.

This interface allows users to upload images, receive real-time predictions, and visualize attention heatmaps via Grad-CAM.


## Networks Available
Several deep learning models oriented to steganographic noise detection have been proposed, trained and validated using the BossBase 1.01 dataset for `Cover` vs `Stego` image classification.

**Stego App** includes the models:

- Capsnet
- Transformer
- KAN
- R-SIT

Details of Capsnet, Transformer and KAN networks, preprocessing and training can be found [here](https://github.com/catalina-delgado/Capsule-Transformer-KAN-in-Steganalysis).

Details of the R-SIT network, its architecture and training, can be found [here](https://github.com/catalina-delgado/R-SIT-Net).

The artifacts of each model and input data are managed through the [Inference API](https://github.com/catalina-delgado/InferenceAPI)