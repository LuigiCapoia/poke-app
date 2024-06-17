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

    const updateForm = document.getElementById('updateForm');
    if (updateForm) {
        updateForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(updateForm);
            const newUsername = formData.get('newUsername');

            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username'); // Assumindo que o username está armazenado no localStorage

            if (token && username) {
                updateUser(username, newUsername, token);
            } else {
                messageDiv.innerText = 'Usuário não está logado.';
            }
        });
    }

    const deleteButton = document.getElementById('deleteButton');
    if (deleteButton) {
        deleteButton.addEventListener('click', function() {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username'); // Assumindo que o username está armazenado no localStorage

            if (token && username) {
                deleteUser(username, token);
            } else {
                messageDiv.innerText = 'Usuário não está logado.';
            }
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
            localStorage.setItem('username', loginData.username); // Armazene o username no localStorage
            messageDiv.innerText = 'Login realizado com sucesso!';
            loginForm.reset();
            window.location.href = 'dashboard.html'; // Redireciona para o dashboard após o login
        })
        .catch(error => {
            console.error('Erro ao fazer login:', error);
            messageDiv.innerText = 'Erro ao fazer login. Verifique o console para mais detalhes.';
        });
    }

    function updateUser(username, newUsername, token) {
        fetch(`http://localhost:3000/user/${username}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ username: newUsername })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao atualizar usuário');
            }
            return response.json();
        })
        .then(data => {
            messageDiv.innerText = 'Usuário atualizado com sucesso!';
            localStorage.setItem('username', newUsername); // Atualize o username no localStorage
            updateForm.reset();
        })
        .catch(error => {
            console.error('Erro ao atualizar usuário:', error);
            messageDiv.innerText = 'Erro ao atualizar usuário. Verifique o console para mais detalhes.';
        });
    }

    function deleteUser(username, token) {
        fetch(`http://localhost:3000/user/${username}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao excluir usuário');
            }
            return response.json();
        })
        .then(data => {
            messageDiv.innerText = 'Usuário excluído com sucesso!';
            localStorage.removeItem('token');
            localStorage.removeItem('username');
        })
        .catch(error => {
            console.error('Erro ao excluir usuário:', error);
            messageDiv.innerText = 'Erro ao excluir usuário. Verifique o console para mais detalhes.';
        });
    }
});
