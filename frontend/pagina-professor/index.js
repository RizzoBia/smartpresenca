const API_URL = 'http://localhost:4040';

document.addEventListener('DOMContentLoaded', function () {
    const professor = JSON.parse(localStorage.getItem('professor'));

    if (!professor) {
        alert('Professor não autenticado.');
        window.location.href = '/login.html';
        return;
    }

    // Atualiza info do usuário
    const userInfoSpan = document.querySelector('.user-info span');
    userInfoSpan.textContent = `Prof. ${professor.nome}`;

    const token = localStorage.getItem('token');
    const rm = professor.rm;

    // Atualiza a data
    const hoje = new Date();
    const diaSemana = hoje.getDay(); // 0 = Domingo ... 6 = Sábado
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    const dataAtual = `${dia}/${mes}/${ano}`;

    document.querySelectorAll('.data-atual').forEach(el => {
        el.innerText = dataAtual;
    });

    console.log('Hoje é dia: ', diaSemana);

    // Verifica aula do dia
    fetch(`${API_URL}/professor/aulas/${rm}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => {
            if (!res.ok) throw new Error('Erro ao buscar aulas do professor');
            return res.json();
        })
        .then(aulas => {
            console.log('Aulas recebidas: ', aulas);

            const aulasHoje = aulas.filter(aula => String(aula.dia_semana_num) === String(diaSemana));

            console.log('Aulas de hoje: ', aulasHoje);
            
//            Atualiza o status da aula
            let statusTexto = '';
            if (aulasHoje.length > 0) {
                statusTexto = aulasHoje.map(a => {
                    const inicio = a.hora_inicio.slice(0, 5);
                    const fim = a.hora_fim.slice(0, 5);
                    return `${a.disciplina} (${inicio} - ${fim})`;
                }).join(', ');

            } else {
                statusTexto = 'Nenhuma aula no momento';
            }

            document.querySelectorAll('.status-aula').forEach(el => {
                el.innerText = statusTexto;
            });
        })
        .catch(err => {
            console.error('Erro ao verificar aula do dia:', err);
            document.querySelectorAll('.status-aula').forEach(el => {
                el.innerText = 'Erro ao carregar aulas';
            });
        });

    // Controle de menu
    const menuToggle = document.querySelector('.header-menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
        });
    }
});
