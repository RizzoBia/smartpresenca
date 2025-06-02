const API_URL = 'http://localhost:4040';

document.addEventListener('DOMContentLoaded', async function () {
    const professor = JSON.parse(localStorage.getItem('professor'));
    if (!professor) {
        alert('Professor não autenticado.');
        window.location.href = '../login.html';
        return;
    }

    const token = localStorage.getItem('token');
    const rm = professor.rm;

    // Atualiza nome do usuário (topo e no QR Code)
    const userInfoSpan = document.querySelector('.user-info span');
    const nomeSpan = document.getElementById('professor-nome');
    if (userInfoSpan) userInfoSpan.textContent = `Prof. ${professor.nome}`;
    if (nomeSpan) nomeSpan.textContent = professor.nome;

    // Buscar disciplinas do professor
    try {
        const response = await fetch(`${API_URL}/teacher/aulas/${rm}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Erro ao buscar disciplinas');

        const aulas = await response.json();
        const select = document.getElementById('subject-select');
        const disciplinasUnicas = [];

        aulas.forEach(aula => {
            const codigo = aula.codigo_disciplina || '';
            const nome = aula.disciplina;
            const identificador = `${nome}`;

            if (!disciplinasUnicas.includes(identificador)) {
                disciplinasUnicas.push(identificador);
                const option = document.createElement('option');
                option.value = identificador;
                option.textContent = identificador;
                select.appendChild(option);
            }
        });
    } catch (err) {
        console.error('Erro ao carregar disciplinas:', err);
        alert('Erro ao carregar disciplinas do professor.');
    }

    // Controle de menu responsivo
    const menuToggle = document.querySelector('.header-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
});
