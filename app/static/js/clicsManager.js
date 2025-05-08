document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('downloadBoton').addEventListener('click', function() {
        download_function()
    });

    document.getElementById('d-desk').addEventListener('click', function() {
        download_function()
    });

    document.getElementById('uploadBoton').addEventListener('change', function(event) {
        upload_function(event)
    });

    document.getElementById('u-desk').addEventListener('change', function(event) {
        upload_function(event)
    });

    document.getElementById('exampleImageBoton').addEventListener('click', function(event) {
        example_image_function(event)
    });

    document.getElementById('exampleImageBoton-desk').addEventListener('click', function(event) {
        example_image_function(event)
    });

    window.addEventListener('click', function (event) {
        const excludeButton_desk = document.getElementById('exampleImageBoton-desk');
        const excludeButton = document.getElementById('exampleImageBoton');

        // Comprobar si el clic ocurrió dentro de alguno de los botones
        const clickedInsideButtons = 
            excludeButton_desk.contains(event.target) || 
            excludeButton.contains(event.target);

        if (!clickedInsideButtons) {
            const divExampleImages = document.getElementById('example_images');
            const parentDiv = divExampleImages.parentElement;

            if (parentDiv.style.display === 'block') {
                parentDiv.style.display = 'none';
            }
        }
        
    });

})

function download_function(params) {
    var divImagen = document.getElementById('results');
    var img = divImagen.querySelector('img');
    var selectModels = document.getElementById('modelSelect');
    var selectedModel = selectModels ? selectModels.value : 'default';

    if (img) {
        var url = img.src;
        var enlaceDescarga = document.createElement('a');
        enlaceDescarga.href = url;
        enlaceDescarga.download = selectedModel + '-gradcam-image.png'; // Nombre del archivo a descargar
        enlaceDescarga.textContent = 'Descargar Imagen';
        
        document.body.appendChild(enlaceDescarga);
        enlaceDescarga.click();
        
        document.body.removeChild(enlaceDescarga);
    } else {
        window.alert('There is no image to download.');
        console.log('There is no image to download.');
    }
}

function upload_function(event) {
    var archivo = event.target.files[0];
    var divImagen = document.getElementById('your_image');
    divImagen.innerHTML = ''; // Limpiar cualquier contenido previo
        
    if (archivo && archivo.type.match('image.*')) {
        var lector = new FileReader();
        lector.onload = function(eventoLector) {
            var contenido = eventoLector.target.result;
            
            // Crear un elemento de imagen y establecer su fuente al contenido del archivo
            var img = document.createElement('img');
            img.src = contenido;
            img.alt = 'Loaded image';
            
            // Agregar la imagen al div con id 'your_image'
            divImagen.appendChild(img);
        };
        
        lector.readAsDataURL(archivo);
    } else {
        console.log('No se seleccionó ningún archivo de imagen.');
    }
}

function example_image_function(params) {
    var divExampleImages = document.getElementById('example_images');
    var parentDiv = divExampleImages.parentElement;
    
    if (parentDiv.style.display == 'none' || parentDiv.style.display == '') {
        parentDiv.style.display = 'block';
    } else {
        parentDiv.style.display = 'none';
    }
    
    var exampleImages = [
        'static/img/cover_image.png',
        'static/img/stego_image.png',
        'static/img/985.png',
        'static/img/WOW-stego.png'
    ];

    var divExampleImages = document.getElementById('example_images');
    divExampleImages.innerHTML = '';
    
    exampleImages.forEach(function(src) {
        var imgContainer = document.createElement('div');
            imgContainer.classList.add('example-image-container');
            
        var img = document.createElement('img');
        img.src = src;
        img.alt = 'Example image';
        img.classList.add('img-fluid', 'mb-2');
        img.addEventListener('click', function() {
            var divImagen = document.getElementById('your_image');
            divImagen.innerHTML = ''; 
            var imgCargada = document.createElement('img');
            imgCargada.src = src;
            imgCargada.alt = 'Loaded image';
            parentDiv.style.display = 'none';
            divImagen.appendChild(imgCargada);
        });

        var label = document.createElement('div');
        label.classList.add('image-label');
        label.textContent = src.split('/').pop().replace(/\.[^/.]+$/, "");
        
        imgContainer.appendChild(img);
        imgContainer.appendChild(label);
        divExampleImages.appendChild(imgContainer);
    });
}
