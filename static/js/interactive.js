document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('modelSelect').addEventListener('change', function() {
        const imageElement = document.getElementById('your_image');
        const imageSrc = imageElement && imageElement.firstElementChild ? imageElement.firstElementChild.src : '';
        console.log('src image',imageSrc);

        const modelName = document.getElementById('modelSelect').value;

        if (!imageSrc) {
            alert('Please upload an image');
            return;
        }

        try {
            new URL(imageSrc);
        } catch (_) {
            alert('Invalid image URL');
            return;
        }

        const loader = document.getElementById('loader');
        loader.style.display = 'block';

        fetch(`/api/generate_gradcam?model_name=${modelName}&image_src=${encodeURIComponent(imageSrc)}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                
                const modelPathElement = document.getElementById('prediction');
                const layerNameElement = document.getElementById('classPrediction');

                modelPathElement.textContent = '-% ' + (data.prediction * 100).toFixed(2);
                if (layerNameElement) layerNameElement.textContent = data.class_prediction;

                if (data.image) {
                    const ImageContiner = document.getElementById('results');
                    ImageContiner.innerHTML = ''; 
                    var imgCargada = document.createElement('img');
                    imgCargada.src = `data:image/png;base64,${data.image}`;
                    imgCargada.alt = 'gradcam image';
                    ImageContiner.appendChild(imgCargada);
                    
                }

                loader.style.display = 'none';
            
            })
            .catch(error => {
                console.error('Error:', error);
                loader.style.display = 'none'
            });
    });

    fetch('/api/models')
        .then(response => response.json())
        .then(models => {
            const modelSelect = document.getElementById('modelSelect');
            models.forEach(model => {
                if (model.endsWith('.hdf5')) {
                    const option = document.createElement('option');
                    const modelName = model.split('/').pop().replace('.hdf5', '');
                    option.value = modelName;
                    option.textContent = modelName;
                    modelSelect.appendChild(option);
                }
            });
        })
        .catch(error => console.error('Error:', error));
});
