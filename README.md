<h1 align="center">
  SmartPresença - Automação da Chamada nas Salas de Aula
</h1>

<p align="center">
  <em>Sistema de presença automatizada com leitura via QR Code e autenticação via RA e RM</em>
</p>

---

## 📘 Sobre o Projeto

O **SmartPresença** é um sistema desenvolvido com o objetivo de automatizar o controle de presença nas salas de aula de instituições de ensino. A chamada é feita por meio da geração e leitura de QR Codes, integrando hardware (ESP32-CAM) e software web.

O projeto contempla a criação de um sistema com dois perfis principais: **aluno** e **professor**, cada um com permissões específicas.

---

## 🎯 Objetivos

- Automatizar a chamada em sala de aula com QR Code válido por tempo limitado.
- Evitar fraudes na marcação de presença.
- Facilitar a gestão de frequências por parte dos professores.
- Permitir autenticação via:
  - **RA** (Registro do Aluno)
  - **RM** (Registro do Professor)

---

## 👥 Tipos de Login e Funcionalidades

### 👨‍🏫 Professor (login por RM)
- Acesso ao painel de controle da aula.
- Geração de código de sessão.
- Geração de QR Code temporário (válido por 10 minutos).
- Edição de presenças dos alunos.

### 👨‍🎓 Aluno (login por RA)
- Acesso à Grade Horária do semestre.
- Visualização de suas presenças e faltas.

---

## 🖥️ Como Executar o Projeto Localmente

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/smartpresenca.git
```

2. **Ao abrir a pasta, no terminal do VSCode mude o diretório para a pasta backend**
```bash
cd smartpresenca/backend
```

3. **Instale todas as dependências necessárias para a API rodar**
```bash
npm install express cors knex mysql2 jsonwebtoken dotenv
```

4. **Configure o `.env` de acordo com o exemplo abaixo:**
```bash
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=smartpresenca
JWT_SECRET=sua_chave_secreta
```

5. **Crie o banco de dados básico utilizado para esse projeto no MySQL:**
```bash
arquivo create.sql
arquivo inserts.sql
arquivo views.sql
```

6. **Inicie o servidor:**
```bash
npm start
```

## Ferramentas
[![GitHub](https://img.shields.io/badge/GitHub-000?style=for-the-badge&logo=github&logoColor=30A3DC)](https://docs.github.com/)
[![Git](https://img.shields.io/badge/Git-000?style=for-the-badge&logo=git&logoColor=E94D5F)](https://git-scm.com/doc) 
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![MySQL Workbench](https://img.shields.io/badge/MySQL_Workbench-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-003B57?style=for-the-badge&logo=database&logoColor=white)
![VSCode](https://img.shields.io/badge/VSCode-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
---

## 👨‍💻 Desenvolvido por

Este projeto foi desenvolvido por alunos do curso de Análise e Desenvolvimento de Software e Ciência da Computação da **UNIFEOB**, como projeto integrado do módulo de Desenvolvimento de Soluções Web Inteligentes e Integradas.

### Equipe de Desenvolvimento

- **Beatriz Rizzo** 
- **Lívia Menato** 
- **Maria Procópio** 
- **Luis Miguel**
---

Desenvolvido com foco em inovação, praticidade e segurança no ambiente educacional.


