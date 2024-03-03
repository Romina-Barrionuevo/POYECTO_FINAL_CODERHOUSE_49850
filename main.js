//funcion constructora productos
class producto {
    constructor (id, nombre, autor, precio, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.autor = autor;
    this.precio = precio;
    this.imagen = imagen;
  }};

// array productos

let productos = []; // = [
 /*   {
        id: 1,
        nombre: "Sobrenatural",
        autor: "Joe Dispenza",
        precio: 27000,
        imagen: "./img/sobrenatural.png"
         
     },
     {
        id: 2,
        nombre: "El placebo eres tú",
        autor: "Joe Dispenza",
        precio: 27250,
        imagen: "./img/elplaceboerestu.png"
     },
     {
        id: 3,
        nombre: "Deja de ser tú",
        autor: "Joe Dispenza",
        precio: 28000,
        imagen: "./img/dejadesertu.png"
     },
     {
        id: 4,
        nombre: "Metafisica Vol.I",
        autor: "Conny Mendez",
        precio: 12000,
        imagen: "./img/metafisicavol1.png"
     },
     {
        id: 5,
        nombre: "Metafisica Vol.II",
        autor: "Conny Mendez",
        precio: 12000,
        imagen: "./img/metafisicavol2.png"
     },
     {
        id: 6,
        nombre: "Metafisica Vol.III",
        autor: "Conny Mendez",
        precio: 13000,
        imagen: "./img/metafisicavol3.png"
     },
     {
        id: 7,
        nombre: "Felicidad",
        autor: "Osho",
        precio: 12000,
        imagen: "./img/felicidad.png"
     },
     {
        id: 8,
        nombre: "Creatividad",
        autor: "Osho",
        precio: 12000,
        imagen: "./img/creatividad.png"
     }
];
*/

const ingresarProductosAlArray = async () => {
  try {
    const response = await fetch("./productos.json");
    const data = await response.json();
    productos = data;//lleno el array con el json que simula base de datos para luego mostrarlo en el dom
    crearProducto(productos);
  } catch (error) {
    console.log(error);
  }
  };

//funcion para crear card e insertarla en html desde el array creado con json y funcion filtrar

const contenedor = document.getElementById("contenedor");
const buscarInput = document.getElementById("buscarInput");
const noEncontrado = document.getElementById("noEncontrado");

const crearProducto = (lista) =>{

 contenedor.innerHTML = "";

  if (lista.length === 0) {
    noEncontrado.style.display = "block";
  } else {
    lista.forEach((producto,indice) => {
      let card = document.createElement("div");
      card.classList.add("col-sm-12","col-lg-3", "mb-3");
      card.innerHTML = ` <div class="card" >
      <img src="${producto.imagen}" class="card-img-top" alt="...">
      <div class="card-body">
        <h5 class="card-title">${producto.nombre}</h5>
        <h6 class="card-title">${producto.autor}</h6>
        <p class="card-text">$${producto.precio}</p>
        <a  class="btn btn-primary" id="boton" onClick="agregarNotificar(${producto.id - 1})">Agregar al Carrito</a>
      </div>
      </div>`;
      contenedor.appendChild(card);
    });
    noEncontrado.style.display = "none";
  }
};

function filtrar() {
  const buscar = buscarInput.value.toLowerCase();
  const productosFiltrados = productos.filter((productos) => productos.nombre.toLowerCase().startsWith(buscar));

  crearProducto(productosFiltrados);
  
};

ingresarProductosAlArray(productos);

buscarInput.addEventListener("input", filtrar);

const notificacion = () => {
    Toastify({
        text: "Producto Agregado",
        className: "info",
        style: {
          //background: "linear-gradient(to right, #e93973, #a52d55)",
          background: "linear-gradient(to right, #e93973, #430058)",
        }
      }).showToast();
};

const agregarNotificar = (indice) => {
    agregarAlCarrito(indice);
    notificacion(indice);
};

let carrito=[]; //carrito

//funcion para validar si esta el producto en carrito suma cantidad, sino que lo agregue y lo inserte 
const agregarAlCarrito = (indice) =>{
    const indiceEncontradoCarrito = carrito.findIndex((elemento)=>{
        return elemento.id === productos[indice].id
    });
    console.log( productos[indice].id);
    if(indiceEncontradoCarrito === -1){ // si el producto no lo encontro pq no lo agregue antes, que lo agregue al carrito
        const productoAgregar = productos[indice]
        productoAgregar.cantidad = 1;// agrego propiedad cantidad al objeto y arranca en 1
        carrito.push(productoAgregar); // lo agrego al carrito
        crearCarrito();
    }else{
    carrito[indiceEncontradoCarrito].cantidad +=1;
        crearCarrito();
    }

    // Luego de modificar el carrito, guardarlo en localStorage
    guardarCarritoEnLocalStorage();
};

