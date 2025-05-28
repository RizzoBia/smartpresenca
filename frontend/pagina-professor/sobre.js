const API_URL = 'http://localhost:4040';

document.addEventListener('DOMContentLoaded', async () => {
    const professor = JSON.parse(localStorage.getItem('professor'));

    if (!professor) {
        alert('Professor não autenticado.');
        window.location.href = '/login.html';
        return;
    }

    // Atualiza o nome do usuário no topo
    const userInfoSpan = document.querySelector('.user-info span');
    if (userInfoSpan) userInfoSpan.textContent = `Prof. ${professor.nome}`;

    const token = localStorage.getItem('token');
    const rm = professor.rm;
});