document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const ra = localStorage.getItem('ra');

    if (!token || !ra) {
        alert('Aluno não autenticado.');
        window.location.href = '/login.html';
        return;
    }

    try {
        const resResumo = await fetch(`${API_URL}/aluno/resumo/${ra}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (resResumo.ok) {
            const data = await resResumo.json();
            document.querySelectorAll('.user-name').forEach(el => {
                el.innerText = data.nome || 'Aluno';
            });
        }
    } catch (err) {
        console.warn('Erro ao carregar nome do aluno:', err);
    }

    try {
        const res = await fetch(`${API_URL}/aluno/aulas/${ra}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Erro ao buscar aulas');

        const aulas = await res.json();
        preencherGrade(aulas);
        destacarHoje(aulas);
    } catch (err) {
        console.error('Erro ao buscar aulas:', err);
        document.getElementById('today-class').textContent = 'Erro ao carregar aulas.';
    }

    const menuToggle = document.querySelector('.header-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
});

function preencherGrade(aulas) {
    const tbody = document.getElementById('schedule-body');
    tbody.innerHTML = '';

    aulas.sort((a, b) => a.dia_semana_num - b.dia_semana_num || a.hora_inicio.localeCompare(b.hora_inicio));

    aulas.forEach(aula => {
        const tr = document.createElement('tr');
        tr.setAttribute('data-day', aula.dia_semana_num);

        tr.innerHTML = `
            <td>${aula.dia_semana}</td>
            <td>${aula.hora_inicio.slice(0,5)} - ${aula.hora_fim.slice(0,5)}</td>
            <td>${aula.nome_disciplina} - ${aula.nome_turma}</td>
            <td>${aula.sala} - ${aula.bloco} (${aula.campus})</td>
        `;
        tbody.appendChild(tr);
    });
}

function destacarHoje(aulas) {
    const hoje = new Date();
    const diaSemana = hoje.getDay();
    const dia = hoje.getDate();
    const mes = hoje.toLocaleString('default', { month: 'long' });
    const ano = hoje.getFullYear();

    const info = document.getElementById('today-class');
    const aulaHoje = aulas.filter(a => parseInt(a.dia_semana_num) === diaSemana);

    if (aulaHoje.length === 0) {
        info.innerHTML = `<strong>${diaSemanaTexto(diaSemana)}, ${dia} de ${mes} de ${ano}</strong><br>Não há aulas programadas para hoje.`;
    } else {
        const blocos = aulaHoje.map(a => {
            const hora = `${a.hora_inicio.slice(0, 5)} - ${a.hora_fim.slice(0, 5)}`;
            return `${a.nome_disciplina} (${a.nome_turma})<br>${a.sala} - Bloco ${a.bloco} (${a.campus}) | ${hora}`;
        }).join('<br><br>');

        info.innerHTML = `<strong>${diaSemanaTexto(diaSemana)}, ${dia} de ${mes} de ${ano}</strong><br>${blocos}`;
        document.querySelectorAll(`#schedule-body tr[data-day="${diaSemana}"]`)
            .forEach(row => row.classList.add('current-day'));
    }
}

function diaSemanaTexto(i) {
    return ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"][i];
}