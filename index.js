document.addEventListener("DOMContentLoaded", function () {
    const contentElement = document.getElementById("content");
    const languageSelect = document.getElementById("language-select");
    let typeTimeout;

    // Función para cargar el archivo JSON
    function loadJSON(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
        const fullUrl = url + '?timestamp=' + new Date().getTime();
        xhr.open('GET', fullUrl, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                callback(JSON.parse(xhr.responseText));
            } else if (xhr.readyState === 4) {
                console.error('Error al cargar el archivo JSON:', xhr.status, xhr.statusText);
            }
        };
        xhr.send(null);
    }

    // Función para actualizar el contenido según el idioma seleccionado
    function updateContent(content) {
        const typewriterElement = document.getElementById("typewriter");
        let index = 0;
        const text = content.tituloWriter;
        const velocidad = 150;

        /*IDIOMAS*/
        const esLvl = 100;
        const enLvl = 80;
        const itLvl = 20;

        contentElement.innerHTML = `
            <table border="1" style="border-collapse: collapse;">
                <tr><th>Saludo</th><th>Despedida</th></tr>
                <tr><td>${content.saludo} ${languageSelect.options[languageSelect.selectedIndex].text}</td><td>${content.despedida}</td></tr>
            </table>`;

        document.getElementById('separator-1').innerHTML = `<span>${content.quiensoy}</span><p>${content.texto1}</p>`;
        document.getElementById('paragraph-1').innerHTML = content.parrafo1;
        document.getElementById('paragraph-2').innerHTML = content.parrafo2;
        document.getElementById('paragraph-3').innerHTML = content.parrafo3;
        typewriterElement.innerHTML = '';
        document.querySelector('#proyectos').innerHTML = content.proyectos;
        document.querySelector('#idiomas').innerHTML = content.idiomas;

        /*Nivel de idiomas */
        document.querySelector('#es-bar .percentage').style.width = esLvl * 100 / 60 + '%';
        document.querySelector('#en-bar .percentage').style.width = enLvl * 100 / 60 + '%';
        document.querySelector('#it-bar .percentage').style.width = itLvl * 100 / 60 + '%';

        if (typeTimeout) {
            clearTimeout(typeTimeout);
        }

        function type() {
            if (index < text.length) {
                typewriterElement.innerHTML += text[index];
                index++;
                typeTimeout = setTimeout(type, velocidad);
            } else {
                typeTimeout = setTimeout(() => {
                    index = 0;
                    typewriterElement.innerHTML = '';
                    typeTimeout = setTimeout(type, velocidad);
                }, 5000);
            }
        }

        type();
    }

    function saveLanguageSelection(language) {
        localStorage.setItem('selectedLanguage', language);
    }

    function loadLanguageSelection() {
        return localStorage.getItem('selectedLanguage');
    }

    // Carga inicial del archivo JSON
    loadJSON('indice.json', function (paths) {
        function loadContent() {
            loadJSON(paths[languageSelect.value], function (content) {
                updateContent(content);
            });
        }

        // Establece el idioma seleccionado desde el localStorage si existe
        const savedLanguage = loadLanguageSelection();
        if (savedLanguage && languageSelect.querySelector(`option[value="${savedLanguage}"]`)) {
            languageSelect.value = savedLanguage;
        }

        loadContent();

        languageSelect.addEventListener("change", function () {
            saveLanguageSelection(languageSelect.value);
            loadContent();
        });
    });
});