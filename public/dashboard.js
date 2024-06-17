document.addEventListener('DOMContentLoaded', function() {
    const deleteUserButton = document.getElementById('deleteUserButton');
    const messageDiv = document.getElementById('message');
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    deleteUserButton.addEventListener('click', function() {
        deleteUser(username);
    });

    function deleteUser(username) {
        fetch(`http://localhost:3000/user/${username}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
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
            window.location.href = 'login.html';
        })
        .catch(error => {
            console.error('Erro ao excluir usuário:', error);
            messageDiv.innerText = 'Erro ao excluir usuário. Verifique o console para mais detalhes.';
        });
    }
});
