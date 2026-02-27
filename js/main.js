const imagesConJS = async ( )=> {
    
    const respuesta = await fetch('./js/imagenes.json');
    const datos = await respuesta.json();
    console.log(datos.imagenes);
        

    mostrarProyectos(datos.imagenes);
    
};

function mostrarProyectos(imagenes) {
    const sesion = document.querySelector(".sesion-proyectos"); 
    
    const contenedorproyectos = document.createElement("div");
    contenedorproyectos.className = 'contenedor-proyectos';
    sesion.appendChild(contenedorproyectos)
   

    imagenes.forEach((proyecto) => {

        
        const proyecto1 = document.createElement("div");
        proyecto1.className = 'proyecto-1';
        contenedorproyectos.appendChild(proyecto1)

        const imagenproyecto1 = document.createElement("div");
        imagenproyecto1.className = `imagen-proyecto${proyecto.id}`;
        proyecto1.appendChild(imagenproyecto1)
        
        const contenidoproyecto = document.createElement("div");
        contenidoproyecto.className = "contenido-proyecto";
        proyecto1.appendChild(contenidoproyecto)

        



        contenidoproyecto.innerHTML = `
            <div class="titulo-proyecto"><h2>${proyecto.titulo}</h2></div>
            <div class="parrafo-proyecto"><p>${proyecto.descripcion}</p></div>
            <div class="tecnologias-proyecto"></div>

        `;

         let tecno = contenidoproyecto.querySelector(".tecnologias-proyecto")

         
         
         let buttos = document.createElement("div")
         buttos.className = ("botonesProyecto")
         contenidoproyecto.appendChild(buttos)
         
         let verptoyecto = document.createElement("a")
         verptoyecto.href =proyecto.linkVerCodigo
         verptoyecto.textContent = "Ver codigo"
         verptoyecto.className = ("ver-codigo")
        // opcional: abrir en nueva pestaña
         verptoyecto.target = "_blank";

         // opcional: seguridad
         verptoyecto.rel = "noopener noreferrer";
         buttos.appendChild(verptoyecto)


         let verPry = document.createElement("a")
         verPry.href =proyecto.link
         verPry.textContent = "Ver proyecto"
         verPry.className = ("ver-proyecto")
         // opcional: abrir en nueva pestaña
         verPry.target = "_blank";

         // opcional: seguridad
         verPry.rel = "noopener noreferrer";
         buttos.appendChild(verPry)


            proyecto.tecnologias.forEach((tecnologias) =>{
                let  tecnolog =  document.createElement("span")
                tecnolog.className = "herramts"
                tecnolog.textContent = tecnologias;
                tecno.appendChild(tecnolog)
            })
         


    });
}


document.addEventListener("DOMContentLoaded", function() {
    const gmail = document.querySelector(".gmail");
    if (gmail) {
        gmail.addEventListener("click", function (event) {
            event.preventDefault();

            const copiarGmail = "canoanderson201@gmail.com";

            navigator.clipboard.writeText(copiarGmail).then(() => {
                let toast = document.querySelector(".toast");
                
                if (toast) {
                    toast.classList.add("show");

                    setTimeout(() => {
                        toast.classList.remove("show");
                    }, 1500);
                }

                console.log("Correo copiado correctamente ✅");
            }).catch(err => {
                console.error("Error al copiar:", err);
            });
        });
    } else {
        console.error("No se encontró el elemento .gmail");
    }

});

imagesConJS();




















const menuItems = document.querySelectorAll('.menu-item');
const lightning = document.querySelector('.lightning');

menuItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        menuItems.forEach(nav => nav.classList.remove('active'));
        
        this.classList.add('active');
        
        if (lightning) {
            this.appendChild(lightning);
        }
    });
});

document.addEventListener('mouseleave', function(e) {
    if (!document.querySelector('header').contains(e.target)) {
        menuItems.forEach(nav => nav.classList.remove('active'));
        const inicioItem = menuItems[0];
        inicioItem.classList.add('active');
        if (lightning) {
            inicioItem.appendChild(lightning);
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;
    const links = document.querySelectorAll('.menu a');
    
    links.forEach((link, index) => {
        if (link.getAttribute('href') === currentPage || 
            (currentPage.includes('index.html') && index === 0)) {
            menuItems.forEach(nav => nav.classList.remove('active'));
            menuItems[index].classList.add('active');
            if (lightning) {
                menuItems[index].appendChild(lightning);
            }
        }
    });
});

