document.addEventListener("DOMContentLoaded", function() {
    const contentElement = document.getElementById("content");
    const languageSelect = document.getElementById("language-select");

    // Función para cargar el archivo JSON
    function loadJSON(url, callback) {   
        const xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
        // Añadimos un timestamp para evitar la caché del navegador
        const fullUrl = url + '?timestamp=' + new Date().getTime();
        xhr.open('GET', fullUrl, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback(JSON.parse(xhr.responseText));
                } else {
                    console.error('Error al cargar el archivo JSON:', xhr.status, xhr.statusText);
                }
            }
        };
        xhr.send(null);  
    }

    // Función para actualizar el contenido según el idioma seleccionado
    function updateContent(content) {
        contentElement.innerHTML = `
            <table border="1" style="border-collapse:collapse;">
                <tr><th>Saludo</th><th>Despedida</th></tr>
                <tr><td>${content.saludo} ${languageSelect[languageSelect.selectedIndex].innerText}</td><td>${content.despedida}</td></tr>
            </table>`;
    }

    // Llama a loadJSON() para cargar el contenido inicial desde el archivo JSON
    loadJSON('indice.json', function(paths) {
        // Llama a loadJSON() para cargar el contenido en el idioma seleccionado
        loadJSON(paths[languageSelect.value], function(content) {
            // Llama a updateContent() cuando cambia el valor de la lista desplegable
            languageSelect.addEventListener("change", function() {
                loadJSON(paths[languageSelect.value], function(content) {
                    console.log(content);
                    updateContent(content);
                });
            });

            // Actualiza el contenido inicialmente al cargar la página
            updateContent(content);
        });
    });

    const text = document.querySelector('.typewriter').innerText;
    const typewriterElement = document.getElementById("typewriter");
    let index = 0;
    typewriterElement.textContent = '';

    function type() {
        if (index < text.length) {
            typewriterElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, 100);
        } else {
            setTimeout(() => {
                index = 0;
                typewriterElement.textContent = '';
                setTimeout(type, 100);
            }, 10000);
        }
    }

    type();
});