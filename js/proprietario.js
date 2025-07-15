function mostrarTodasConsultas() {

    const listaAgendamentos = document.querySelector('.appointment-list')
    listaAgendamentos.innerHTML = ""
    
    const todosAgendamentos = carregarAgendamentos()
    
    if (todosAgendamentos.length === 0) {
            listaAgendamentos.innerHTML = '<p>Nenhuma data agendada</p>'
            return
        }

    todosAgendamentos.forEach(agendamento => {
        
        const agendamentos = document.createElement('div')
        agendamentos.classList.add('appointment-item')

        agendamentos.innerHTML = 
        `
            <div>
                <p><strong>${agendamento.data}</strong><span>${agendamento.hora}</span></p>
                <p>Serviço: ${agendamento.servico}</p>
                <div class="cliente-info">
                    Cliente: <strong>${agendamento.nome}</strong> <br>
                    ID: ${agendamento.clienteId}
                </div>
            </div>
        `

        listaAgendamentos.appendChild(agendamentos)  
        
    });

}

mostrarTodasConsultas()