// funcion para crear carrito con productos agregados y sobtotal
let total = 0;
let bannerCarrito = document.getElementById("carrito");

const crearCarrito = ()=>{
    bannerCarrito.className = "carrito";//clase carrito
    bannerCarrito.innerHTML = "";//para que se borre y se vuelva a mostrar c lo nuevo
    if(carrito.length > 0){
        carrito.forEach((producto,indice) => {
           // total = total + producto.precio * producto.cantidad;
            const carritoContainer = document.createElement("div");
            carritoContainer.className = "producto-carrito"; //clase productos carrito
            carritoContainer.innerHTML =`
            <img class="car-img" src=" ${producto.imagen}"/>
            <div class= "product-details"> ${producto.nombre}</div>
            <div class= "product-details">Cantidad: ${producto.cantidad}</div>
            <div class= "product-details">Precio: $ ${producto.precio}</div>
            <div class= "product-details">Subtotal: $ ${producto.precio * producto.cantidad}</div>
            <button class="btn btn-info" id="remove-product" onClick="eliiminarNotificar(${indice})">Eliminar producto</button>
            `;      
            bannerCarrito.appendChild(carritoContainer);    
        });
        
        const totalCarrito = carrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
        const totalContainer = document.createElement("div");
        totalContainer.className = "total-carrito";
        totalContainer.innerHTML=`<div class= "total"> TOTAL $ ${totalCarrito}</div>
        <button class="btn btn-info finalizar" id="finalizar" onClick="finalizarCompra()"> Finalizar Compra</button>
        `;
        bannerCarrito.append(totalContainer);
    }else{
        bannerCarrito.classList.remove("carrito");
    }
};

//funcion para eliminar producto ya agregado en el carrito

const eliminarProducto = (indice) => {
    carrito.splice(indice, 1);//borrar un elemento de la posicion indice
    crearCarrito();//para actualizar el carrito

    // Luego de modificar el carrito, guardarlo en localStorage
    guardarCarritoEnLocalStorage();
};

const notificacionEliminar = () => {
    Toastify({
        text: "Producto Eliminado",
        className: "info",
        style: {
          //background: "linear-gradient(to right, #e93973, #a52d55)",
          background: "linear-gradient(to right, #430058, #e93973)",
        }
      }).showToast();
};



const eliiminarNotificar = (indice) => {
    eliminarProducto(indice);
    notificacionEliminar(indice);
};


//funcion para finalizar la compra

const finalizarCompra = () =>{
    const total = document.getElementsByClassName("total")[0].innerHTML;
    bannerCarrito.innerHTML="";
    const comprafinalizada = `<div class="compra-finalizada">
    <p class="compra-parrafo"> La compra ya casi es tuya!, debes abonar un ${total}</p> 
    <div class="datos-cliente">
    <p class="datos-parrafo"> Complete el formulario con sus datos para coordinar la entrega</p>
    <button class="btn btn-info formulario" id="formulario" onclick="mostrarFormulario()"> FORMULARIO </button>
    </div>`;
    bannerCarrito.innerHTML = comprafinalizada;

    // Luego de finalizar la compra, guardar en localStorage
    guardarCarritoEnLocalStorage();

     // Luego de finalizar la compra, borra el carrito del localStorage
      localStorage.removeItem('carrito');

     carrito=[]; //para que se vacie carrito cuando finalizo la compra
};

//funcion para formulario envio

const mostrarFormulario = () => {
    bannerCarrito.innerHTML = "";
    const formulario =`    
    <h2> DATOS PARA EL ENVÍO </h2>   
    <div class="contact_secction-container p-5 form-control">    
      <div class="row">    
        <div class="contact_secction_item mb-3  ">    
        <label>Nombre</label><br>   
        <input type="text" class="form-control" id="nombre" placeholder="Nombre"  value required />    
        </div>    
      <div class="contact_secction_item mb-3 ">    
        <label>E-mail</label><br>    
        <input type="text" class="form-control" id="mail" placeholder="E-mail"  value required />    
      </div>
      <div class="contact_secction_item mb-3 ">
        <label>Telefono</label><br>
        <input type="number" class="form-control" id="telefono" placeholder="Telefono" value required />
      </div>
        <div class="contact_secction_item mb-3 ">
        <label>Domicilio</label><br>
        <input type="text" class="form-control" id="domicilio" placeholder="Domicilio"  value required />
        </div>
      <div class="contact-button"> 
        <button type="button" class="btn btn-info envio" onclick="validarForm()">Confirmar</button>
      </div>
      </div>
    </div>   
    `;
    bannerCarrito.innerHTML = formulario;
}

// funcion mensaje de compra realizada

