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


    const studentSearch = document.getElementById('student-search');
    const studentsTbody = document.getElementById('students-tbody');
    const studentInfo = document.getElementById('student-info');
    const noResults = document.getElementById('no-results');

    let allStudentsData = [];

    fetch(`${API_URL}/frequencia/professor/${professor.rm}/resumo`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(res => {
            if (!res.ok) throw new Error('Erro ao carregar dados.');
            return res.json();
        })
        .then(data => {
            allStudentsData = data.map(item => ({
                ra: item.ra,
                name: item.nome_aluno,
                discipline: item.disciplina,
                totalAulas: item.total_aulas,
                presencas: item.presencas,
                faltas: item.faltas * 3,
                taxa: parseFloat(item.taxa_presenca),
                status: item.status
            }));

            loadAllStudents();
        })
        .catch(err => {
            console.error(err);
            studentsTbody.innerHTML = `<tr><td colspan="8">Erro ao carregar dados.</td></tr>`;
        });


    // Controle de menu
    const menuToggle = document.querySelector('.header-menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
        });
    }

    // Busca por RA
    studentSearch.addEventListener('input', function () {
        const searchRA = this.value.trim();

        if (searchRA.length >= 3) {
            searchStudent(searchRA);
        } else {
            studentInfo.style.display = 'none';
            noResults.classList.remove('active');
        }
    });

    function loadAllStudents() {
        studentsTbody.innerHTML = '';

        allStudentsData.forEach(student => {
            const row = document.createElement('tr');

            const statusClass = getStatusClass(student.status);

            row.innerHTML = `
                <td>${student.ra}</td>
                <td>${student.name}</td>
                <td>${student.discipline}</td>
                <td>${student.totalAulas}</td>
                <td>${student.presencas}</td>
                <td>${student.faltas}</td>
                <td>${student.taxa}</td>
                <td><span class="status ${statusClass}">${student.status}</span></td>
            `;

            studentsTbody.appendChild(row);
        });
    }

    function searchStudent(searchRA) {
        const foundStudent = allStudentsData.find(student =>
            String(student.ra).includes(searchRA)
        );

        if (foundStudent) {
            document.getElementById('student-name').textContent = foundStudent.name;
            document.getElementById('student-ra').textContent = foundStudent.ra;
            document.getElementById('student-discipline').textContent = foundStudent.discipline;
            document.getElementById('student-total').textContent = foundStudent.totalAulas;
            document.getElementById('student-presences').textContent = foundStudent.presencas;
            document.getElementById('student-absences').textContent = foundStudent.faltas;
            document.getElementById('student-attendance').textContent = foundStudent.taxa + '%';

            const statusElement = document.getElementById('student-status');
            statusElement.textContent = foundStudent.status;
            statusElement.className = 'status ' + getStatusClass(foundStudent.status);

            studentInfo.style.display = 'block';
            noResults.classList.remove('active');
        } else {
            studentInfo.style.display = 'none';
            noResults.classList.add('active');
        }
    }

    function getStatusClass(status) {
        switch (status) {
            case 'APROVADO':
                return 'status-present';
            case 'ALERTA':
                return 'status-warning';
            case 'REPROVADO':
                return 'status-danger';
            default:
                return 'status-present';
        }
    }
});
