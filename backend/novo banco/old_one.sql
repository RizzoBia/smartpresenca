-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS data_pi;
USE data_pi;


ALTER TABLE Dim_aluno 
MODIFY COLUMN id_aluno INT AUTO_INCREMENT PRIMARY KEY;

START TRANSACTION;

ALTER TABLE Dim_aluno DROP PRIMARY KEY;

CREATE TABLE Dim_aluno (
    id_aluno INT PRIMARY KEY,
    nome VARCHAR(255),
    cpf VARCHAR(255),
    data_nascimento DATE,
    sexo VARCHAR(20),
    endereco VARCHAR(255),
    cidade_atual VARCHAR(255),
    curso VARCHAR(255),
    bolsa VARCHAR(255),
    ra INT
);

-- Criar tabela Dim_professor
CREATE TABLE Dim_professor (
    idprofessor INT PRIMARY KEY,
    nome VARCHAR(255),
    cpf VARCHAR(255),
    titulacao VARCHAR(255),
    rm INT
);



-- Criar tabela Dim_disciplina
CREATE TABLE Dim_disciplina (
    iddisciplina INT PRIMARY KEY,
    nome VARCHAR(255),
    codigo VARCHAR(255),
    curso VARCHAR(255)
);

-- Criar tabela Dim_turma
CREATE TABLE Dim_turma (
    idturma INT PRIMARY KEY,
    nome VARCHAR(255),
    ano_semestre VARCHAR(25)
);

-- Criar tabela Dim_tempo
CREATE TABLE Dim_tempo (
    id_tempo INT PRIMARY KEY,
    hora_inicio TIME,
    hora_fim TIME,
    data_aula DATE,
    dia_semana VARCHAR(25),
    mes INT,
    ano INT,
    semestre VARCHAR(25)
);

-- ✅ Criar tabela Dim_localizacao (foi o que faltou)
CREATE TABLE Dim_localizacao (
    id_localizacao INT PRIMARY KEY AUTO_INCREMENT,
    sala VARCHAR(50),
    bloco VARCHAR(50),
    campus VARCHAR(100)
);

-- Criar tabela Fato_presenca
CREATE TABLE Fato_presenca (
    id_presenca INT AUTO_INCREMENT PRIMARY KEY,
    id_aluno INT NOT NULL,
    id_disciplina INT NOT NULL,
    id_turma INT NOT NULL,
    id_tempo INT NOT NULL,
    id_professor INT NOT NULL,
    id_localizacao INT NOT NULL,
    data DATE NOT NULL,
    presente BOOLEAN NOT NULL,

    FOREIGN KEY (id_aluno) REFERENCES Dim_aluno(id_aluno),
    FOREIGN KEY (id_disciplina) REFERENCES Dim_disciplina(iddisciplina),
    FOREIGN KEY (id_turma) REFERENCES Dim_turma(idturma),
    FOREIGN KEY (id_tempo) REFERENCES Dim_tempo(id_tempo),
    FOREIGN KEY (id_professor) REFERENCES Dim_professor(idprofessor),
    FOREIGN KEY (id_localizacao) REFERENCES Dim_localizacao(id_localizacao)
);


USE data_pi;
INSERT INTO Dim_localizacao (sala, bloco, campus) VALUES
-- Campus Mantiqueira
('Sala 1', 'Bloco A', 'Mantiqueira'),
('Sala 2', 'Bloco A', 'Mantiqueira'),
('Sala 3', 'Bloco A', 'Mantiqueira'),
('Sala 4', 'Bloco B', 'Mantiqueira'),
('Sala 5', 'Bloco B', 'Mantiqueira');

INSERT INTO Dim_aluno (id_aluno, nome, cpf, data_nascimento, sexo, endereco, cidade_atual, curso, bolsa, ra) VALUES
(1, 'João Silva', '301.301.301-30', '2000-01-01', 'Masculino', 'Rua A, 123', 'São João da Boa Vista', 'Engenharia', 'Integral', 22035453),
(2, 'Maria Oliveira', '302.302.302-30', '2001-02-02', 'Feminino', 'Rua B, 456', 'Águas da Prata', 'Direito', 'Parcial', 21054666),
(3, 'Lucas Souza', '303.303.303-30', '1999-03-03', 'Masculino', 'Rua C, 789', 'Vargem Grande do Sul', 'Administração', 'Nenhuma', 23064596),
(4, 'Ana Costa', '304.304.304-30', '2002-04-04', 'Feminino', 'Rua D, 101', 'Espírito Santo do Pinhal', 'Pedagogia', 'Integral', 22049876),
(5, 'Bruno Fernandes', '305.305.305-30', '2000-05-05', 'Masculino', 'Rua E, 202', 'Ibitiúra de Minas', 'Agronomia', 'Parcial', 24128976),
(6, 'Isabela Martins', '306.306.306-30', '2001-06-06', 'Feminino', 'Rua F, 303', 'Santo Antônio do Jardim', 'Biomedicina', 'Integral', 23687412);


INSERT INTO Dim_professor (idprofessor, nome, cpf, titulacao,rm) VALUES
(1, 'Ana Beatriz Lima', '111.111.111-11', 'Mestre', 124569),
(2, 'Carlos Eduardo Silva', '222.222.222-22', 'Doutor', 178965),
(3, 'Fernanda Souza', '333.333.333-33', 'Especialista', 204596),
(4, 'João Pedro Almeida', '444.444.444-44', 'Doutor', 223548),
(5, 'Mariana Ribeiro', '555.555.555-55', 'Mestre', 236596);

INSERT INTO Dim_disciplina (iddisciplina, nome, codigo, curso) VALUES
(1, 'Matemática Aplicada', 'MAT101', 'Engenharia'),
(2, 'Direito Constitucional', 'DIR201', 'Direito'),
(3, 'Gestão de Pessoas', 'ADM301', 'Administração'),
(4, 'Didática', 'PED401', 'Pedagogia'),
(5, 'Solo e Clima', 'AGR501', 'Agronomia');


INSERT INTO Dim_turma (idturma, nome, ano_semestre) VALUES
(1, 'Turma A', '2025/1'),
(2, 'Turma B', '2025/1'),
(3, 'Turma C', '2025/1'),
(4, 'Turma D', '2025/1'),
(5, 'Turma E', '2025/1'),
(6, 'Turma F', '2025/1');


INSERT INTO Dim_tempo (id_tempo, hora_inicio, hora_fim, data_aula, dia_semana, mes, ano, semestre) VALUES
(1, '07:00:00', '08:40:00', '2025-04-21', 'Segunda-feira', 4, 2025, '2025/1'),
(2, '08:50:00', '10:30:00', '2025-04-22', 'Terça-feira', 4, 2025, '2025/1'),
(3, '10:40:00', '12:20:00', '2025-04-23', 'Quarta-feira', 4, 2025, '2025/1'),
(4, '13:30:00', '15:10:00', '2025-04-24', 'Quinta-feira', 4, 2025, '2025/1'),
(5, '15:20:00', '17:00:00', '2025-04-25', 'Sexta-feira', 4, 2025, '2025/1');


INSERT INTO Fato_presenca (id_aluno, id_disciplina, id_turma, id_tempo, id_professor, id_localizacao, data_aula, presente) VALUES
(1, 1, 1, 1, 1, 1, '2025-04-21', TRUE),
(2, 2, 2, 2, 2, 2, '2025-04-22', TRUE),
(3, 3, 3, 3, 3, 3, '2025-04-23', TRUE),
(4, 4, 4, 4, 4, 4, '2025-04-24', TRUE),
(5, 5, 5, 5, 5, 5, '2025-04-25', TRUE);

