document.addEventListener('DOMContentLoaded', () => {
    function getDiaSemana(dataISO) {
        return new Date(dataISO).toLocaleDateString('pt-BR', { weekday: 'long' });
    }

    const modal = document.getElementById('modal-editar-presencas');
    const modalBody = document.getElementById('modal-presencas-body');
    const modalNome = document.getElementById('modal-aluno-nome');
    const modalRA = document.getElementById('modal-aluno-ra');
    const btnFecharModal = document.getElementById('btn-fechar-modal');
    const btnSalvar = document.getElementById('btn-salvar-presencas');

    if (!modal || !modalBody || !modalNome || !modalRA || !btnFecharModal || !btnSalvar) {
        console.warn('Modal de presença não encontrado no HTML.');
        return;
    }

    btnFecharModal.addEventListener('click', () => modal.classList.add('hidden'));

    window.abrirModalPresencas = async function (alunoRA, disciplina, alunoNome, professorRM) {
        modal.classList.remove('hidden');
        modalNome.textContent = alunoNome;
        modalRA.textContent = alunoRA;
        modalBody.innerHTML = '<tr><td colspan="4">Carregando...</td></tr>';

        try {
            const res = await fetch(`${API_URL}/presenca/teacher/${professorRM}/detalhes`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });

            const data = await res.json();
            const presencasAluno = data.filter(p => p.ra == alunoRA && p.disciplina === disciplina);

            modalBody.innerHTML = '';
            presencasAluno.forEach(p => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
          <td>${new Date(p.data).toLocaleDateString()}</td>
          <td>${getDiaSemana(p.data)}</td>
          <td>${p.presente ? 'Presente' : 'Faltou'}</td>
          <td>
            <input type="checkbox" data-id="${p.id_presenca}" ${p.presente ? 'checked' : ''}>
          </td>
        `;
                modalBody.appendChild(tr);
            });
        } catch (err) {
            console.error(err);
            modalBody.innerHTML = '<tr><td colspan="4">Erro ao carregar presenças.</td></tr>';
        }
    }

    btnSalvar.addEventListener('click', async (e) => {
        e.preventDefault(); // ✅ agora sim, sem warnings

        const checkboxes = modalBody.querySelectorAll('input[type="checkbox"]');
        let sucesso = true;

        for (const input of checkboxes) {
            const id = input.dataset.id;
            const presente = input.checked;
            try {
                const res = await fetch(`${API_URL}/presenca/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ presente })
                });
                if (!res.ok) sucesso = false;
            } catch (err) {
                console.error(err);
                sucesso = false;
            }
        }

        if (sucesso) {
            alert('Presenças atualizadas com sucesso!');
            modal.classList.add('hidden');

            // Atualiza o card do aluno dinamicamente
            const totalAulas = checkboxes.length;
            const totalBlocos = totalAulas * 3;
            const presencasBlocos = Array.from(checkboxes).filter(cb => cb.checked).length * 3;
            const faltasBlocos = totalBlocos - presencasBlocos;
            const taxa = totalBlocos > 0 ? (presencasBlocos / totalBlocos) * 100 : 0;


            document.getElementById('student-total').textContent = totalBlocos;
            document.getElementById('student-presences').textContent = presencasBlocos;
            document.getElementById('student-absences').textContent = faltasBlocos;
            document.getElementById('student-attendance').textContent = `${taxa.toFixed(1)}%`;

            const statusElement = document.getElementById('student-status');
            let status = 'APROVADO';
            if (taxa < 75) status = 'REPROVADO';
            else if (taxa < 80) status = 'ALERTA';

            statusElement.textContent = status;

            const statusClass = status === 'APROVADO' ? 'status-present'
                : status === 'ALERTA' ? 'status-warning'
                    : 'status-danger';

            statusElement.className = `status ${statusClass}`;

            statusElement.className = `status ${statusClass}`;
        } else {
            alert('Erro ao atualizar algumas presenças.');
        }
    });
});
