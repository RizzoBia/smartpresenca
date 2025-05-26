-- View corrigida para frequência de alunos
CREATE VIEW frequencia_aluno AS
SELECT 
    a.id_aluno,
    a.nome AS nome_aluno,
    a.ra,
    d.nome AS disciplina,
    d.codigo AS codigo_disciplina,
    COUNT(fp.id_presenca) AS total_registros,
    SUM(CASE WHEN fp.presente = 1 THEN 1 ELSE 0 END) AS presencas,
    SUM(CASE WHEN fp.presente = 0 THEN 1 ELSE 0 END) AS faltas,
    ROUND(
        (SUM(CASE WHEN fp.presente = 1 THEN 1 ELSE 0 END) / COUNT(fp.id_presenca)) * 100, 
        1
    ) AS percentual_presenca
FROM Fato_presenca fp
JOIN Dim_aluno a ON fp.id_aluno = a.id_aluno
JOIN Dim_disciplina d ON fp.id_disciplina = d.iddisciplina
GROUP BY a.id_aluno, a.nome, a.ra, d.iddisciplina, d.nome, d.codigo
ORDER BY a.nome, d.nome;


CREATE VIEW ranking_frequencia_curso AS
SELECT 
    a.curso,
    COUNT(DISTINCT a.id_aluno) AS total_alunos,
    AVG(CASE WHEN p.presente = 1 THEN 100.0 ELSE 0.0 END) AS frequencia_media_curso,
    COUNT(p.id_presenca) AS total_aulas_curso
FROM fato_presenca p
JOIN dim_aluno a ON p.id_aluno = a.id_aluno
GROUP BY a.curso
ORDER BY frequencia_media_curso DESC;


CREATE VIEW desempenho_professor AS
SELECT 
    prof.nome AS nome_professor,
    prof.titulacao,
    COUNT(DISTINCT p.id_disciplina) AS disciplinas_lecionadas,
    COUNT(DISTINCT p.id_aluno) AS total_alunos_atendidos,
    AVG(CASE WHEN p.presente = 1 THEN 100.0 ELSE 0.0 END) AS frequencia_media_turmas,
    COUNT(p.id_presenca) AS total_aulas_ministradas
FROM fato_presenca p
JOIN dim_professor prof ON p.id_professor = prof.idprofessor
GROUP BY prof.idprofessor, prof.nome, prof.titulacao
ORDER BY frequencia_media_turmas DESC;


CREATE VIEW frequencia_por_periodo AS
SELECT 
    t.hora_inicio,
    t.hora_fim,
    t.dia_semana,
    COUNT(p.id_presenca) AS total_aulas,
    SUM(CASE WHEN p.presente = 1 THEN 1 ELSE 0 END) AS total_presencas,
    ROUND(SUM(CASE WHEN p.presente = 1 THEN 1 ELSE 0 END) / COUNT(p.id_presenca) * 100, 1) AS percentual_frequencia
FROM fato_presenca p
JOIN dim_tempo t ON p.id_tempo = t.id_tempo
GROUP BY t.hora_inicio, t.hora_fim, t.dia_semana
ORDER BY t.dia_semana, t.hora_inicio;


CREATE VIEW comparativo_bolsistas AS
SELECT 
    CASE 
        WHEN a.bolsa IS NULL OR a.bolsa = '' THEN 'Não Bolsista'
        ELSE 'Bolsista'
    END AS tipo_aluno,
    a.bolsa,
    COUNT(DISTINCT a.id_aluno) AS quantidade_alunos,
    AVG(CASE WHEN p.presente = 1 THEN 100.0 ELSE 0.0 END) AS frequencia_media,
    COUNT(p.id_presenca) AS total_registros
FROM fato_presenca p
JOIN dim_aluno a ON p.id_aluno = a.id_aluno
GROUP BY 
    CASE 
        WHEN a.bolsa IS NULL OR a.bolsa = '' THEN 'Não Bolsista'
        ELSE 'Bolsista'
    END,
    a.bolsa
ORDER BY frequencia_media DESC;


CREATE VIEW frequencia_por_genero AS
SELECT 
    a.sexo,
    a.curso,
    COUNT(DISTINCT a.id_aluno) AS total_alunos,
    AVG(CASE WHEN p.presente = 1 THEN 100.0 ELSE 0.0 END) AS frequencia_media,
    COUNT(p.id_presenca) AS total_aulas_registradas
FROM fato_presenca p
JOIN dim_aluno a ON p.id_aluno = a.id_aluno
GROUP BY a.sexo, a.curso
ORDER BY a.curso, frequencia_media DESC;
