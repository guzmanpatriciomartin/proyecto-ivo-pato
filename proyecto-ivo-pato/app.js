//llamo a la funcion con un evento para asegurar que
// el archivo esta cargado
var jsondeml
var preferenciaid
let preference = {
    items:[],
  };

  function comprar(){
    preference.items=Object.values(carrito)
    let salvavidas= preference.items.map( item => { 
        return { title: item.title,
                quantity:item.cantidad,
            unit_price: item.price};}) 
            preference.items=salvavidas
            comprame()


}

function comprame(){$.ajax('/preferenciaid',{
    type: 'POST',
    url: '/preferenciaid',
    contentType : "application/json",
    data : JSON.stringify(preference)
,

      success: (data) => {

      preferenciaid=data
      
      // Agrega credenciales de SDK
      const mp = new MercadoPago("TEST-983bf096-87bc-4d3c-b91b-c8a93c3da7eb", {
        locale: "es-AR",
      });
    
      // Inicializa el checkout
      mp.checkout({
        preference: {
          id: preferenciaid,
        },
        render: {
          container: ".cho-container", // Indica el nombre de la clase donde se mostrará el botón de pago
          label: "Pagar", // Cambia el texto del botón de pago (opcional)
        },
      });
      }
  });}
fetch('https://api.mercadolibre.com/sites/MLA/search?seller_id=139673546').then(response => response.json())
.then(data =>{
jsondeml=data.results
pintarProductos(jsondeml)
productosEnCarrito(jsondeml)
detectarBotones(jsondeml)});

// Variables utilizadas
let carrito = {}
const contProductos = document.querySelector('#contenedorProductos');
const items = document.querySelector('#items')
const footrCarrito = document.querySelector('#footerCarrito');



// funcion que pinta las cards con los productos desde la api
const pintarProductos = (data) => {
    const template = document.querySelector('#templateProductos').content
    const fragment = document.createDocumentFragment()

    data.forEach(productos => {
        template.querySelector('img').setAttribute('src', productos.thumbnail)
        template.querySelector('h5').textContent = productos.title
        template.querySelector('p span').textContent = productos.price
        template.querySelector('button').dataset.id = productos.id

        const clon = template.cloneNode(true)
        fragment.appendChild(clon)

    });
    contProductos.appendChild(fragment);
}


// funcion de botones en cards de los productos
const detectarBotones = (data) => {
    const botones = document.querySelectorAll('.card button');

    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            const productos = data.find(item => item.id == btn.dataset.id);
            productos.cantidad = 1
            if (carrito.hasOwnProperty(productos.id)) {
                productos.cantidad = carrito[productos.id].cantidad + 1
            };
            carrito[productos.id] = { ...productos }
            productosEnCarrito()
            document.querySelector('.cho-container').innerHTML='<button class="btn btn-dark btn-sm" onclick="comprar()">Comprar</button>'

        });
    });
};

// Funcion que pinta los productos en el carrito
const productosEnCarrito = () => {
    items.innerHTML = ''

    const template = document.querySelector('#templateCarrito').content
    const fragment = document.createDocumentFragment()

    Object.values(carrito).forEach(producto => {
        template.querySelector('img').setAttribute('src', producto.thumbnail)
        template.querySelectorAll('td')[0].textContent = producto.title
        template.querySelectorAll('td')[1].textContent = producto.cantidad
        template.querySelector('span').textContent = producto.price * producto.cantidad

        // botones de agregar o sacar
        template.querySelector('.btn-suma').dataset.id = producto.id
        template.querySelector('.btn-resta').dataset.id = producto.id


        const clon = template.cloneNode(true)
        fragment.appendChild(clon);
    });
    items.appendChild(fragment);
    footerCarrito();
    btnFooterCarrito();

};

// Funcion que pinta el footer del carrito
// y boton para limpiarlo
const footerCarrito = () => {
    footrCarrito.innerHTML = ''

    const template = document.querySelector('#tFooterCarrito').content
    const fragment = document.createDocumentFragment()

    const nCantidad = Object.values(carrito).reduce((ac, { cantidad }) => ac + cantidad, 0);
    const nTotal = Object.values(carrito).reduce((ac, { cantidad, price }) => ac + cantidad * price, 0);

    template.querySelectorAll('td')[0].textContent = nCantidad
    template.querySelector('span').textContent = nTotal

    const clon = template.cloneNode(true)
    fragment.appendChild(clon)
    footrCarrito.appendChild(fragment)

    // boton que borra elementos del carrito, si funca ahora :3
    const boton = document.querySelector('#vaciarCarrito')
    boton.addEventListener('click', ()=>{
         carrito = {}
        productosEnCarrito()
        document.querySelector('.cho-container').innerHTML='<button class="btn btn-dark btn-sm" onclick="comprar()">Comprar</button>'
    })

}
// botones del carrito que agrega o sacar productos
const btnFooterCarrito = () => {
    const botonesAgregar = document.querySelectorAll('#items .btn-suma')
    const botonesQuitar = document.querySelectorAll('#items .btn-resta')

    botonesAgregar.forEach(btn => {
        btn.addEventListener('click', () => {
            const producto = carrito[btn.dataset.id]
            producto.cantidad ++
            carrito[btn.dataset.id] = { ...producto }
            productosEnCarrito()
            document.querySelector('.cho-container').innerHTML='<button class="btn btn-dark btn-sm" onclick="comprar()">Comprar</button>'

        })
    })

    botonesQuitar.forEach(btn => {
        btn.addEventListener('click', () => {
            const producto = carrito[btn.dataset.id]
            producto.cantidad --
            if (producto.cantidad == 0) {
                delete carrito[btn.dataset.id]
            } else {
                carrito[btn.dataset.id] = { ...producto }
            }
            productosEnCarrito()
            document.querySelector('.cho-container').innerHTML='<button class="btn btn-dark btn-sm" onclick="comprar()">Comprar</button>'

        })
    })
};
