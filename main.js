const calcularEdad = () => {
  const dia = document.getElementById("dia").value;
  const mes = document.getElementById("mes").value;
  const año = document.getElementById("año").value;
  const hoy = new Date();
  const cumpleanos = new Date(año, mes, dia);
  const edad = hoy.getFullYear() - cumpleanos.getFullYear();
  const m = hoy.getMonth() - cumpleanos.getMonth();

  if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
    edad--;
  }

  return edad;
};

const agregarAlCarrito = (producto) => {
  const localdata = localStorage.getItem("carrito");

  if (!localdata) {
    const data = JSON.stringify([producto]);
    return localStorage.setItem("carrito", data);
  }
  const carrito = JSON.parse(localdata);

  const yaEstaAgregado = carrito.some((item) => item.id === producto.id);

  if (yaEstaAgregado) {
    const nuevoCarrito = carrito.map((item) => {
      if (item.id !== producto.id) return item;
      const nuevaCantidad = item.cantidad + 1;
      return { ...item, cantidad: nuevaCantidad };
    });

    const data = JSON.stringify(nuevoCarrito);
    return localStorage.setItem("carrito", data);
  }

  carrito.push(producto);
  const data = JSON.stringify(carrito);
  return localStorage.setItem("carrito", data);
};

const eliminarProducto = (id) => {
  const localdata = localStorage.getItem("carrito");
  const carrito = JSON.parse(localdata);
  const nuevoCarrito = carrito.filter((producto) => producto.id !== id);
  const data = JSON.stringify(nuevoCarrito);
  localStorage.setItem("carrito", data);
  actualizarCarrito();
};

const actualizarCarrito = () => {
  const localdata = localStorage.getItem("carrito");
  const carrito = JSON.parse(localdata) || [];

  const totalCompra = carrito.reduce((valorAnterior, producto) => {
    const monto = producto.cantidad * producto.precio;
    return valorAnterior + monto;
  }, 0);

  const tarjetasDeProducto = carrito.map((producto) => {
    const contenedor = document.createElement("div");
    const body = document.createElement("div");
    const nombre = document.createElement("h5");
    const cantidad = document.createElement("p");
    const boton = document.createElement("button");

    contenedor.classList.add("card");
    body.classList.add("card-body");
    nombre.classList.add("card-title");
    cantidad.classList.add("card-text");
    boton.classList.add("btn", "btn-danger", "text-end");

    nombre.innerHTML = producto.nombre;
    cantidad.innerHTML = `${producto.cantidad} Un`;
    boton.innerHTML = "Eliminar";

    contenedor.appendChild(body);
    body.appendChild(nombre);
    body.appendChild(cantidad);
    body.appendChild(boton);

    boton.addEventListener("click", () => eliminarProducto(producto.id));
    return contenedor;
  });

  const total = document.getElementById("total");
  const contenedorCarrito = document.getElementById("contenedor-carrito");
  contenedorCarrito.replaceChildren(...tarjetasDeProducto);
  total.innerHTML = `Total: $${totalCompra}`;
};

const insertarTarjetaDeProducto = (producto) => {
  const contenedor = document.createElement("div");
  const imagen = document.createElement("img");
  const body = document.createElement("div");
  const nombre = document.createElement("h5");
  const precio = document.createElement("p");
  const boton = document.createElement("button");

  contenedor.classList.add("card", "col");
  imagen.classList.add("card-img-top");
  body.classList.add("card-body");
  nombre.classList.add("card-title");
  precio.classList.add("card-text");
  boton.classList.add("btn", "btn-primary");

  imagen.setAttribute("src", `./imagenes/${producto.imagen}`);
  nombre.innerHTML = producto.nombre;
  precio.innerHTML = `$ ${producto.precio}`;
  boton.innerHTML = "Agregar al carrito";
  boton.addEventListener("click", () => {
    agregarAlCarrito({ ...producto, cantidad: 1 });
    actualizarCarrito();
  });

  contenedor.appendChild(imagen);
  contenedor.appendChild(body);
  body.appendChild(nombre);
  body.appendChild(precio);
  body.appendChild(boton);

  const listadoDeProductos = document.getElementById("listadoDeProductos");
  listadoDeProductos.appendChild(contenedor);
};

const traerProductos = async () => {
  try {
    const res = await fetch(
      "https://b9a509f2b1744410aa03de6cbeb9d8b2.api.mockbin.io/",
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();

    data.map(insertarTarjetaDeProducto);
    actualizarCarrito();
  } catch (error) {
    console.error(error);
  }
};

const ingresar = () => {
  const edad = calcularEdad();

  if (edad < 18) {
    const mensaje = document.getElementById("mensaje");

    return mensaje.classList.remove("invisible");
  }
  traerProductos();

  const contenido = document.getElementById("pagina-principal");
  const formulario = document.getElementById("formulario");
  formulario.classList.add("ocultar");
  contenido.classList.remove("ocultar");
};

const finalizarCompra = () => {
  localStorage.clear();
  actualizarCarrito();
  alert("Gracias por su compra!!");
};

const botonVerificar = document.getElementById("btn-verificar");
botonVerificar.addEventListener("click", ingresar);

const botonFinalizar = document.getElementById("btn-finalizar");
botonFinalizar.addEventListener("click", finalizarCompra);
