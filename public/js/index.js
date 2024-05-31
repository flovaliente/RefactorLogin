(function() {
    const socket = io();
    
    document.getElementById('addProduct').addEventListener('submit', (e) =>{
        e.preventDefault();
        
        const newProduct = {
            title: document.getElementById('titleProduct').value,
            description: document.getElementById('descriptionProduct').value,
            code: document.getElementById('codeProduct').value,
            price: document.getElementById('priceProduct').value,
            stock: document.getElementById('stockProduct').value,
            category: document.getElementById('categoryProduct').value
        };
        Swal.fire(
            "Added!",
            `Your product ${idDeleteProduct.value} has been added.`,
            "success"
        );
        
        socket.emit('addProduct', newProduct);
        document.getElementById('titleProduct').value = '';
        document.getElementById('descriptionProduct').value = '';
        document.getElementById('codeProduct').value = '';
        document.getElementById('priceProduct').value = '';
        document.getElementById('stockProduct').value = '';
        document.getElementById('categoryProduct').value = '';
    });
  
    document.getElementById('deleteProduct').addEventListener('submit', (e) =>{
        e.preventDefault();
        
        Swal.fire({ //Mostrar alerta antes de borrar
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
          }).then((result) => {
            if (result.isConfirmed) { //Si se confirma borro, sino muestro en consola que fue cancelado
                Swal.fire(
                    "Deleted!",
                    `Your product ${idDeleteProduct.value} has been deleted.`,
                    "success"
                );
                const idProduct = document.getElementById("idDeleteProduct").value;
                console.log(idProduct);
                socket.emit('deleteProductById', idProduct);
                document.getElementById('idDeleteProduct').value = '';
                document.getElementById('idDeleteProduct').focus();
            } else {
                document.getElementById('idDeleteProduct').value = '';
                console.log(`The action was cancelled.`);
                return;
            }
          });
    });
  
    socket.on('listaProductos', (products) =>{
        const listaProd = document.getElementById('listRTP');
        listaProd.innerText = '';
        //console.log(products);
        products.forEach(product => {
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