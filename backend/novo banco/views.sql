CREATE VIEW view_frequencia_aluno AS
SELECT 
    a.id_aluno,
    a.nome AS nome_aluno,
    a.ra,
    d.nome AS disciplina,
    COUNT(p.id_presenca) AS total_registros,
    SUM(CASE WHEN p.presente = 1 THEN 1 ELSE 0 END) AS presencas,
    SUM(CASE WHEN p.presente = 0 THEN 1 ELSE 0 END) AS faltas,
    -- ROUND(SUM(CASE WHEN p.presente = 1 THEN 1 ELSE 0 END) / COUNT(p.id_presenca) * 100, 1) AS percentual_presenca
FROM fato_presenca p
JOIN dim_aluno a ON p.id_aluno = a.id_aluno
JOIN dim_disciplina d ON p.id_disciplina = d.iddisciplina
GROUP BY a.id_aluno, d.iddisciplina;

-------------------------------------------------
