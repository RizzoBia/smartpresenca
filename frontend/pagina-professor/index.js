const API_URL = 'http://localhost:4040';

async function carregarResumoProfessor() {
    const token = localStorage.getItem('token');
    const rm = localStorage.getItem('rm');

    if (!token || !rm) {
        console.warn('Usuário não autenticado!');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/professor/resumo/${rm}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar resumo do professor');
        }

        const data = await response.json();

        // Atualiza nome do usuário
        document.querySelectorAll('.user-name').forEach(el => {
            el.innerText = data.nome || 'Professor';
        });

        // Atualiza curso
        document.querySelectorAll('.user-curso').forEach(el => {
            el.innerText = data.curso || 'Curso';
        });

    } catch (err) {
        console.error('Erro ao carregar resumo:', err);
    }
}

async function verificarAulaDoDia() {
    const token = localStorage.getItem('token');
    const rm = localStorage.getItem('rm');

    if (!token || !rm) {
        console.warn('Usuário não autenticado!');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/professor/aulas/${rm}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar aulas do professor');
        }

        const aulas = await response.json();

        const hoje = new Date();
        const diaSemana = hoje.getDay(); // 0 = Domingo, 1 = Segunda...

        const dia = String(hoje.getDate()).padStart(2, '0');
        const mes = String(hoje.getMonth() + 1).padStart(2, '0');
        const ano = hoje.getFullYear();

        const dataAtual = `${dia}/${mes}/${ano}`;

        // Atualiza a data
        document.querySelectorAll('.data-atual').forEach(el => {
            el.innerText = dataAtual;
        });

        // Verifica se tem aula
        const aulasHoje = aulas.filter(aula => Number(aula.dia_semana) === diaSemana);

        let statusTexto = '';
        if (aulasHoje.length > 0) {
            statusTexto = aulasHoje.map(a => `${a.disciplina} (${a.hora_inicio} - ${a.hora_fim})`).join(', ');
        } else {
            statusTexto = 'Nenhuma aula no momento';
        }

        // Atualiza status
        document.querySelectorAll('.status-aula').forEach(el => {
            el.innerText = statusTexto;
        });

    } catch (err) {
        console.error('Erro ao verificar aula do dia:', err);
    }
}


// Executar as funções ao carregar a página
window.onload = function () {
    carregarResumoProfessor();
    verificarAulaDoDia();
};
