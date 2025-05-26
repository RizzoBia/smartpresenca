async function carregarResumo() {
    const token = localStorage.getItem('token');
    const ra = localStorage.getItem('ra');

    if (!token || !ra) {
        console.warn('Usuário não autenticado!');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/aluno/resumo/${ra}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar resumo do aluno');
        }

        const data = await response.json();

        // Atualiza nome do usuário
        document.querySelectorAll('.user-name').forEach(el => {
            el.innerText = data.nome || 'Usuário';
        });

        // Atualiza curso
        document.querySelectorAll('.user-curso').forEach(el => {
            el.innerText = data.curso || 'Curso';
        });

    } catch (err) {
        console.error('Erro ao carregar resumo:', err);
    }
}

window.onload = carregarResumo;
