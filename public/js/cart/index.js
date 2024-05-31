(function() {
    //Inicializo socket del lado del cliente
    const socket = io();
    
    function retornoCarritoVacio(){
        return `<h3 class="vacio">El carrito está vacío</h3>`
    }

    socket.on('carts', (carts) =>{
        console.log("carts");
        const listaProd = document.getElementById('contCarr');
        listaProd.innerText = '';
        carts.forEach(product => {
            const productElement = document.createElement('div');
            productElement.innerHTML = `
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>$ ${product.price}</p>
            <p>Stock: ${product.stock}</p>
            <p id='idProduct'>Id: ${product._id}</p>`;
            listaProd.appendChild(productElement);
        });
    });
    
  
  })();