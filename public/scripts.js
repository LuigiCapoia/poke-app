document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    fetchPokemons();
    setupEventListeners();
    
}

function setupEventListeners() {
    const messageDiv = document.getElementById('message');

    setupRegisterForm(messageDiv);
    setupLoginForm(messageDiv);
    setupUpdateForm(messageDiv);
    setupDeleteButton(messageDiv);
    setupSavePokemonButton();
    setupAddPokemonCardButton(messageDiv);
}

function setupRegisterForm(messageDiv) {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(registerForm);
            const userData = {
                username: formData.get('username'),
                password: formData.get('password')
            };
            registerUser(userData, messageDiv, registerForm);
        });
    }
}

function setupLoginForm(messageDiv) {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(loginForm);
            const loginData = {
                username: formData.get('username'),
                password: formData.get('password')
            };
            loginUser(loginData, messageDiv, loginForm);
        });
    }
}

function setupUpdateForm(messageDiv) {
    const updateForm = document.getElementById('updateForm');
    if (updateForm) {
        updateForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(updateForm);
            const newUsername = formData.get('newUsername');
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');
            if (token && username) {
                updateUser(username, newUsername, token, messageDiv, updateForm);
            } else {
                messageDiv.innerText = 'Usuário não está logado.';
            }
        });
    }
}

function setupDeleteButton(messageDiv) {
    const deleteButton = document.getElementById('deleteButton');
    if (deleteButton) {
        deleteButton.addEventListener('click', function() {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');
            if (token && username) {
                deleteUser(username, token, messageDiv);
            } else {
                messageDiv.innerText = 'Usuário não está logado.';
            }
        });
    }
}

function setupSavePokemonButton() {
    const savePokemonButton = document.getElementById('savePokemonSelection');
    if (savePokemonButton) {
        savePokemonButton.addEventListener('click', function() {
            const pokemonSelect = document.getElementById('pokemonSelect');
            const selectedOptions = Array.from(pokemonSelect.selectedOptions).map(option => option.value);
            saveUserPokemons(selectedOptions);
        });
    }
}

function setupAddPokemonCardButton(messageDiv) {
    const addPokemonCardButton = document.getElementById('addPokemonCard');
    if (addPokemonCardButton) {
        addPokemonCardButton.addEventListener('click', function() {
            const pokemonSelect = document.getElementById('pokemonSelect');
            const selectedPokemon = pokemonSelect.value; 
            const pokemonCardsContainer = document.getElementById('pokemonCardsContainer');
            const numberOfPokemonCards = pokemonCardsContainer.getElementsByClassName('pokemon-card').length;
            if (numberOfPokemonCards < 6) {
                if (selectedPokemon) {
                    addPokemonCard(selectedPokemon, messageDiv);
                } else {
                    console.error('Nenhum Pokémon selecionado.');
                }
            } else {
                messageDiv.innerText = 'Você só pode adicionar até 6 Pokémons.';
            }
        });
    }
}

function registerUser(userData, messageDiv, registerForm) {
    fetch('http://localhost:3000/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
    .then(response => response.ok ? response.json() : Promise.reject('Erro ao cadastrar usuário'))
    .then(data => {
        messageDiv.innerText = 'Usuário cadastrado com sucesso!';
        registerForm.reset();
    })
    .catch(error => {
        console.error('Erro ao cadastrar usuário:', error);
        messageDiv.innerText = 'Erro ao cadastrar usuário. Verifique o console para mais detalhes.';
    });
}

function loginUser(loginData, messageDiv, loginForm) {
    fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
    })
    .then(response => response.ok ? response.json() : Promise.reject('Erro ao fazer login'))
    .then(data => {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('username', loginData.username);
        messageDiv.innerText = 'Login realizado com sucesso!';
        loginForm.reset();
        window.location.href = 'dashboard.html';
    })
    .catch(error => {
        console.error('Erro ao fazer login:', error);
        messageDiv.innerText = 'Erro ao fazer login. Verifique o console para mais detalhes.';
    });
}

function updateUser(username, newUsername, token, messageDiv, updateForm) {
    fetch(`http://localhost:3000/user/${username}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username: newUsername })
    })
    .then(response => response.ok ? response.json() : Promise.reject('Erro ao atualizar usuário'))
    .then(data => {
        messageDiv.innerText = 'Usuário atualizado com sucesso!';
        localStorage.setItem('username', newUsername);
        updateForm.reset();
    })
    .catch(error => {
        console.error('Erro ao atualizar usuário:', error);
        messageDiv.innerText = 'Erro ao atualizar usuário. Verifique o console para mais detalhes.';
    });
}

function deleteUser(username, token, messageDiv) {
    fetch(`http://localhost:3000/user/${username}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.ok ? response.json() : Promise.reject('Erro ao excluir usuário'))
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

function fetchPokemons() {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
        .then(response => response.json())
        .then(data => populatePokemonSelect(data.results))
        .catch(error => console.error('Erro ao carregar Pokémons:', error));
}

function populatePokemonSelect(pokemons) {
    const select = document.getElementById('pokemonSelect');
    pokemons.forEach(pokemon => {
        const option = document.createElement('option');
        option.value = pokemon.name;
        option.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        select.appendChild(option);
    });
}

function saveUserPokemons(pokemonSelection) {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    if (token && username) {
        fetch(`http://localhost:3000/user/${username}/pokemons`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ pokemons: pokemonSelection })
        })
        .then(response => response.ok ? response.json() : Promise.reject('Erro ao salvar Pokémons'))
        .then(data => console.log('Pokémons salvos com sucesso!'))
        .catch(error => console.error('Erro ao salvar Pokémons:', error));
    } else {
        console.error('Usuário não está logado.');
    }
}

const addedPokemons = [];
function addPokemonCard(pokemonName, messageDiv) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`;
    
    if (addedPokemons.includes(pokemonName.toLowerCase())) {
        messageDiv.innerText = 'Este Pokémon já foi adicionado.';
        return; 
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const cardContainer = document.getElementById('pokemonCardsContainer');
            const card = document.createElement('div');
            card.className = 'pokemon-card'; 

            card.innerHTML = `
                <h3>${pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1)}</h3>
                <img src="${data.sprites.front_default}" alt="${pokemonName}" />
            `;

            cardContainer.appendChild(card);
            addedPokemons.push(pokemonName.toLowerCase());
        })
        .catch(error => console.error('Erro ao buscar dados do Pokémon:', error));
}