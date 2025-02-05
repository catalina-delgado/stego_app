document.addEventListener('DOMContentLoaded', function() {
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    const csrftoken = getCookie('csrftoken');

    function handleModelSelectChange() {
        const imageElement = document.getElementById('your_image');
        imageSrc = imageElement && imageElement.firstElementChild ? imageElement.firstElementChild.src : '';
        const modelCode = document.getElementById('modelSelect').value;

        console.log(imageSrc);
        if (!imageSrc) {
            alert('Please upload an image');
            return;
        }
        
        const loader = document.getElementById('loader');
        loader.style.display = 'flex';

        // Objeto FormData
        const formData = new FormData();
        formData.append('image', imageSrc);
        
        if (modelCode=='modelo1') {
            URL = 'https://apistegoinference.azurewebsites.net/routers/predict-cvt'
        }
        else {
            URL = 'https://apistegoinference.azurewebsites.net/routers/predict-swint'
        }
        
        fetch(URL, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': csrftoken,
                'Accept': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);

            const modelPathElement = document.getElementById('prediction');
            const layerNameElement = document.getElementById('classPrediction');

            modelPathElement.textContent = '% ' + (data.prediction_percentage * 100).toFixed(2);
            if (layerNameElement) layerNameElement.textContent = '- ' + data.predicted_class;

            if (data.predicted_class == 'cover') {
                layerNameElement.classList.remove('stego');
                layerNameElement.classList.add('cover');
            }else{
                layerNameElement.classList.add('cover');
                layerNameElement.classList.add('stego');
            }

            if (data.image) {
                const ImageContiner = document.getElementById('results');
                ImageContiner.innerHTML = '';
                var imgCargada = document.createElement('img');
                imgCargada.src = `data:image/png;base64,${data.image}`;
                ImageContiner.appendChild(imgCargada);
            }

            loader.style.display = 'none';
        })
        .catch(error => {
            console.error('Error:', error);
            loader.style.display = 'none';
        });
    }

    document.getElementById('modelSelect').addEventListener('change', handleModelSelectChange);
    document.getElementById('playBoton').addEventListener('click', function () {
        valueSelect = document.getElementById('modelSelect').value
        if (valueSelect != "") {
            handleModelSelectChange()
        }else {
            alert('Please select a model to do the inference');
        }
    });
    document.getElementById('playBoton-desk').addEventListener('click', function () {
        valueSelect = document.getElementById('modelSelect').value
        if (valueSelect != "") {
            handleModelSelectChange()
        }else {
            alert('Please select a model to do the inference');
        }
    });
});
