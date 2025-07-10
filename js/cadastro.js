
document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.getElementById('form-cadastro');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const roleSelect = document.getElementById('role');

    function removerEstiloErro(elemento) {
        elemento.classList.remove('input-error');
    }

    function removerEstilosSucesso(elemento) {
        elemento.classList.remove('input-success');
    }

    // Lógica para remover o erro em tempo real ao digitar
    nameInput.addEventListener('input', () => {
        removerEstiloErro(nameInput)
        removerEstilosSucesso(nameInput)
    });

    emailInput.addEventListener('input', () => {
        removerEstiloErro(emailInput)
        removerEstilosSucesso(emailInput)
    });

    passwordInput.addEventListener('input', () => {
        removerEstiloErro(passwordInput);
        removerEstilosSucesso(passwordInput)
    });

    confirmPasswordInput.addEventListener('input', () => {
        removerEstiloErro(confirmPasswordInput);
        removerEstilosSucesso(confirmPasswordInput)
    });

    roleSelect.addEventListener('change', () => {
        removerEstiloErro(roleSelect)
        removerEstilosSucesso(roleSelect)
    })


    cadastroForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const role = roleSelect.value;


        if (!name || !email || !password || !confirmPassword || !role) {

            if (!name) {
                nameInput.classList.add('input-error')
            } else {
                nameInput.classList.remove('input-error')
            }

            if (!email) {
                emailInput.classList.add('input-error')
            } else {
                emailInput.classList.remove('input-error')
            }

            if (!password) {
                passwordInput.classList.add('input-error')
            } else {
                passwordInput.classList.remove('input-error')
            }

            if (!confirmPassword) {
                confirmPasswordInput.classList.add('input-error')
            } else {
                confirmPasswordInput.classList.remove('input-error')
            }

            if (role === '') {
                mostrarNotificacao('Por favor, selecione um tipo de usuário.', 'error');
                roleSelect.classList.add('input-error')
            } else {
                roleSelect.classList.remove('input-error')
            }

            mostrarNotificacao('Por favor, preencha todos os campos.', 'error');

            return
        }


        if (password.length < 6) {
            mostrarNotificacao('A senha deve ter no mínimo 6 caracteres.', 'error');
            passwordInput.classList.add('input-error')
            passwordInput.classList.remove('input-success')
            passwordInput.focus()

            return
        }


        if (password !== confirmPassword) {

            passwordInput.classList.add('input-error')
            confirmPasswordInput.classList.add('input-error')

            passwordInput.classList.remove('input-success')
            confirmPasswordInput.classList.remove('input-success')

            mostrarNotificacao('As senhas não coincidem. Por favor, digite novamente.', 'error');

            return
        } else {
            passwordInput.classList.remove('input-error')
            confirmPasswordInput.classList.remove('input-error')
        }

        //aqui comeca a parte de mexer o localStorage

        const usuarios = carregarUsuarios(); //primeiro: Pegamos a pilha de papel da gaveta
        //email q já existe        //email q colocamos no input  
        const emailExists = usuarios.some(user => user.email.toLowerCase() === email.toLowerCase());
        
        if (emailExists) {
            
            emailInput.classList.remove('input-success')
            emailInput.classList.add('input-error')

            mostrarNotificacao('Este e-mail já está em uso. Escolha outro.', 'error');
            return;
        }

        const novoUsuario = {
            id: gerarUUID(),
            name: name,
            email: email,
            password: password,
            role: role
        };

        usuarios.push(novoUsuario); //segundo: adicionamos o papel na pilha

        salvarUsuarios(usuarios); //teceiro: colocamos a pilha de volta na gaveta

        nameInput.classList.add('input-success')
        emailInput.classList.add('input-success')
        passwordInput.classList.add('input-success')
        confirmPasswordInput.classList.add('input-success')
        roleSelect.classList.add('input-success')

        mostrarNotificacao('Cadastro realizado com sucesso! Você será redirecionado para o login.', 'success');

        setTimeout(() => {
            redirecionar('login.html');
        }, 2000);
    })

})    