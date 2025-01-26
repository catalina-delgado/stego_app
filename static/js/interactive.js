var datosrecibidos;

    Plotly.newPlot('grafico-interactivo', [{
        x: [],
        y: [],
        type: 'line'
    }]);
    Plotly.newPlot('simulado', [{
        x: [],
        y: [],
        type: 'line',
        fill: 'tozeroy',
        fillcolor: 'rgba(0, 100, 80, 0.2)'        
    }]);
    Plotly.relayout('simulado', {
        height: 300,
        margin: {
            t: 20, // top margin
            b: 20  // bottom margin
          }
      });

    window.onload = function() {
        cargarDatos('/datos', 'grafico-interactivo');
        cargarCaracteristicas();
        cargarDatos('/underCurve', 'simulado', 'fill');
    };

    function cargarDatos(route, id) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', route, true);
    
        xhr.onload = function() {
            if (xhr.status == 200) {
                var data = xhr.responseText;
                guardarDatos(data);
                mostrarDatos(data, id);
            }
        };
        xhr.send();
    };

    function cargarCaracteristicas() {
        // Hacer la solicitud AJAX
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/caracteristicas', true);
    
        xhr.onload = function() {
            if (xhr.status == 200) {
                var data = xhr.responseText;
                guardarDatos(data);
                mostrarCaracteristicas(data);
                // console.log(data)
            }
        };
    
        xhr.send();
    };

    function guardarDatos(data) {
        datosrecibidos = data;
    }

    function mostrarDatos(datos, id) {
        datos = JSON.parse(datos);

        traceCurva ={
            x: [datos.deformacion],
            y: [datos.carga]
        }
        
        Plotly.update(id, traceCurva);
    }

    function mostrarCaracteristicas(datos) {
        datos = JSON.parse(datos);
        data = datos.data
        console.log(data);

        // Object.keys(): obtener un array con los nombres de las propiedades del objeto data
        var propiedades = Object.keys(data);

        // iterar sobre cada nombre de propiedad del objeto
        propiedades.forEach(function(propiedad) {
            
            var elementoLista = document.createElement('div');
            elementoLista.classList.add('row');
            elementoLista.classList.add('m-3');
            var p = document.createElement('p');
            var div1 = document.createElement('div');
            div1.classList.add('col');
            div1.classList.add('border');
            var div2 = document.createElement('div');
            div2.classList.add('col');
            div2.classList.add('border');
            var div3 = document.createElement('div');
            div3.classList.add('col');
            div3.classList.add('border');
            div3.textContent = "MPa";
            
            switch (propiedad) {
                
                case 'E':
                    p.textContent = "Módulo de Young"
                    div1.textContent = propiedad;
                    div2.textContent = data[propiedad];
                    break;

                case 'Sy':
                    p.textContent = "Esfuerzo de Fluencia"
                    div1.textContent = propiedad;
                    div2.textContent = Math.round(data[propiedad]*100)/100;
                    break;
            
                case 'Sf':
                    p.textContent = "Esfuerzo Último"
                    div1.textContent = propiedad;
                    div2.textContent = Math.round(data[propiedad]*100)/100;
                    break;

                case 'dL':
                    p.textContent = "Alargamiento"
                    div1.textContent = propiedad;
                    div2.textContent = Math.round(data[propiedad]*100)/100;
                    div3.textContent = "mm";
                    break;
            }
            
            elementoLista.appendChild(p);
            elementoLista.appendChild(div1);// columna 1
            elementoLista.appendChild(div2);// columna 2
            elementoLista.appendChild(div3);// columna 3

            document.getElementById('lista').appendChild(elementoLista);
        });
    }