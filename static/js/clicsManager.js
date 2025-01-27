document.addEventListener('DOMContentLoaded', function() {
    // document.getElementById('downloadBoton').addEventListener('click', function() {
    //     // Contenido del archivo a descargar (puedes cambiar esto por el contenido real de tu archivo)
    //     var contenidoArchivo = 'Este es el contenido del archivo a descargar';

    //     // Crear un objeto Blob que contiene el contenido del archivo
    //     var blob = new Blob([contenidoArchivo], { type: 'text/plain' });

    //     // Crear un objeto URL que apunta al Blob
    //     var url = window.URL.createObjectURL(blob);

    //     // Crear un enlace <a> para la descarga
    //     var enlaceDescarga = document.createElement('a');
    //     enlaceDescarga.href = url;
    //     enlaceDescarga.download = 'archivo.txt'; // Nombre del archivo a descargar
    //     enlaceDescarga.textContent = 'Descargar Archivo';

    //     // Agregar el enlace al documento y simular un clic en él para iniciar la descarga
    //     document.body.appendChild(enlaceDescarga);
    //     enlaceDescarga.click();

    //     // Limpiar el objeto URL creado para liberar recursos
    //     window.URL.revokeObjectURL(url);
    // });

    document.getElementById('uploadBoton').addEventListener('change', function(event) {
        var archivo = evento.target.files[0];
        
        if (archivo && archivo.type.match('image.*')) {
            var lector = new FileReader();
            lector.onload = function(eventoLector) {
                var contenido = eventoLector.target.result;
                
                // Crear un elemento de imagen y establecer su fuente al contenido del archivo
                var img = document.createElement('img');
                img.src = contenido;
                img.alt = 'Loaded image';
                
                // Agregar la imagen al div con id 'your_image'
                var divImagen = document.getElementById('your_image');
                divImagen.innerHTML = ''; // Limpiar cualquier contenido previo
                divImagen.appendChild(img);
            };
            
            lector.readAsDataURL(archivo);
        } else {
            console.log('No se seleccionó ningún archivo de imagen.');
        }
    });

    document.getElementById('exampleImageBoton').addEventListener('click', function(event) {
        var divExampleImages = document.getElementById('example_images');
        var parentDiv = divExampleImages.parentElement;
        if (parentDiv.style.display === 'none' || parentDiv.style.display === '') {
            parentDiv.style.display = 'block';
        } else {
            parentDiv.style.display = 'none';
        }
        
        var exampleImages = [
            'static/img/cover image.png',
            'static/img/stego image.png',
            'static/img/985.png'
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
    });
})

function obtenerIcono(tipoArchivo) {

    var extPermitidas = /(.jpg|.png|.pgm)$/i;

    if (tipoArchivo in extPermitidas) {
        tipo = 'iconxlsx'
    }

    return 'src/static/images/'+tipo
}
