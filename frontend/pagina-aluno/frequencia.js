async function carregarFrequencia() {
    const token = localStorage.getItem('token');
    const ra = localStorage.getItem('ra');

    try {
        const dados = await getFrequencia(ra, token);

        const nome = dados[0].nome_aluno || 'Usuário';

        document.querySelectorAll('.user-name').forEach(el => {
            el.innerText = nome;
        });

        const totalAulas = dados.reduce((sum, item) => sum + Number(item.total_registros), 0);
        const totalPresencas = dados.reduce((sum, item) => sum + Number(item.presencas), 0);
        const totalFaltas = dados.reduce((sum, item) => sum + Number(item.faltas), 0);


        let taxa = 0;
        if (totalAulas > 0) {
            taxa = ((totalPresencas / totalAulas) * 100).toFixed(1);
        }

        document.querySelector('.summary-cards .card:nth-child(1) .card-value').innerText = `${taxa}%`;
        document.querySelector('.summary-cards .card:nth-child(2) .card-value').innerText = totalAulas.toLocaleString();
        document.querySelector('.summary-cards .card:nth-child(3) .card-value').innerText = totalPresencas.toLocaleString();
        document.querySelector('.summary-cards .card:nth-child(4) .card-value').innerText = totalFaltas.toLocaleString();



        const overview = document.getElementById('overview');
        overview.innerHTML = '';

        dados.forEach(item => {
            const card = document.createElement('div');
            card.className = 'subject-card';
            card.innerHTML = `
                <div class="subject-header">
                    <div class="subject-title">${item.disciplina}</div>
                    <div class="status ${item.percentual_presenca >= 75 ? 'status-present' : 'status-warning'}">
                        ${item.percentual_presenca}% de presença
                    </div>
                </div>
                <div class="attendance-bar">
                    <div class="attendance-fill" style="width: ${item.percentual_presenca}%"></div>
                </div>
                <div class="attendance-details">
                    <span>${item.presencas}/${item.total_registros} aulas</span>
                    <span>${item.faltas} faltas</span>
                </div>
            `;
            overview.appendChild(card);
        });

        const tbody = document.querySelector('#subjects tbody');
        tbody.innerHTML = '';

        dados.forEach(item => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.disciplina}</td>
                <td>${item.total_registros}</td>
                <td>${item.presencas}</td>
                <td>${item.faltas}</td>
                <td>${item.percentual_presenca}%</td>
                <td>
                    <span class="status ${item.percentual_presenca >= 75 ? 'status-present' : 'status-warning'}">
                        ${item.percentual_presenca >= 75 ? 'Aprovado' : 'Alerta'}
                    </span>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error('Erro ao carregar frequência:', err);
        alert('Erro ao carregar frequência!');
    }
}

window.onload = carregarFrequencia;
