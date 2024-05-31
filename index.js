document.addEventListener("DOMContentLoaded", function () {
    //boton para subir
    document.querySelector('#subir').addEventListener('click', (e) => {
        window.scrollTo(0, 0);
    });

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
        typewriterElement.style.fontStyle = 'italic';
        let index = 0;
        const text = content.tituloWriter;
        const velocidad = 150;

        /*IDIOMAS*/
        const esLvl = 'C2';
        const enLvl = 'B2';
        const itLvl = 'A2';

        /**
         * 
         * @param {number} level Nivel de idioma
         * @description Devuelve el nivel de idioma en porcentaje de 60, siendo así 10% -> A1, 20 -> A2... 60% -> C2
         * @returns Porcentaje de idioma sobre 60%
         */

        function operacion(level) {
            switch (level) {
                case "A1":
                    return 1 / 6 * 100;
                case "A2":
                    return 2 / 6 * 100;
                case "B1":
                    return 3 / 6 * 100;
                case "B2":
                    return 4 / 6 * 100;
                case "C1":
                    return 5 / 6 * 100;
                case "C2":
                    return 6 / 6 * 100;
            }
        }

        //Texto de los enlaces del menú
        document.querySelector('a[href="#separator-1"]').innerHTML = content.quiensoy;
        document.querySelector('a[href="#proyectos"]').innerHTML = content.proyectos;
        document.querySelector('a[href="#idiomas"]').innerHTML = content.idiomas;
        document.querySelector('a[href="#formaTitle"]').innerHTML = content.formaTitle.slice(0, -5);

        //Texto de los contenidos
        document.getElementById('separator-1').innerHTML = `<span>${content.quiensoy}</span><p>${content.texto1}</p>`;
        document.getElementById('paragraph-1').innerHTML = '1. ' + content.parrafo1;
        document.getElementById('paragraph-2').innerHTML = '2. ' + content.parrafo2;
        document.getElementById('paragraph-3').innerHTML = '3. ' + content.parrafo3;
        typewriterElement.innerHTML = '';
        document.querySelector('#proyectos').innerHTML = content.proyectos;
        document.querySelector('#idiomas').innerHTML = content.idiomas;
        document.querySelector('#formaTitle').innerHTML = content.formaTitle;
        document.querySelector('.year-marker:last-child').setAttribute('data-year', content.actualidad);

        /*Nivel de idiomas */
        document.querySelector('#es-bar .percentage').style.width = operacion(esLvl) + '%';
        document.querySelector('#es-bar .percentage').outerHTML += `<span class="extremo">${esLvl}</span>`;
        document.querySelector('#en-bar .percentage').style.width = operacion(enLvl) + '%';
        document.querySelector('#en-bar .percentage').outerHTML += `<span class="extremo">${enLvl}</span>`;
        document.querySelector('#it-bar .percentage').style.width = operacion(itLvl) + '%';
        document.querySelector('#it-bar .percentage').outerHTML += `<span class="extremo">${itLvl}</span>`;

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