const mostrarMensaje = () => {
    const nombreCliente = document.getElementById("nombre").value;
    const mailCliente = document.getElementById("mail").value;
    bannerCarrito.innerHTML = "";
    let mensaje = `<div class="mensaje-final">Gracias ${nombreCliente} por su compra. En 24hs recibira su pedido en el siguiente mail: ${mailCliente}`;
    bannerCarrito.innerHTML = mensaje;
};

///local storage

const guardarCarritoEnLocalStorage = () => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
};


const cargarCarritoDesdeLocalStorage = () => {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        crearCarrito(); // Actualizar la interfaz con el carrito cargado
    }
};

// Llamo la función al cargar la página
cargarCarritoDesdeLocalStorage();



//Validar los campos del Formulario
const validarForm = () =>{

    let expRegNombre=/^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\s]+$/;
    let expRegCorreo=/^\w+@(\w+\.)+\w{2,4}$/; 
    let expRegTelefono = /^\d+$/; 
    let expRegDomicilio = /^[a-zA-ZÑñÁáÉéÍíÓóÚúÜü\d\s]+$/;
    
    let campo = true;
  
  
    let nombre = document.getElementById("nombre");
    let correo = document.getElementById("mail");
    let telefono = document.getElementById("telefono");
    let domicilio = document.getElementById("domicilio");

      if (!nombre.value && !expRegNombre.exec(nombre.value) && !correo.value && !expRegCorreo.exec(correo.value) && !telefono.value && !expRegTelefono.exec(telefono.value) && !domicilio.value && !expRegDomicilio.exec(domicilio.value)) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Por favor, llene los campos",
            background: `#af194b70`,
            color: `#e9ecef`,
            width: `30%`,
            confirmButtonColor:`rgb(101 60 105)`,
            
          }); 
        //alert("Por favor, llene los campos");
          nombre.focus();
          //correo.focus();
          //telefono.focus();
          //domicilio.focus();
          campo = false;
          return false;
      }
       //Campo nombre
      if(!nombre.value)
      {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "El campo nombre es requerido",
            background: `#af194b70`,
            color: `#e9ecef`,
            width: `30%`,
            confirmButtonColor:`rgb(101 60 105)`,
          }); 
        //alert("El campo nombre es requerido");
        nombre.focus();
        campo = false;
        return false;
      }
        if (!expRegNombre.exec(nombre.value))
      {
        
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "El campo nombre admite letras y espacios.",
            background: `#af194b70`,
            color: `#e9ecef`,
            width: `30%`,
            confirmButtonColor:`rgb(101 60 105)`,
          });

          //alert("El campo nombre admite letras y espacios.")
          nombre.focus();
          campo = false;
          return false;
        }

       //campo email
        if(!correo.value)
        {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "El campo correo es requerido",
            background: `#af194b70`,
            color: `#e9ecef`,
            width: `30%`,
            confirmButtonColor:`rgb(101 60 105)`,
          }); 
        //alert("El campo correo es requerido");
        correo.focus();
        campo = false;
        return false;
        }

        if(!expRegCorreo.exec(correo.value))
        {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "El campo correo no tiene el formato correcto",
            background: `#af194b70`,
            color: `#e9ecef`,
            width: `30%`,
            confirmButtonColor:`rgb(101 60 105)`,
          }); 
         //alert("El campo correo no tiene el formato correcto.")
          correo.focus();
          campo = false;
          return false;
        }

       //Campo telefono
        if(!telefono.value)
        {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "El campo teléfono es requerido",
            background: `#af194b70`,
            color: `#e9ecef`,
            width: `30%`,
            confirmButtonColor:`rgb(101 60 105)`,
          }); 
        //alert("El campo teléfono es requerido");
        telefono.focus();
        campo = false;
        return false;
        }
        if(!expRegTelefono.exec(telefono.value))
        {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "El campo teléfonp admite números",
            background: `#af194b70`,
            color: `#e9ecef`,
            width: `30%`,
            confirmButtonColor:`rgb(101 60 105)`,
          }); 
         //alert("El campo teléfonp admite números")
          telefono.focus();
          campo = false;
          return false;
        }

       //Campo domicilio
        if(!domicilio.value)
        {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "El campo domicilio es requerido",
            background: `#af194b70`,
            color: `#e9ecef`,
            width: `30%`,
            confirmButtonColor:`rgb(101 60 105)`,
          }); 
        //alert("El campo domicilio es requerido");
        domicilio.focus();
        campo = false;
        return false;
        }
        if (!expRegDomicilio.exec(domicilio.value))
        {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "El campo domicilio admite letras y espacios",
            background: `#af194b70`,
            color: `#e9ecef`,
            width: `30%`,
            confirmButtonColor:`rgb(101 60 105)`,
          }); 
          //alert("El campo domicilio admite letras y espacios.")
          domicilio.focus();
          campo = false;
          return false;
        }

      if (campo ==true) { 
    
        mostrarMensaje()
          
          return true;
        }
          
      };





      
