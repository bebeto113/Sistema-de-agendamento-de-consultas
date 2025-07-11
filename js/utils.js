const AGENDAMENTOS_MOCK_DATA = [

];

function carregarAgendamentos() {

    try {
        const agendamentosJSON = localStorage.getItem('agendamentos');
        if (agendamentosJSON) {
            const agendamentos = JSON.parse(agendamentosJSON);
            if (agendamentos.length === 0 && AGENDAMENTOS_MOCK_DATA.length > 0) {
                salvarAgendamentos(AGENDAMENTOS_MOCK_DATA);
                return AGENDAMENTOS_MOCK_DATA;
            }
            return agendamentos;
        }
    } catch (error) {
        console.error('Erro ao carregar agendamentos do localStorage:', error);
    }

    salvarAgendamentos(AGENDAMENTOS_MOCK_DATA);
    return AGENDAMENTOS_MOCK_DATA;
}

function salvarAgendamentos(agendamentos) {
    try {
        const agendamentosJSON = JSON.stringify(agendamentos);
        localStorage.setItem('agendamentos', agendamentosJSON);
    } catch (error) {
        console.error('Erro ao salvar agendamentos no localStorage:', error);
    }
}

function gerarUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function formatarDataHora(dataHoraString) {
    if (!dataHoraString) {
        return 'Data/Hora Inválida';
    }

    try {
        // Substitui espaço por 'T' para formar ISO e cria objeto Date
        const data = new Date(dataHoraString.replace(' ', 'T')); // ➡️

        if (isNaN(data.getTime())) {
            return 'Data Inválida';
        }

        // Monta string no formato: "15 de Julho de 2025 às 10:30"
        const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']; // ➡️

        const dia = data.getDate();
        const mes = meses[data.getMonth()];
        const ano = data.getFullYear();

        const horas = data.getHours().toString().padStart(2, '0');
        const minutos = data.getMinutes().toString().padStart(2, '0');

        return `${dia} de ${mes} de ${ano} às ${horas}:${minutos}`; // ➡️

    } catch (error) {
        console.error('Erro ao formatar data/hora:', error);
        return 'Erro na Formatação';
    }
}

function verificarConflitoAgendamento(novoAgendamento, listaAgendamentosExistentes) {
    if (!novoAgendamento || !novoAgendamento.data || !novoAgendamento.hora || !listaAgendamentosExistentes) {
        mostrarNotificacao('Dados incompletos para verificar conflito de agendamento.', 'error');
        return false;
    }

    try {
        // Cria objeto Date do novo agendamento
        const dataHoraNovo = new Date(`${novoAgendamento.data}T${novoAgendamento.hora}:00`); // ➡️

        if (isNaN(dataHoraNovo.getTime())) {
            console.error('Data/Hora do novo agendamento é inválida para verificação de conflito:', novoAgendamento);
            return false;
        }

        for (const agendamentoExistente of listaAgendamentosExistentes) {
            if (agendamentoExistente.data && agendamentoExistente.hora && agendamentoExistente.id !== novoAgendamento.id) {

                const dataHoraExistente = new Date(`${agendamentoExistente.data}T${agendamentoExistente.hora}:00`); // ➡️

                if (isNaN(dataHoraExistente.getTime())) {
                    console.warn('Agendamento existente com data/hora inválida, ignorado na verificação de conflito:', agendamentoExistente);
                    continue;
                }

                // Compara se são o mesmo minuto
                if (dataHoraNovo.getTime() === dataHoraExistente.getTime()) { // ➡️
                    return true;
                }
            }
        }

        return false;
    } catch (error) {
        console.error('Erro na verificação de conflito de agendamento:', error);
        return false;
    }
}

function mostrarNotificacao(mensagem, tipo = 'info') {
    let backgroundColor = '#333';

    switch (tipo) {
        case 'success':
            backgroundColor = '#4CAF50';
            break;
        case 'error':
            backgroundColor = '#F44336';
            break;
        case 'warning':
            backgroundColor = '#FF9800';
            break;
        case 'info':
        default:
            backgroundColor = '#2196F3';
            break;
    }

    if (typeof window.Toastify !== 'undefined') {
        window.Toastify({
            text: mensagem,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: { background: backgroundColor },
            onClick: function () {}
        }).showToast();
    } else {
        alert(mensagem);
        console.warn("Toastify-JS não está disponível. Usando alert() para notificações.");
    }
}

function redirecionar(url) {
    if (url) {
        window.location.href = url;
    } else {
        console.error('URL para redirecionamento inválida ou vazia.');
        mostrarNotificacao('Erro: Não foi possível redirecionar.', 'error');
    }
}

async function confirmarAcao(titulo, texto) {
    if (typeof window.Swal !== 'undefined') {
        try {
            const result = await window.Swal.fire({
                title: titulo,
                text: texto,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#007bff',
                cancelButtonColor: '#dc3545',
                confirmButtonText: 'Sim, continuar!',
                cancelButtonText: 'Cancelar'
            });

            return result.isConfirmed;
        } catch (error) {
            console.error('Erro ao exibir SweetAlert2 de confirmação:', error);
            return window.confirm(`${titulo}\n${texto}`);
        }
    } else {
        console.warn("SweetAlert2 não está disponível. Usando confirm() padrão para confirmação.");
        return window.confirm(`${titulo}\n${texto}`);
    }
}

const USUARIOS_STORAGE_KEY = 'usuariosLumnerBooth';

function carregarUsuarios() {
    const usuariosJSON = localStorage.getItem(USUARIOS_STORAGE_KEY);
    return usuariosJSON ? JSON.parse(usuariosJSON) : [];
}

function salvarUsuarios(usuarios) {
    localStorage.setItem(USUARIOS_STORAGE_KEY, JSON.stringify(usuarios));
}

function salvarUsuarioLogado(usuario) {
    sessionStorage.setItem('usuarioLogado', JSON.stringify(usuario));
}

function carregarUsuarioLogado() {
    const usuarioJson = sessionStorage.getItem('usuarioLogado');
    return usuarioJson ? JSON.parse(usuarioJson) : null;
}

// Função para formatar Date para "YYYY-MM-DD" ➡️
function formatarDataYYYYMMDD(date) {
    const ano = date.getFullYear();
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const dia = date.getDate().toString().padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
}

// Função para gerar horários disponíveis sem date-fns ➡️
function gerarHorariosDisponiveis(dateObj) {

    const todosAgendamentos = carregarAgendamentos();

    const dataFormatada = formatarDataYYYYMMDD(dateObj); // ➡️

    const agendamentosOcupadosNoDia = todosAgendamentos.filter(agendamento =>
        agendamento.data === dataFormatada
    );

    const horariosOcupados = new Set(agendamentosOcupadosNoDia.map(ag => ag.hora));

    const horariosPadrao = [
        '09:00', '09:30', '10:00', '10:30',
        '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30'
    ];

    return horariosPadrao.filter(hora => !horariosOcupados.has(hora));
}

function carregarAgendamentosDoCliente(clienteId) {
    const agendamentos = carregarAgendamentos();
    return agendamentos.filter(agendamento => agendamento.clienteId === clienteId)
        .sort((a, b) => {
            const dateA = new Date(`${a.data}T${a.hora}`);
            const dateB = new Date(`${b.data}T${b.hora}`);
            return dateA - dateB; // ➡️
        });
}
