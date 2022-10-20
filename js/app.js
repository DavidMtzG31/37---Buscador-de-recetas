
document.addEventListener('DOMContentLoaded', iniciarApp);

function iniciarApp() {

    const selectCategorias = document.querySelector('#categorias');
    selectCategorias.addEventListener('change', seleccionarCategoria);

    const resultadoHTML = document.querySelector('#resultado');

    const modal = new bootstrap.Modal('#modal', {});

    obtenerCategorias();

    function obtenerCategorias() {
        const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';
        fetch( url )
            .then( respuesta => respuesta.json() )
            .then (resultado => mostrarCategorias(resultado.categories) )
    }

    function mostrarCategorias(categorias) {

        categorias.forEach(categoria => {

            const { strCategory } = categoria;

            const option = document.createElement('OPTION');

            option.value = strCategory;

            option.textContent = strCategory;

            selectCategorias.appendChild(option);

        });

    }

    function seleccionarCategoria() {

        const categoria = selectCategorias.value;

        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`;

        fetch(url)
            .then( respuesta => respuesta.json() )
            .then( resultado => mostrarRecetas(resultado.meals))
    }

    function mostrarRecetas(resultado) {

        const heading = document.createElement('H2');
        heading.classList.add('text-center', 'text-black')

        limpiarHTML(resultadoHTML);

        // Iterar en los resultados
        resultado.forEach(receta => {

            const { idMeal, strMeal, strMealThumb } = receta;

            // Heading de Resultados
            const heading = document.createElement('H2');
            heading.classList.add('text-center', 'text-black', 'my-5');
            

            // Div por cada receta disponible
            const recetaContenedor = document.createElement('DIV');
            recetaContenedor.classList.add('col-md-4');

            // Card para cada receta
            const recetaCard = document.createElement('DIV');
            recetaCard.classList.add('card', 'mb-4');

            // IMG para cada imagen de receta
            const recetaImagen = document.createElement('IMG');
            recetaImagen.classList.add('card-img-top');
            recetaImagen.alt = `Imagen de la receta ${strMeal}`;
            recetaImagen.src = strMealThumb;

            // Div para el cuerpo del card
            const recetaCardBody = document.createElement('DIV');
            recetaCardBody.classList.add('card-body');

            // Heading del título de la receta
            const recetaHeading = document.createElement('H3');
            recetaHeading.classList.add('card-title', 'mb-3');
            recetaHeading.textContent = strMeal;

            // Botón
            const recetaButton = document.createElement('BUTTON');
            recetaButton.classList.add('btn', 'btn-danger', 'w-100');
            recetaButton.textContent = 'Ver Receta';
            // Para la ventana modal
            // recetaButton.dataset.bsTarget = "#modal";
            // recetaButton.dataset.bsToggle = "modal";
            recetaButton.onclick = function() {
                seleccionarReceta(idMeal);
            }
            
            // Inyectar todo al HTML
            recetaCardBody.appendChild(recetaHeading);
            recetaCardBody.appendChild(recetaButton);

            recetaCard.appendChild(recetaImagen);
            recetaCard.appendChild(recetaCardBody);

            recetaContenedor.appendChild(recetaCard);

            resultadoHTML.appendChild(recetaContenedor);

            // Jerarquía de como ir acomodando cada elemento

            // recetaContenedor
            //     .card
            //         Img 
            //         .card-body
            //             h3
            //             button

        });  // Termina ForEach
    }

    function seleccionarReceta(id) {
        const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

        fetch( url) 
            .then( respuesta => respuesta.json() )
            .then( resultado => mostrarRecetaModal(resultado.meals[0]) )
    }

    function mostrarRecetaModal(receta) {
        const {idMeal, strInstructions , strMeal , strMealThumb } = receta;

        // Añadir contenido al Modal
        const modalTitle = document.querySelector('.modal .modal-title');
        const modalBody = document.querySelector('.modal .modal-body');

        // Muestra la información de la receta en el modal
        modalTitle.textContent = strMeal;
        modalBody.innerHTML = `
            <img class="img-fluid" src="${strMealThumb}" alt="receta ${strMeal}"/>
            <h3 class="my-3"> Preparación </h3>
            <p> ${strInstructions} </p>
            <h3 class="my-3"> Ingredientes </h3>
        `;

        const listGroup = document.createElement('UL');
        listGroup.classList.add('list-group');

        // Mostrar cantidades e ingredientes
        for(let i = 1 ; i<=20 ; i++) {
             if(receta[`strIngredient${i}`]) {
                const ingrediente = receta[`strIngredient${i}`];
                const cantidad = receta[`strMeasure${i}`];

                const ingredienteLi = document.createElement('LI');
                ingredienteLi.classList.add('list-group-item');
                ingredienteLi.textContent = `${ingrediente} - ${cantidad}`;

                listGroup.appendChild(ingredienteLi);
             }
        }

        modalBody.appendChild(listGroup);

        // Botones del modal
        const modalFooter = document.querySelector('.modal-footer');
        limpiarHTML(modalFooter);

        const btnFav = document.createElement('BUTTON');
        btnFav.classList.add('btn', 'btn-danger', 'col');
        btnFav.textContent = 'Añadir a Favorito';

        const btnCerrar = document.createElement('BUTTON');
        btnCerrar.classList.add('btn', 'btn-secondary', 'col');
        btnCerrar.textContent = 'Cerrar';
        btnCerrar.onclick = function() {
            modal.hide();
        }

        modalFooter.appendChild(btnFav);
        modalFooter.appendChild(btnCerrar);



        // Muestra el modal
        modal.show();
    }

    function limpiarHTML(selector) {
        while(selector.firstChild) {
            selector.removeChild(selector.firstChild);
        }
    }

}