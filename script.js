// script.js
// Archivo base para el laboratorio.
// NO deben modificar el HTML ni el CSS, solo trabajar aquí.

// API pública: JSONPlaceholder
// Documentación: https://jsonplaceholder.typicode.com/ (solo lectura)
// Ejemplo de endpoint que usaremos:
//   https://jsonplaceholder.typicode.com/posts?userId=1

// Paso 1: Referencias a elementos del DOM (ya tienes los IDs definidos en index.html).
const postForm = document.getElementById("postForm");
const userIdInput = document.getElementById("userIdInput");
const rememberUserCheckbox = document.getElementById("rememberUser");
const statusArea = document.getElementById("statusArea");
const postsList = document.getElementById("postsList");
const clearResultsBtn = document.getElementById("clearResultsBtn");

// Claves para localStorage
const LAST_USER_ID_KEY = "lab_fetch_last_user_id";
const POSTS_DATA_KEY = "lab_fetch_posts_data";
const LAST_User_Local = localStorage.getItem(LAST_USER_ID_KEY);

document.addEventListener("DOMContentLoaded", function () { 
    // Manejar submit del formulario de búsqueda
    postForm.addEventListener("submit", function (ev) {
        ev.preventDefault();

        const id = userIdInput.value.trim();
        const idNum = Number(id);
        if(id.length > 0 || id.length < 11 && rememberUserCheckbox.checked) {
            localStorage.setItem(LAST_USER_ID_KEY, id);
            userIdInput.textContent = id;
            userIdInput.value = "";
        }
        else{
            userIdInput.textContent = LAST_User_Local;
        }
        fetchPostsByUserId(idNum);
    });


});

window.addEventListener("DOMContentLoaded", function () {
    const lastId = localStorage.getItem(LAST_USER_ID_KEY);
    if (lastId) {
        userIdInput.value = lastId;
        rememberUserCheckbox.checked = true;
    }
    loadSavedPosts();
});

/**
 * @param {Array} posts - arreglo de objetos { id, userId, title, body }
 */
function renderPosts(posts) {
    postsList.innerHTML = "";

    if (!Array.isArray(posts) || posts.length === 0) {
        statusArea.textContent = "Aún no se ha hecho ninguna petición.";
        return;
    }

    posts.forEach((post) => {
        const li = document.createElement("li");
        li.classList.add("post-item");

        const title = document.createElement("h3");
        title.classList.add("post-title");
        title.textContent = post.title || "(sin título)";

        const body = document.createElement("p");
        body.classList.add("post-body");
        body.textContent = post.body || "";

        li.appendChild(title);
        li.appendChild(body);
        postsList.appendChild(li);
    });

    try {
        localStorage.setItem(POSTS_DATA_KEY, JSON.stringify(posts));
        statusArea.textContent = ` Mostrando ${posts.length} publicaciones.`;
    } catch (err) {
        console.error("Error guardando posts en localStorage", err);
    }
}

clearResultsBtn.addEventListener("click", function () {
    postsList.innerHTML = "";
    localStorage.removeItem(POSTS_DATA_KEY);
    statusArea.textContent = "Aún no se ha hecho ninguna petición.";
    statusArea.style.color = "";
});

function loadSavedPosts() {
    const data = localStorage.getItem(POSTS_DATA_KEY);
    if (!data) {
        statusArea.textContent = "Aún no se ha hecho ninguna petición.";
        return;
    }

    try {
        const posts = JSON.parse(data);
        if (Array.isArray(posts) && posts.length > 0) {
            renderPosts(posts);
            statusArea.textContent = "Cargados los posts guardados en localStorage.";
        } else {
            
            postsList.innerHTML = "";
            statusArea.textContent = "No hay posts guardados.";
        }
    } catch (err) {
        console.error("Error al parsear posts guardados:", err);
     
        localStorage.removeItem(POSTS_DATA_KEY);
        postsList.innerHTML = "";
        statusArea.textContent = "No hay posts guardados (datos corruptos limpiados).";
    }
}



async function fetchPostsByUserId(userId) {
    const URL = `https://jsonplaceholder.typicode.com/posts?userId=${userId}`;
    const response = await fetch(URL);
    const posts = await response.json();
    statusArea.textContent = " Cargando posts...";
   try {
    if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
    }
    if (Array.isArray(posts) && posts.length > 0) {
        renderPosts(posts);
        statusArea.textContent = ` Se obtuvieron ${posts.length} posts del usuario ${userId}.`;
    }
    else {
        postsList.innerHTML = "";
        statusArea.textContent = ` No se encontraron posts para el usuario ${userId}.`;
        localStorage.removeItem(POSTS_DATA_KEY);
    }
}
    catch (error) {
        console.error("Error al obtener los posts:", error);
        statusArea.textContent = `Error al obtener los posts: ${error.message}`;

    }
}
// TODO 1:
// Al cargar la página:
// - Leer de localStorage el último userId usado (si existe) y colocarlo en el input.
//   Si hay valor, marcar el checkbox "rememberUser".
// - Leer de localStorage los posts guardados (si existen) y mostrarlos en la lista.
//   Si hay posts guardados, actualizar el área de estado indicando que se cargaron desde localStorage.
// Pista: window.addEventListener("DOMContentLoaded", ...)

// TODO 2:
// Manejar el evento "submit" del formulario.
// - Prevenir el comportamiento por defecto.
// - Leer el valor de userId.
// - Validar que esté entre 1 y 10 (o mostrar mensaje de error).
// - Actualizar el área de estado a "Cargando..." con una clase de loading.
// - Llamar a una función que haga la petición fetch a la API.

// TODO 3:
// Implementar una función async que reciba el userId y:
// - Arme la URL: https://jsonplaceholder.typicode.com/posts?userId=VALOR
// - Use fetch para hacer la petición GET.
// - Valide que la respuesta sea ok (response.ok).
// - Convierta la respuesta a JSON.
// - Actualice el área de estado a "Éxito" o similar.
// - Muestre los resultados en la lista usando otra función (ver TODO 4).
// - Maneje errores (try/catch) y muestre mensaje de error en statusArea.

// TODO 4:
// Crear una función que reciba un arreglo de publicaciones y:
// - Limpie cualquier resultado previo en postsList.
// - Para cada post, cree un <li> con clase "post-item".
// - Dentro agregue un título (h3 o p con clase "post-title") y el cuerpo (p con clase "post-body").
// - Inserte los elementos en el DOM.
// - IMPORTANTE: Después de mostrar los posts, guardarlos en localStorage usando la clave POSTS_DATA_KEY.
//   Recuerda que localStorage solo guarda strings, así que usa JSON.stringify() para convertir el arreglo.

// TODO 5:
// Si el checkbox "rememberUser" está marcado cuando se hace una consulta
// exitosa, guardar el userId en localStorage. Si no, limpiar ese valor.

// TODO 6:
// Agregar un evento al botón "Limpiar resultados" que:
// - Vacíe la lista de publicaciones.
// - Restablezca el mensaje de estado a "Aún no se ha hecho ninguna petición."
// - Elimine los posts guardados en localStorage (usando la clave POSTS_DATA_KEY).
