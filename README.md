Claro! Aqui está uma versão mais organizada, decorada e profissional do seu texto para colocar no **README.md** do GitHub:

---

# 🦷 LumerMouth – Sistema de Agendamento Odontológico

LumerMouth é uma aplicação web front-end que simula um sistema completo de agendamento de consultas para clínicas odontológicas. Desenvolvido com **HTML**, **CSS** e **JavaScript puro**, o projeto não depende de back-end, utilizando o **localStorage** para persistência de dados de usuários e agendamentos.

O sistema oferece dois painéis distintos com experiências personalizadas: um para **Clientes** e outro para **Proprietários**, proporcionando uma navegação intuitiva e segmentada.

---

## ✨ Funcionalidades Principais

### 🔐 Sistema de Autenticação

* **Cadastro de Usuário:** Registro com validação em tempo real, com opção de criar conta como *Cliente* ou *Proprietário*.
* **Login Seguro:** Autenticação via e-mail e senha.
* **Controle de Acesso:** Redirecionamento automático para o painel do perfil correspondente.
* **Sessão de Usuário:** Gerenciamento de sessão com `sessionStorage`.

---

### 👩‍⚕️ Painel do Cliente

* **Dashboard Intuitivo:** Interface moderna e objetiva.
* **Calendário Dinâmico:** Navegação entre meses com geração automática dos dias.
* **Horários Disponíveis:** Exibição dinâmica com base nos agendamentos existentes.
* **Agendamento de Consultas:** Modal interativo com escolha de serviço e observações.
* **Meus Eventos:** Seção para visualização e cancelamento de agendamentos futuros.
* **Logout Seguro:** Encerramento de sessão com proteção de acesso.

---

### 🧑‍💼 Painel do Proprietário

* **Visão Geral Centralizada:** Listagem de todas as consultas agendadas na clínica.
* **Detalhamento das Consultas:** Informações completas com data, horário, serviço, cliente e ID.
* **Gestão Facilitada:** Gerenciamento centralizado das operações da clínica.

---

## ⚙️ Funcionalidades Técnicas

* **Persistência Local:** Uso de `localStorage` para simular um banco de dados.
* **Notificações Visuais:** Feedback ao usuário com **Toastify.js**.
* **Caixas de Diálogo Interativas:** Confirmações e alertas com **SweetAlert2**.
* **Design Responsivo:** Layout adaptado para diversos tamanhos de tela (foco em desktop).
* **Código Modularizado:** Arquivo `utils.js` centraliza funções reutilizáveis como UUID, notificações e manipulação de datas.

---

## 🛠 Tecnologias Utilizadas

| Tecnologia            | Descrição                                 |
| --------------------- | ----------------------------------------- |
| **HTML5**             | Estrutura semântica das páginas           |
| **CSS3**              | Estilização com variáveis, Flexbox e Grid |
| **JavaScript (ES6+)** | Manipulação do DOM, validações e lógica   |
| **Toastify.js**       | Notificações leves e elegantes            |
| **SweetAlert2**       | Alertas e diálogos personalizados         |
| **Pravatar**          | Geração dinâmica de avatares para perfis  |

---

## 📌 Status do Projeto

✅ Finalizado – MVP funcional com todas as principais funcionalidades implementadas.
🔧 Futuras melhorias poderão incluir:

* Responsividade total (mobile-first)
* Filtro por dentistas no painel do proprietário
* Exportação de dados (PDF ou Excel)
* Integração com Firebase ou banco real


