document.getElementById('botonDescargar').addEventListener('click', function() {
    // Contenido del archivo a descargar (puedes cambiar esto por el contenido real de tu archivo)
    var contenidoArchivo = 'Este es el contenido del archivo a descargar';

    // Crear un objeto Blob que contiene el contenido del archivo
    var blob = new Blob([contenidoArchivo], { type: 'text/plain' });

    // Crear un objeto URL que apunta al Blob
    var url = window.URL.createObjectURL(blob);

    // Crear un enlace <a> para la descarga
    var enlaceDescarga = document.createElement('a');
    enlaceDescarga.href = url;
    enlaceDescarga.download = 'archivo.txt'; // Nombre del archivo a descargar
    enlaceDescarga.textContent = 'Descargar Archivo';

    // Agregar el enlace al documento y simular un clic en él para iniciar la descarga
    document.body.appendChild(enlaceDescarga);
    enlaceDescarga.click();

    // Limpiar el objeto URL creado para liberar recursos
    window.URL.revokeObjectURL(url);
});

document.getElementById('inputArchivo').addEventListener('change', function(evento) {
    var archivo = evento.target.files[0];
    
    if (archivo) {
        var infoArchivo = document.getElementById('infoArchivo');
        var lector = new FileReader();

        var icono = obtenerIcono(archivo.type);
        var iconoElemento = document.createElement('img');
        iconoElemento.src = icono;
        infoArchivo.appendChild(iconoElemento);

        var nombreElemento = document.createElement('span');
        nombreElemento.textContent = archivo.name;
        infoArchivo.appendChild(nombreElemento);
        
        lector.onload = function(eventoLector) {
            var contenido = eventoLector.target.result;
            
            // Aquí puedes procesar el contenido del archivo utilizando SheetJS o cualquier otra biblioteca
            console.log(contenido);
        };
        
        lector.readAsBinaryString(archivo);
    } else {
        console.log('No se seleccionó ningún archivo.');
    }
});

function obtenerIcono(tipoArchivo) {

    var extPermitidas = /(.xlsx|.xlx|.svg)$/i;

    if (tipoArchivo in extPermitidas) {
        tipo = 'iconxlsx'
    }

    return 'src/static/images/'+tipo
}
