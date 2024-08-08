if (!isProduction) {
    const input = document.createElement('input');
    input.type = 'checkbox';
    document.body.insertAdjacentElement("afterbegin", input);
    const label = document.createElement('label');
    label.textContent = 'Modo desarrollo: ' + input.checked;
    input.insertAdjacentElement('afterend', label);

    input.addEventListener('change', () => {
        label.textContent = 'Modo desarrollo: ' + input.checked;
        if (input.checked) {
            document.querySelectorAll('*').forEach(el => {
                el.style.border = '1px solid red';
            });
        } else {
            document.querySelectorAll('*').forEach(el => {
                el.style.border = '';
            });
        }
    });
}

var buttonClose = document.querySelectorAll('marquee ~ button');

document.addEventListener("DOMContentLoaded", function () {
    // Botón para subir
    document.querySelector('#subir').addEventListener('click', (e) => {
        window.scrollTo(0, 0);
    });

    buttonClose.forEach((item) => {
        item.addEventListener('click', () => {
            item.previousElementSibling.classList.toggle('close');
            if (item.textContent.toLowerCase().includes('cerrar')) {
                item.textContent = 'Abrir lista';
            } else {
                item.textContent = 'Cerrar lista';
            }
        })
    })

    const contentElement = document.getElementById("content");
    const languageSelect = document.querySelector(".custom-select");
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

    /* IDIOMAS */
    const esLvl = 'C2';
    const enLvl = 'B2';
    const itLvl = 'A2';

    /**
     * 
     * @param {string} level Nivel de idioma
     * @description Devuelve el nivel de idioma en porcentaje de 60, siendo así 10% -> A1, 20% -> A2... 60% -> C2
     * @returns {number} Porcentaje de idioma sobre 60%
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
            default:
                return 0;
        }
    }
    
    /* Nivel de idiomas */
    document.querySelector('#es-bar .percentage').innerHTML += `<span class="extremo">${esLvl}</span>`;
    document.querySelector('#en-bar .percentage').innerHTML += `<span class="extremo">${enLvl}</span>`;
    document.querySelector('#it-bar .percentage').innerHTML += `<span class="extremo">${itLvl}</span>`;
    
    document.addEventListener('scroll', () => {
        if (window.scrollY >= 3400) {
            document.querySelector('#es-bar .percentage').style.width = operacion(esLvl) + '%';
            document.querySelector('#en-bar .percentage').style.width = operacion(enLvl) + '%';
            document.querySelector('#it-bar .percentage').style.width = operacion(itLvl) + '%';
        }
    })

    // Función para actualizar el contenido según el idioma seleccionado
    function updateContent(content) {
        
        let index = 0;
        const text = content.tituloWriter;
        const velocidad = 150;

        // Texto de los enlaces del menú
        document.querySelector('#ir').innerHTML = `${content.ir} <i class="bi bi-caret-down-fill select-arrow"></i`;
        document.querySelector('a[href="#separator-1"]').innerHTML = content.quiensoy;
        document.querySelector('a[href="#proyectos"]').innerHTML = content.proyectos.title;
        document.querySelector('a[href="#idiomas"]').innerHTML = content.idiomas;
        document.querySelector('a[href="#lenguajes"]').innerHTML = content.lenguajes;
        document.querySelector('a[href="#marcas"]').innerHTML = content.marcas;
        document.querySelector('a[href="#estilos"]').innerHTML = content.estilos;
        document.querySelector('a[href="#formaTitle"]').innerHTML = content.formaTitle.slice(0, -5);

        // Texto de los contenidos
        var sobre = document.getElementById('separator-1');
        sobre.innerHTML = `<img src="img/foto-perfil-recortada.png" alt="Nacho cubo">`;

        var divCont = document.createElement('div');

        var ini = document.createElement('span');
        ini.textContent = content.quiensoy;
        divCont.appendChild(ini);

        var lista = document.createElement('ul');
        content.descripcion.forEach(elem => {
            var listLi = document.createElement('li');
            listLi.textContent = elem;
            lista.appendChild(listLi);
        })
        divCont.appendChild(lista);
        
        var fraseCont = document.createElement('blockquote');
        
        var div = document.createElement('div');
        content.frase.forEach(item => {
            var frase = document.createElement('q');
            frase.textContent = item;
            console.log(item);
            div.appendChild(frase);
            fraseCont.appendChild(div);
        })
        var autor = document.createElement('p');
        autor.textContent = 'Ignacio Cubo';
        fraseCont.appendChild(autor);

        /* for (let i = 0; i < content.frase.length; i++) {
         if(i == content.frase.length - 1) {
           i = 0;
         }
        } */
        

        divCont.appendChild(fraseCont);

        sobre.appendChild(divCont);

        var coords = [];
        var notas = [];

        document.querySelectorAll('.punto').forEach((p) => {
            coords.push(p.getBoundingClientRect().y);
        });

        document.querySelectorAll('.right-content .nota').forEach((nota, index) => {
            //console.log('La nota ' + nota + ' con coordenada actual ' + nota.getBoundingClientRect().y + ' se establecerá a ' + coords[index]);
            let offsetY = coords[index] - nota.getBoundingClientRect().y;
            nota.style.transform = `translateY(${offsetY}px)`;
            notas.push(nota);
        });

        document.getElementById('paragraph-1').innerHTML = content.parrafo1;
        document.getElementById('paragraph-2').innerHTML = `<ul><li>${content.parrafo2}</li><li>${content.parrafo3}</li>`;
        document.getElementById('paragraph-tra-1').innerHTML = content.trabajo1;
        document.getElementById('paragraph-tra-2').innerHTML = `<ul><li>${content.trabajo2}</li><li>${content.trabajo3}</li>`;
        document.querySelector('#proyectos').innerHTML = content.proyectos.title;
        document.querySelector('#idiomas').innerHTML = content.idiomas;
        document.querySelectorAll('.idiomas h4')[0].innerHTML = content.español;
        document.querySelectorAll('.idiomas h4')[1].innerHTML = content.ingles;
        document.querySelectorAll('.idiomas h4')[2].innerHTML = content.italiano;
        document.querySelector('#formaTitle').innerHTML = content.formaTitle + ' <span id="typewriter" class="typewriter"></span>';
        document.querySelectorAll('.year-marker:last-child').forEach(elem => {
            elem.setAttribute('data-year', content.actualidad);
        })
        document.querySelector('#trabaTitle').innerHTML = content.trabaTitle;
        document.querySelector('#lenguajes').innerHTML = content.lenguajes;
        document.querySelector('#marcas').innerHTML = content.marcas;
        document.querySelector('#estilos').innerHTML = content.estilos;
        document.querySelector('#copy').innerHTML = '';
        document.querySelector('#copy').innerHTML += '<a href="https://github.com/nachocubo"><i class="bi bi-github"></i></a>&copy; Ignacio Cubo - ' + content.copy + ' ' + new Date().getFullYear();
        document.querySelectorAll('.soon').forEach(soon => {
            soon.innerHTML = content.proximamente;
        })

        /*
        *PROYECTOS
        */

        if (Object.keys(content.proyectos.collection).length == 0) {
            document.querySelector('.proy-div').innerHTML = `<p>${content.proximamente}</p>`;
        } else {
            document.querySelector('.proy-div').innerHTML = '';
            content.proyectos.collection.forEach((proy, index) => {
                document.querySelector('.proy-div').innerHTML +=
                    `<div class="proyecto">
                        <div class="proy">
                            <img src='./img/${proy.logo}' alt="${proy.title}"/>
                        </div>
                        <div class="oculta">
                            <span>${proy.description}</span>
                        </div>
                    </div>`;
            })
        }

        var proyecto = document.querySelectorAll('.proyecto');
        var isHovered = false;

        /**
         * 
         * @returns A random color
         */
        let color = () => {
            let letras = '0123456789ABCDEF';
            let res = '#';
            let cont = 0;

            while (cont < 6) {
                let rand = Math.floor(Math.random() * 16);
                res += letras[rand];
                cont++;
            }

            return res;
        }

        /**
         * Calculates the luminosity of a hex color
         * @param {string} hex - The hex color code
         * @returns {number} - The luminosity of the color
         */
        let getLuminosity = (hex) => {
            hex = hex.replace('#', '');
            let r = parseInt(hex.substring(0, 2), 16) / 255;
            let g = parseInt(hex.substring(2, 4), 16) / 255;
            let b = parseInt(hex.substring(4, 6), 16) / 255;

            let lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            return lum;
        }

        proyecto.forEach((proy, index) => {
            if (proy && proy.children[0]) {
                let bgColor = color();
                proy.style.backgroundColor = bgColor;

                // Check if color is very light
                if (getLuminosity(bgColor) > 0.7) {
                    proy.children[0].children[0].src = './img/logo_oscuro.png';
                    proy.children[1].children[0].style.color = 'black';
                }

                proy.addEventListener('click', () => {
                    window.open(content.proyectos.collection[index].URL, '_blank');
                });
            }
        })

        /*
        *Efecto escritura de titulo
        */

        const typewriterElement = document.getElementById("typewriter");
        typewriterElement.style.fontStyle = 'italic';
        typewriterElement.innerHTML = '';

        if (typeTimeout) {
            clearTimeout(typeTimeout);
        }

        function type() {
            //establece la altura minima del typewriter a la altura que debe tener como minimo de forma dinamica
            typewriterElement.style.minHeight = document.querySelector('header > h1').clientHeight + 'px';
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

    /* 
    * Dinamismo del lenguaje
    */

    function saveLanguageSelection(language) {
        localStorage.setItem('selectedLanguage', language);
    }

    function loadLanguageSelection() {
        return localStorage.getItem('selectedLanguage');
    }

    var customSelect = document.querySelector('.custom-select');
    var selected = customSelect.querySelector('.select-selected');
    var items = customSelect.querySelector('.select-items');
    var menu = document.querySelector('.menu .select-selected');

    selected.addEventListener('click', function () {
        items.classList.toggle('select-hide');
    });

    customSelect.querySelectorAll('.select-item').forEach(function (item) {
        item.addEventListener('click', function () {
            selected.innerHTML = item.innerHTML;
            selected.setAttribute('value', item.getAttribute('value'));
            items.classList.add('select-hide');
        });
    });

    menu.addEventListener('click', () => {
        let altura = 0;
        menu.nextElementSibling.children[0].childNodes.forEach(item => {
            //coge los nodos que no son text y su altura
            if (item.nodeType !== 3) {
                altura += item.clientHeight;
            }
        })
        //cont + 1 sirve para corregir la altura de la lista ya que uno de los nodos tiene mayor altura
        menu.nextElementSibling.children[0].style.height = altura + 'px';
    })

    document.addEventListener('click', (e) => {
        const dropdown = menu.nextElementSibling.children[0];

        if (dropdown.style.height !== '0px') {
            if (!e.target.classList.contains('selected') && e.target !== menu) {
                dropdown.style.height = '0';
            }
        }
    })

    document.addEventListener('click', function (event) {
        if (!customSelect.contains(event.target)) {
            items.classList.add('select-hide');
        }
    });

    // Carga inicial del archivo JSON
    loadJSON('indice.json', function (paths) {
        function loadContent() {
            loadJSON(paths[selected.getAttribute('value')], function (content) {
                updateContent(content);
            });
        }

        // Establece el idioma seleccionado desde el localStorage si existe
        const savedLanguage = loadLanguageSelection();
        if (savedLanguage) {
            const item = Array.from(languageSelect.querySelectorAll('.select-item')).find(item => item.getAttribute('value') === savedLanguage);
            if (item) {
                item.click();
            }
        }

        loadContent();

        languageSelect.querySelectorAll('.select-item').forEach(item => {
            item.addEventListener('click', function () {
                saveLanguageSelection(item.getAttribute('value'));
                loadContent();
            });
        });
    });
});