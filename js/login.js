

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('form-login');
    const emailInput = document.getElementById('emailInput');
    const passwordInput = document.getElementById('password');

     function removerEstiloErro(elemento) {
        elemento.classList.remove('input-error');
    }

    function removerEstilosSucesso(elemento) {
        elemento.classList.remove('input-success');
    }

    emailInput.addEventListener('input', () => {
        removerEstiloErro(emailInput);
        removerEstilosSucesso(emailInput);
    });
    passwordInput.addEventListener('input', () => {
        removerEstiloErro(passwordInput);
        removerEstilosSucesso(passwordInput);
    });

    
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        if (!email || !password) {
            if (!email) {
                emailInput.classList.add('input-error')
            }
            if (!password) {
                passwordInput.classList.add('input-error')
            }

            mostrarNotificacao('Por favor, preencha todos os campos.', 'error');
            return;
        }

        const usuarios = carregarUsuarios();
        const usuarioEncontrado = usuarios.find(user => user.email.toLowerCase() === email.toLowerCase() && user.password === password);

        if (usuarioEncontrado) {
            salvarUsuarioLogado(usuarioEncontrado); // Salva o usuário logado no sessionStorage

            emailInput.classList.add('input-success')
            passwordInput.classList.add('input-success')
            mostrarNotificacao('Login bem-sucedido! Redirecionando...', 'success');

            setTimeout(() => {
                if (usuarioEncontrado.role === 'cliente') {
                    redirecionar('cliente.html');
                } else if (usuarioEncontrado.role === 'proprietario') {
                    redirecionar('proprietario.html');
                }
            }, 1500);
        } else {
            emailInput.classList.add('input-error')
            passwordInput.classList.add('input-error')
            mostrarNotificacao('E-mail ou senha inválidos.', 'error');
        }
    });
});