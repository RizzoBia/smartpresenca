const API_URL = 'http://localhost:4040';

document.addEventListener('DOMContentLoaded', function () {
    const professor = JSON.parse(localStorage.getItem('professor'));

    if (!professor) {
        alert('Professor não autenticado.');
        window.location.href = '../login.html';
        return;
    }

    // Atualiza info do usuário
    const userInfoSpan = document.querySelector('.user-info span');
    userInfoSpan.textContent = `Prof. ${professor.nome}`;

    const studentSearch = document.getElementById('student-search');
    const studentsTbody = document.getElementById('students-tbody');
    const studentInfo = document.getElementById('student-info');
    const noResults = document.getElementById('no-results');
    const selectDisciplina = document.getElementById('subject-select-relatorio');
    const raContainer = document.getElementById('ra-search-container');

    let allStudentsData = [];
    let filteredStudents = [];

    fetch(`${API_URL}/presenca/teacher/${professor.rm}/resumo`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(res => {
            if (!res.ok) throw new Error('Erro ao carregar dados.');
            return res.json();
        })
        .then(data => {
            allStudentsData = data.map(item => {
                const totalBlocos = Number(item.total_aulas) * 3;
                const presencasBlocos = Number(item.presencas) * 3;
                const faltasBlocos = totalBlocos - presencasBlocos;
                const taxa = totalBlocos > 0 ? (presencasBlocos / totalBlocos) * 100 : 0;

                let status = 'APROVADO';
                if (taxa < 75) status = 'REPROVADO';
                else if (taxa < 80) status = 'ALERTA';

                return {
                    ra: item.ra,
                    name: item.nome_aluno,
                    discipline: item.disciplina,
                    totalAulas: totalBlocos,
                    presencas: presencasBlocos,
                    faltas: faltasBlocos,
                    taxa: parseFloat(taxa.toFixed(1)),
                    status
                };
            });

            const disciplinasUnicas = [...new Set(allStudentsData.map(s => s.discipline))];
            disciplinasUnicas.forEach(disc => {
                const option = document.createElement('option');
                option.value = disc;
                option.textContent = disc;
                selectDisciplina.appendChild(option);
            });
        })
        .catch(err => {
            console.error(err);
            studentsTbody.innerHTML = `<tr><td colspan="8">Erro ao carregar dados.</td></tr>`;
        });

    // Evento ao selecionar disciplina
    window.onSelectDisciplina = function () {
        const selected = selectDisciplina.value;

        const step3 = document.getElementById('step-lista-alunos');

        if (!selected) {
            raContainer.classList.add('hidden');
            step3.classList.add('hidden');
            studentsTbody.innerHTML = '';
            return;
        }

        raContainer.classList.remove('hidden');
        step3.classList.remove('hidden');

        filteredStudents = allStudentsData.filter(s => s.discipline === selected);
        loadFilteredStudents();
    };


    // Busca por RA dentro da disciplina selecionada
    studentSearch.addEventListener('input', function () {
        const searchRA = this.value.trim();

        searchStudent(searchRA); // sempre chama, mesmo com 1 caractere

    });

    function loadFilteredStudents() {
        studentsTbody.innerHTML = '';

        filteredStudents.forEach(student => {
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

    function removeDiacritics(str) {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    function searchStudent(searchInput) {
        const search = searchInput.trim().toLowerCase();

        if (search === '') {
            studentInfo.style.display = 'none';
            noResults.classList.remove('active');
            updateStudentTable(filteredStudents);
            return;
        }

        const foundStudents = filteredStudents.filter(student =>
            String(student.ra).includes(search) ||
            removeDiacritics(student.name.toLowerCase()).includes(removeDiacritics(search))
        );

        if (foundStudents.length === 1) {
            const student = foundStudents[0];

            document.getElementById('student-name').textContent = student.name;
            document.getElementById('student-ra').textContent = student.ra;
            document.getElementById('student-discipline').textContent = student.discipline;
            document.getElementById('student-total').textContent = student.totalAulas;
            document.getElementById('student-presences').textContent = student.presencas;
            document.getElementById('student-absences').textContent = student.faltas;
            document.getElementById('student-attendance').textContent = student.taxa + '%';

            const statusElement = document.getElementById('student-status');
            statusElement.textContent = student.status;
            statusElement.className = 'status ' + getStatusClass(student.status);

            studentInfo.style.display = 'block';
            noResults.classList.remove('active');
            updateStudentTable([student]);

        } else if (foundStudents.length > 1) {
            studentInfo.style.display = 'none';
            noResults.classList.remove('active');
            updateStudentTable(foundStudents);

        } else {
            studentInfo.style.display = 'none';
            noResults.classList.add('active');
            updateStudentTable([]);
        }
    }

    function updateStudentTable(students) {
        studentsTbody.innerHTML = '';

        if (students.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="8">Nenhum aluno encontrado.</td>`;
            studentsTbody.appendChild(row);
            return;
        }

        students.forEach(student => {
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

    // Menu toggle responsivo
    const menuToggle = document.querySelector('.header-menu-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            sidebar.classList.toggle('active');
        });
    }
    const editBtn = document.getElementById('edit-presence-btn');

    if (editBtn) {
        editBtn.addEventListener('click', () => {
            const ra = document.getElementById('student-ra').textContent;
            const nome = document.getElementById('student-name').textContent;
            const disciplina = document.getElementById('student-discipline').textContent;

            abrirModalPresencas(ra, disciplina, nome, professor.rm);
        });
    }

});
