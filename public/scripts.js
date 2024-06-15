document.addEventListener('DOMContentLoaded', function() {
    const messageDiv = document.getElementById('message');

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(registerForm);
            const userData = {
                username: formData.get('username'),
                password: formData.get('password')
            };

            registerUser(userData);
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(loginForm);
            const loginData = {
                username: formData.get('username'),
                password: formData.get('password')
            };

            loginUser(loginData);
        });
    }

    function registerUser(userData) {
        fetch('http://localhost:3000/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao cadastrar usuário');
            }
            return response.json();
        })
        .then(data => {
            messageDiv.innerText = 'Usuário cadastrado com sucesso!';
            registerForm.reset();
        })
        .catch(error => {
            console.error('Erro ao cadastrar usuário:', error);
            messageDiv.innerText = 'Erro ao cadastrar usuário. Verifique o console para mais detalhes.';
        });
    }

    function loginUser(loginData) {
        fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao fazer login');
            }
            return response.json();
        })
        .then(data => {
            localStorage.setItem('token', data.access_token);
            messageDiv.innerText = 'Login realizado com sucesso!';
            loginForm.reset();
            showLoggedInMessage(data.access_token);
        })
        .catch(error => {
            console.error('Erro ao fazer login:', error);
            messageDiv.innerText = 'Erro ao fazer login. Verifique o console para mais detalhes.';
        });
    }

    function showLoggedInMessage(token) {
        const loggedInMessage = document.createElement('p');
        loggedInMessage.textContent = `Logado com sucesso! Seu token é: ${token}`;
        messageDiv.appendChild(loggedInMessage);
    }
});
