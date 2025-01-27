document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('playBoton').addEventListener('click', function() {
        const modelName = document.getElementById('modelSelect').value;
        fetch(`/api/generate_gradcam?model_name=${modelName}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                
                const modelPathElement = document.getElementById('prediction');
                const layerNameElement = document.getElementById('classPrediction');

                if (modelPathElement) modelPathElement.textContent = data.prediction;
                if (layerNameElement) layerNameElement.textContent = data.classprediction;
            
            })
            .catch(error => console.error('Error:', error));
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
