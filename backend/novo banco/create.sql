-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS banco_pi;
USE banco_pi;


-- ALTER TABLE Dim_aluno 
-- MODIFY COLUMN id_aluno INT AUTO_INCREMENT PRIMARY KEY;

START TRANSACTION;

-- ALTER TABLE Dim_aluno DROP PRIMARY KEY;

CREATE TABLE Dim_aluno (
    id_aluno INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    cpf VARCHAR(255),
    data_nascimento DATE,
    sexo VARCHAR(20),
    endereco VARCHAR(255),
    cidade_atual VARCHAR(255),
    curso VARCHAR(255),
    bolsa VARCHAR(255),
    ra INT,
    email VARCHAR(255),
    senha VARCHAR(255)
);

-- Criar tabela Dim_professor
CREATE TABLE Dim_professor (
    idprofessor INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    cpf VARCHAR(255),
    titulacao VARCHAR(255),
    rm INT,
	email VARCHAR(255),
    senha VARCHAR(255)
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