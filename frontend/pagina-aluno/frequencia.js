const API_URL = 'http://localhost:4040';

async function getFrequencia(ra, token) {
    console.log('token enviado:', token); 
    const response = await fetch(`${API_URL}/presenca/student/${ra}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Erro ao buscar frequência');
    return response.json();
}

async function carregarFrequencia() {
    const token = localStorage.getItem('token');
    const ra = localStorage.getItem('ra');

    try {
        const dados = await getFrequencia(ra, token);

        const nome = dados[0].nome_aluno || 'Usuário';

        document.querySelectorAll('.user-name').forEach(el => {
            el.innerText = nome;
        });

        const totalAulas = dados.reduce((sum, item) => sum + Number(item.total_registros) * 3, 0);
        const totalPresencas = dados.reduce((sum, item) => sum + Number(item.presencas) * 3, 0);
        const totalFaltas = dados.reduce((sum, item) => sum + Number(item.faltas) * 3, 0);


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
        const totalAulasBlocos = Number(item.total_registros) * 3;
        const presencasBlocos = Number(item.presencas) * 3;
        const faltasBlocos = Number(item.faltas) * 3;
        const percentual = totalAulasBlocos > 0
            ? ((presencasBlocos / totalAulasBlocos) * 100).toFixed(1)
            : '0.0';

        const card = document.createElement('div');
        card.className = 'subject-card';
        card.innerHTML = `
            <div class="subject-header">
                <div class="subject-title">${item.disciplina}</div>
                <div class="status ${percentual >= 75 ? 'status-present' : 'status-warning'}">
                    ${percentual}% DE PRESENÇA
                </div>
            </div>
            <div class="attendance-bar ${percentual >= 75 ? '' : 'attendance-warning'}">
                <div class="attendance-fill" style="width: ${percentual}%"></div>
            </div>
            <div class="attendance-details">
                <span>${presencasBlocos}/${totalAulasBlocos} aulas</span>
                <span>${faltasBlocos} faltas</span>
            </div>
        `;
        overview.appendChild(card);
    });



        const tbody = document.querySelector('#subjects tbody');

        if (tbody) {
            tbody.innerHTML = '';

            dados.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
            <td>${item.disciplina}</td>
            <td>${item.total_registros}</td>
            <td>${item.presencas}</td>
            <td>${item.faltas * 3}</td>
            <td>${item.percentual_presenca}%</td>
            <td>
                <span class="status ${item.percentual_presenca >= 75 ? 'status-present' : 'status-warning'}">
                    ${item.percentual_presenca >= 75 ? 'Aprovado' : 'Alerta'}
                </span>
            </td>
        `;
                tbody.appendChild(tr);
            });
        }


    } catch (err) {
        console.error('Erro ao carregar frequência:', err);
        alert('Erro ao carregar frequência!');
    }
}

window.onload = carregarFrequencia;
