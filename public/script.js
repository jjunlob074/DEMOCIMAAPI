let timer;
const inputNombre = document.getElementById('inputNombre');
const sugerenciasDiv = document.getElementById('sugerencias');
const resultadosDiv = document.getElementById('resultado');

// Función para limpiar las sugerencias
function limpiarSugerencias() {
    sugerenciasDiv.innerHTML = '';
}

// Función para realizar la búsqueda y mostrar resultados
function buscarMedicamento(nombre) {
    fetch(`/buscarMedicamento?nombre=${encodeURIComponent(nombre)}`)
        .then(response => response.json())
        .then(data => {
            const resultadosDiv = document.getElementById('resultado');
            resultadosDiv.innerHTML = ''; // Limpiar resultados anteriores

            if (data.resultados && data.resultados.length > 0) {
                data.resultados.forEach(medicamento => {
                    const medicamentoDiv = document.createElement('div');
                    medicamentoDiv.classList.add('medicamento');
                    const contenidoDiv = document.createElement('div');
                    contenidoDiv.classList.add('medicamento-content');

                    const nombre = document.createElement('h2');
                    nombre.textContent = medicamento.nombre;
                    contenidoDiv.appendChild(nombre);

                    const labTitular = document.createElement('p');
                    labTitular.textContent = `Laboratorio titular: ${medicamento.labtitular}`;
                    contenidoDiv.appendChild(labTitular);

                    const cpresc = document.createElement('p');
                    cpresc.textContent = `Prescripción: ${medicamento.cpresc}`;
                    contenidoDiv.appendChild(cpresc);

                    // Añadiendo más información relevante
                    const comercializado = document.createElement('p');
                    comercializado.textContent = `Comercializado: ${medicamento.comerc ? "Sí" : "No"}`;
                    contenidoDiv.appendChild(comercializado);

                    const necesitaReceta = document.createElement('p');
                    necesitaReceta.textContent = `Necesita receta: ${medicamento.receta ? "Sí" : "No"}`;
                    contenidoDiv.appendChild(necesitaReceta);

                    const viaAdministracion = document.createElement('p');
                    viaAdministracion.textContent = `Vía de administración: ${medicamento.viasAdministracion.map(via => via.nombre).join(", ")}`;
                    contenidoDiv.appendChild(viaAdministracion);

                    const formaFarmaceutica = document.createElement('p');
                    formaFarmaceutica.textContent = `Forma farmacéutica: ${medicamento.formaFarmaceutica.nombre}`;
                    contenidoDiv.appendChild(formaFarmaceutica);
                    
                    // Crear el contenedor de botones
                    const botonesDiv = document.createElement('div');
                    botonesDiv.classList.add('botones-contenedor');

                    // Enlaces a documentos
                    const enlaceFT = document.createElement('a');
                    enlaceFT.href = medicamento.docs[0]?.url || '#';
                    enlaceFT.textContent = 'Ficha Técnica PDF';
                    enlaceFT.target = '_blank';
                    botonesDiv.appendChild(enlaceFT);

                    const enlaceHTML = document.createElement('a');
                    enlaceHTML.href = medicamento.docs[0]?.urlHtml || '#';
                    enlaceHTML.textContent = 'Web Ficha Técnica';
                    enlaceHTML.target = '_blank';
                    enlaceHTML.style.marginLeft = '10px';
                    botonesDiv.appendChild(enlaceHTML);

                    // Imágenes del medicamento
                    const imgContainerDiv = document.createElement('div');
                    imgContainerDiv.classList.add('medicamento-img-container');
                    // Suponiendo que el medicamento tiene imágenes
                    if (medicamento.fotos && medicamento.fotos.length > 0) {
                        medicamento.fotos.forEach(foto => {
                            const img = document.createElement('img');
                            img.src = foto.url;
                            img.alt = "Imagen del medicamento";
                            imgContainerDiv.appendChild(img);
                        });
                    }
                    // Construcción del render
                    contenidoDiv.appendChild(botonesDiv);
                    medicamentoDiv.appendChild(contenidoDiv);
                    medicamentoDiv.appendChild(imgContainerDiv);
                    // RENDER PRINCIPAL
                    resultadosDiv.appendChild(medicamentoDiv);
                });
            } else {
                resultadosDiv.innerHTML = '<p>No se encontraron resultados.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultadosDiv.innerHTML = `<p>Ha ocurrido un error en la búsqueda</p>`;
        });
}

// Evento para manejar las sugerencias en tiempo real
inputNombre.addEventListener('input', function() {
    clearTimeout(timer); // Cancelar el temporizador anterior
    const valor = this.value;

    timer = setTimeout(() => {
        if (valor) {
            fetch(`/buscarMedicamento?nombre=${encodeURIComponent(valor)}`)
                .then(response => response.json())
                .then(data => {
                    sugerenciasDiv.innerHTML = ''; // Limpiar sugerencias anteriores
                    if (data.resultados && data.resultados.length > 0) {
                        data.resultados.forEach(medicamento => {
                            const p = document.createElement('p');
                            p.textContent = medicamento.nombre;
                            p.addEventListener('click', () => {
                                inputNombre.value = medicamento.nombre; // Rellenar input al clicar sugerencia
                                buscarMedicamento(medicamento.nombre); // Realizar búsqueda con el nombre seleccionado
                                limpiarSugerencias(); // Limpiar sugerencias
                            });
                            sugerenciasDiv.appendChild(p);
                        });
                    } else {
                        sugerenciasDiv.innerHTML = '<p>No se encontraron resultados.</p>';
                    }
                })
                .catch(error => console.error('Error:', error));
        } else {
            limpiarSugerencias(); // Limpiar si el input está vacío
        }
    }, 500);
});

// Evento para manejar la búsqueda al hacer clic en el botón "Buscar"
document.getElementById('buscarBtn').addEventListener('click', function() {
    const nombre = inputNombre.value;
    buscarMedicamento(nombre); // Utilizar la función de búsqueda
    limpiarSugerencias(); // Limpiar sugerencias después de la búsqueda
});
