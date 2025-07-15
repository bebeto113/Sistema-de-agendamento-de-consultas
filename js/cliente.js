////// Parte funcional

document.addEventListener('DOMContentLoaded', () => {
    let selectedDate = null   //vai ser tipo nosso .target aqui

    const loggedInUser = carregarUsuarioLogado()

    if (!loggedInUser) {
        mostrarNotificacao('Você precisa estar logado para acessar esta página.', 'error')
        redirecionar('login.html')
        return
    }

    const telaAgendamento = document.getElementById('bookingModal')
    const telaAgendamentoOverLay = document.getElementById('bookingModalOverlay')

    const inputData = document.getElementById('modalBookingDate')
    const horarioSelect = document.getElementById('modalBookingTime')
    const tipoServico = document.getElementById('modalServiceType')
    const observacoes = document.getElementById('modalNotes')

    const btnConfirmar = document.querySelector('.confirm-booking-btn')
    const btnCancelar = document.querySelector('.cancel-booking-btn')
    const xCancelar = document.querySelector('.close-modal-btn')

    const btnAgendarConsultas = document.getElementById('btnAgendarNovoEvento')

    ////SIDEBAR////

    const perfil = document.querySelector('.user-profile')
    const sideBar = document.querySelector('.sidebar')
    const closeSideBar = document.querySelector('.close-sidebar-btn')

    perfil.addEventListener('click', () => {
        sideBar.classList.toggle('open')  //toggle, ele sempre faz o contrario, se tem a classe 'ativo', ele tira
        // se nao tem a classe, ele coloca
    })

    closeSideBar.addEventListener('click', () => {
        sideBar.classList.remove('open')
    })

    ////AGENDAMENTOS//////

    btnAgendarConsultas.addEventListener('click', () => {
        telaAgendamento.classList.add('active')
        telaAgendamentoOverLay.classList.add('active')
    })

    btnCancelar.addEventListener('click', () => {
        telaAgendamento.classList.remove('active')
        telaAgendamentoOverLay.classList.remove('active')

        inputData.value = ''
        horarioSelect.innerHTML = '<option value="">Selecione uma data</option>'
        tipoServico.value = ''
        observacoes.value = ''
    })

    xCancelar.addEventListener('click', () => {
        telaAgendamento.classList.remove('active')
        telaAgendamentoOverLay.classList.remove('active')

        inputData.value = ''
        horarioSelect.innerHTML = '<option value="">Selecione uma data</option>'
        tipoServico.value = ''
        observacoes.value = ''
    })

    ////PARTE DO MENU DE AGENDAMENTOS///

    function carregarEPreencherHorariosModal() {

        const dateString = inputData.value

        if (!dateString) {
            horarioSelect.innerHTML = '<option value="">Selecione uma data</option>'
            selectedDate = null // Garante que selectedDate é nula se não houver data
            return
        }

        // Converte a string da data para um objeto Date
        const partes = dateString.split('-'); // ➡️ O `.split('-')` divide essa string nas posições onde há hífens (`-`). //Resultado: `partes = ["2025", "07", "09"]`
        const parsedDate = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2])); // ➡️ Essa forma do Date cria um novo objeto de data, usando números como entrada: new Date(2025, 6, 9)

        if (isNaN(parsedDate.getTime())) { // Verifica se a data é válida
            horarioSelect.innerHTML = '<option value="">Data inválida</option>'
            selectedDate = null
            return
        }

        selectedDate = parsedDate // Atualiza selectedDate com a data do input

        // Agora, usa a função gerarHorariosDisponiveis do utils.js
        const horariosDisponiveis = gerarHorariosDisponiveis(selectedDate)

        horarioSelect.innerHTML = '<option value="">Selecione um horário</option>'

        if (horariosDisponiveis.length === 0) {
            horarioSelect.innerHTML = '<option value="">Nenhum horário disponível</option>'
        } else {
            horariosDisponiveis.forEach(hora => {
                const option = document.createElement('option')
                option.value = hora
                option.textContent = hora
                horarioSelect.appendChild(option)
            })
        }
    }
    inputData.addEventListener('change', carregarEPreencherHorariosModal)


    //////////////////////////////////////////

    btnConfirmar.addEventListener('click', () => {
        if (!loggedInUser) {
            mostrarNotificacao('Você precisa estar logado para agendar uma consulta.', 'warning')
            return
        }

        const dataAgendamento = inputData.value
        const horaAgendamento = horarioSelect.value
        const tipoServicoAgendamento = tipoServico.value
        const observacoesAgendamento = observacoes.value

        if (!dataAgendamento || !horaAgendamento || !tipoServicoAgendamento) {
            mostrarNotificacao('Por favor, preencha todos os campos obrigatórios (Data, Horário e Tipo de Serviço).', 'error')
            return
        }

        const novoAgendamento = {
            id: gerarUUID(),
            clienteId: loggedInUser.id,
            nome: loggedInUser.name,
            data: dataAgendamento,
            hora: horaAgendamento,
            servico: tipoServicoAgendamento,
            observacoes: observacoesAgendamento,
            status: 'Confirmado'
        }

        const todosAgendamentos = carregarAgendamentos()

        if (verificarConflitoAgendamento(novoAgendamento, todosAgendamentos)) {
            mostrarNotificacao('O horário selecionado já está ocupado. Por favor, escolha outro.', 'warning')
            return
        }

        todosAgendamentos.push(novoAgendamento)
        salvarAgendamentos(todosAgendamentos)

        mostrarNotificacao('Agendamento realizado com sucesso!', 'success')

        telaAgendamento.classList.remove('active')
        telaAgendamentoOverLay.classList.remove('active')

        inputData.value = ''
        horarioSelect.innerHTML = '<option value="">Selecione uma data</option>'
        tipoServico.value = ''
        observacoes.value = ''

    })

    /////CALENDARIO(PRINCIPAL) FUNCIONANDO

    let currentCalendarDate = new Date() //guarda uma data completa (ano, mes, dia, etc)

    const calendarioCabecalho = document.querySelector('.calendar-header h3')
    const btnMesAnterior = document.querySelector('.calendar-header button:first-child')
    const btnMesProximo = document.querySelector('.calendar-header button:last-child')

    btnMesAnterior.addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1)  //getMonth extrai o numero do mes no js (ex: janeiro = 0, dezembro = 11)
        atualizarCalendario()                                               //o setMonth é mt legal, faz mo trabalhao pra gente, ele atualiza o mes dentro do "currentCalendarDate", entao, se tiver no 12 (11 + 1) ele vai para janeiro do proximo mes automaticamente
    })

    btnMesProximo.addEventListener('click', () => {
        currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1)
        atualizarCalendario()
    })

    function atualizarCalendario() {

        const ano = currentCalendarDate.getFullYear()  //retorna o ano completo, para sabermos em qual ano esta o calendario
        const mes = currentCalendarDate.getMonth()    //retorna o mês, de 0 a 11

        const nomesMeses = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ]

        calendarioCabecalho.textContent = `${nomesMeses[mes]} ${ano}`   //se mes = 6, o nome será nomesMeses[6] = Julho
        renderizarCalendario()
    }


    function renderizarCalendario() {

        const containerDias = document.querySelector('.days')

        containerDias.innerHTML = ''

        const ano = currentCalendarDate.getFullYear()
        const mes = currentCalendarDate.getMonth()

        const primeiroDiaMes = new Date(ano, mes, 1)
        const ultimoDiaMes = new Date(ano, mes + 1, 0)

        const totalDias = ultimoDiaMes.getDate()

        for (let dia = 1; dia <= totalDias; dia++) {

            const divDia = document.createElement('div')   //bascimente, essas duas linhas sao responsaveis por colocar a quatindade certa de dias no calendario
            divDia.textContent = dia

            containerDias.appendChild(divDia)  //aqui estamos apenas deixando elas visiveis no site

            // Verifica se é o dia selecionado para adicionar classe
            if (selectedDate && selectedDate.getDate() === dia && selectedDate.getMonth() === mes && selectedDate.getFullYear() === ano) { //no final, o selectedDate ajuda a obter um resultado assim: selectedDate = new Date(2025, 6, 9)

                divDia.classList.add('selected')
            }

            divDia.addEventListener('click', () => {
                selectedDate = new Date(ano, mes, dia) //Aqui, o selectedDate recebe o objeto Date daquele dia que foi clicado (ano, mes e dia)

                // Remove .selected de todos os dias e adiciona no clicado
                document.querySelectorAll('.days div').forEach(div => div.classList.remove('selected'))

                divDia.classList.add('selected')

                // Atualiza o texto da aba "Horários Disponíveis"
                const horariosTitulo = document.getElementById('horariosDisponiveis')
                horariosTitulo.textContent = `Horários Disponíveis (${dia.toString().padStart(2, '0')}/${(mes + 1).toString().padStart(2, '0')})`

                // Aqui pode chamar uma função para atualizar os horários disponíveis para essa data
                atualizarHorariosDisponiveis(selectedDate)
            })
        }
    }

    function atualizarHorariosDisponiveis(data) {

        const containerSlots = document.querySelector('.available-slots')
        containerSlots.innerHTML = '' // Limpa os horários anteriores

        const horarios = gerarHorariosDisponiveis(data)

        if (horarios.length === 0) {
            containerSlots.innerHTML = '<p>Nenhum horário disponível.</p>'
            return
        }

        horarios.forEach(hora => {
            const slotDiv = document.createElement('div')
            slotDiv.classList.add('slot')
            slotDiv.textContent = hora + ' '

            const btnAgendar = document.createElement('button')
            btnAgendar.textContent = 'Agendar'
            btnAgendar.classList.add('btn-book')

            btnAgendar.addEventListener('click', () => {

                document.getElementById('bookingModal').classList.add('active')
                document.getElementById('bookingModalOverlay').classList.add('active')

                // Preencher data no input
                const inputData = document.getElementById('modalBookingDate')
                const horarioSelect = document.getElementById('modalBookingTime')
                const tipoServico = document.getElementById('modalServiceType')
                const observacoes = document.getElementById('modalNotes')

                // Formata a data para yyyy-mm-dd
                const yyyy = data.getFullYear()
                const mm = String(data.getMonth() + 1).padStart(2, '0')
                const dd = String(data.getDate()).padStart(2, '0')
                inputData.value = `${yyyy}-${mm}-${dd}`

                inputData.dispatchEvent(new Event('change'))

                setTimeout(() => {
                    horarioSelect.value = hora
                }, 10)

                tipoServico.value = ''
                observacoes.value = ''

            })

            slotDiv.appendChild(btnAgendar)
            containerSlots.appendChild(slotDiv)
        })
    }

    function mostrarProximasConsultas() {

        const meusEventos = document.querySelector('.appointment-list')
        meusEventos.innerHTML = ''

        const proximasConsultas = carregarAgendamentosDoCliente(loggedInUser.id)

        if (proximasConsultas.length === 0) {
            meusEventos.innerHTML = '<p>Nenhuma data agendada</p>'
            return
        }

        proximasConsultas.sort((a, b) => {
            const dataA = new Date(`${a.data}T${a.hora}`)
            const dataB = new Date(`${b.data}T${b.hora}`)
            return dataA - dataB
        })

        proximasConsultas.forEach(agendamento => {
            const item = document.createElement('div')
            item.classList.add('appointment-item')

            // Converte data para formato legível
            const [ano, mes, dia] = agendamento.data.split('-')

            const nomeMes = [
                'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ][parseInt(mes) - 1]

            const dataFormatada = `${parseInt(dia)} de ${nomeMes} de ${ano}`

            item.innerHTML = `
            <p><strong>${dataFormatada}</strong><span>${agendamento.hora}</span></p>
            <p>${agendamento.servico}</p>
        `

            meusEventos.appendChild(item)
        })
    }

    ////LOGOUT/////

    const btnLogout = document.getElementById('logout-btn')

    btnLogout.addEventListener('click', removerUsuarioLogado)

    function removerUsuarioLogado() {
        sessionStorage.removeItem('usuarioLogado');

        mostrarNotificacao('Logout realizado, redirecionando para página de Login','success')

        setTimeout(() => {
            redirecionar('login.html')
        }, 1500);
    }

    ////MEUS EVENTOS/////

    const btnMeusEventos = document.getElementById('myEvents')
    const btnXFechar = document.getElementById('fecharMeusEventos')

    const modalEventosOverlay = document.getElementById('meusEventosOverlay')
    const meusEventos = document.getElementById('meusEventosJs')

    btnMeusEventos.addEventListener('click', () => {
        modalEventosOverlay.classList.add('active')
        sideBar.classList.remove('open')

        mostrarMeusEventos()

    })

    btnXFechar.addEventListener('click', () => {
        modalEventosOverlay.classList.remove('active')
    })


    function mostrarMeusEventos() {

        const proximasConsultas = carregarAgendamentosDoCliente(loggedInUser.id)

        if (proximasConsultas.length === 0) {
            meusEventos.innerHTML = '<p>Nenhuma data agendada</p>'
            return
        }

        proximasConsultas.sort((a, b) => {
            const dataA = new Date(`${a.data}T${a.hora}`)
            const dataB = new Date(`${b.data}T${b.hora}`)
            return dataA - dataB
        })

        proximasConsultas.forEach(agendamento => {
            const item = document.createElement('div')
            item.classList.add('appointment-itemEventos')
            item.dataset.id = agendamento.id


            const [ano, mes, dia] = agendamento.data.split('-')

            const nomeMes = [
                'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
            ][parseInt(mes) - 1]

            const dataFormatada = `${parseInt(dia)} de ${nomeMes} de ${ano}`

            item.innerHTML = 
                `
                    <p><strong>${dataFormatada}</strong><span>${agendamento.hora}</span></p>
                    <p>${agendamento.servico} <button" class="desmarcarConsulta">Desmarcar</button></p>  
                `

            meusEventos.appendChild(item)
        })
    }

    ////DESMARCAR CONSULTA//// 

  meusEventos.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('desmarcarConsulta')) {
        const card = e.target.closest('.appointment-itemEventos')
        const idParaRemover = card.dataset.id

        // Carrega todos os agendamentos do localStorage
        const agendamentos = carregarAgendamentos()
        
        // Filtra removendo o agendamento com o ID correspondente
        const novosAgendamentos = agendamentos.filter(ag => ag.id !== idParaRemover)

        // Salva de volta no localStorage
        salvarAgendamentos(novosAgendamentos)

        // Remove da tela
        card.remove()

        mostrarNotificacao('Agendamento desmarcado com sucesso!', 'success')
    }
})


    atualizarCalendario()
    mostrarProximasConsultas()
})