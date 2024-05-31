(function () {
    // Inicializo socket del lado del cliente
    const socket = io();

    document.getElementById('registerForm').addEventListener('submit', (e) =>{
        e.preventDefault();
        
        const newUser = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            age: document.getElementById('age').value,
            password: document.getElementById('password').value
        };
        Swal.fire(
            "Signed in!",
            `Welcome to Valsaa store.`,
            "success"
        );
        
        socket.emit('registerForm', newUser);
        document.getElementById('firstName').value = '';
        document.getElementById('lastName').value = '';
        document.getElementById('email').value = '';
        document.getElementById('age').value = '';
        document.getElementById('password').value = '';
    });
    
    
    })();