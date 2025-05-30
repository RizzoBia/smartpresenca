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

    try {
        const res = await fetch(`${API_URL}/professor/aulas/${rm}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Erro ao carregar aulas');

        const aulas = await res.json();
        preencherGrade(aulas);
        marcarHoje(aulas);
    } catch (err) {
        console.error('Erro ao buscar aulas:', err);
        document.querySelector('#today-class').textContent = 'Erro ao carregar grade.';
    }

    // Menu responsivo
    const menuToggle = document.querySelector('.header-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
});

function preencherGrade(aulas) {
    const scheduleBody = document.getElementById('schedule-body');
    scheduleBody.innerHTML = ''; // limpar grade antiga

    aulas.sort((a, b) => a.dia_semana_num - b.dia_semana_num || a.hora_inicio.localeCompare(b.hora_inicio));

    aulas.forEach(aula => {
        const row = document.createElement('tr');
        row.setAttribute('data-day', aula.dia_semana_num);

        row.innerHTML = `
            <td class="day-column">${aula.dia_semana}</td>
            <td class="time-column">${aula.hora_inicio.slice(0, 5)} - ${aula.hora_fim.slice(0, 5)}</td>
            <td class="subject-column">
                <div class="subject-name">${aula.disciplina} - ${aula.nome_turma}</div>
            </td>
            <td class="location-column">
                <div class="location-info">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${aula.sala} - ${aula.bloco} (${aula.campus})</span>
                </div>
            </td>
        `;
        scheduleBody.appendChild(row);
    });
}

function marcarHoje(aulas) {
    const hoje = new Date();
    const diaSemana = hoje.getDay(); // 0 = domingo

    const aulasHoje = aulas.filter(a => parseInt(a.dia_semana_num) === diaSemana);

    const diaTexto = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'][diaSemana];
    const dia = hoje.getDate();
    const mes = hoje.toLocaleString('default', { month: 'long' });
    const ano = hoje.getFullYear();

    const info = document.getElementById('today-class');

    if (aulasHoje.length === 0) {
        info.innerHTML = `
            <strong>${diaTexto}, ${dia} de ${mes} de ${ano}</strong><br>
            Nenhuma aula agendada para hoje.
        `;
        document.querySelector('.today-alert i').className = 'fas fa-calendar-times';
        document.getElementById('today-alert').classList.add('weekend');
    } else {
        const blocos = aulasHoje.map(a => {
            const hora = `${a.hora_inicio.slice(0, 5)} - ${a.hora_fim.slice(0, 5)}`;
            return `${a.disciplina} (${a.nome_turma})<br>${a.sala} - Bloco ${a.bloco} (${a.campus}) | ${hora}`;
        }).join('<br><br>');

        info.innerHTML = `
            <strong>${diaTexto}, ${dia} de ${mes} de ${ano}</strong><br>${blocos}
        `;

        // Destacar linha na tabela
        document.querySelectorAll(`#schedule-body tr[data-day="${diaSemana}"]`)
            .forEach(row => row.classList.add('current-day'));
    }
}
