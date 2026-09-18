function mostrarSenha() {
    const senha = document.getElementById("senha");

    if (!senha) {
        return;
    }

    if (senha.type === "password") {
        senha.type = "text";
    } else {
        senha.type = "password";
    }
}


function mostrarSenhaCadastro() {
    const senha = document.getElementById("senhaCadastro");

    if (!senha) {
        return;
    }

    if (senha.type === "password") {
        senha.type = "text";
    } else {
        senha.type = "password";
    }
}


function mostrarCadastro() {
    const telaLogin = document.getElementById("telaLogin");
    const telaCadastro = document.getElementById("telaCadastro");

    if (!telaLogin || !telaCadastro) {
        return;
    }

    telaLogin.style.display = "none";
    telaCadastro.style.display = "block";
}


function mostrarLogin() {
    const telaLogin = document.getElementById("telaLogin");
    const telaCadastro = document.getElementById("telaCadastro");

    if (!telaLogin || !telaCadastro) {
        return;
    }

    telaCadastro.style.display = "none";
    telaLogin.style.display = "block";
}


async function cadastrar() {

    const nome = document.getElementById("nomeCadastro");
    const email = document.getElementById("emailCadastro");
    const senha = document.getElementById("senhaCadastro");
    const confirmarSenha = document.getElementById("confirmarSenha");

    if (!nome || !email || !senha || !confirmarSenha) {
        return;
    }

    const nomeValor = nome.value.trim();
    const emailValor = email.value.trim();
    const senhaValor = senha.value;
    const confirmarSenhaValor = confirmarSenha.value;

    if (
        nomeValor === "" ||
        emailValor === "" ||
        senhaValor === "" ||
        confirmarSenhaValor === ""
    ) {
        alert("Preencha todos os campos.");
        return;
    }

    if (!emailValor.includes("@")) {
        alert("Digite um e-mail válido.");
        return;
    }

    if (senhaValor.length < 6) {
        alert("A senha deve ter pelo menos 6 caracteres.");
        return;
    }

    if (senhaValor !== confirmarSenhaValor) {
        alert("As senhas não são iguais.");
        return;
    }

    try {

        const respostaBusca = await fetch(
            `http://localhost:3000/usuarios?email=${encodeURIComponent(emailValor)}`
        );

        if (!respostaBusca.ok) {
            throw new Error("Erro ao verificar usuário.");
        }

        const usuariosExistentes = await respostaBusca.json();

        if (usuariosExistentes.length > 0) {
            alert("Este e-mail já está cadastrado.");
            return;
        }

        const novoUsuario = {
            nome: nomeValor,
            email: emailValor,
            senha: senhaValor
        };

        const resposta = await fetch(
            "http://localhost:3000/usuarios",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(novoUsuario)
            }
        );

        if (!resposta.ok) {
            throw new Error("Erro ao cadastrar usuário.");
        }

        const usuarioCadastrado = await resposta.json();

        localStorage.setItem(
            "usuarioId",
            usuarioCadastrado.id
        );

        localStorage.setItem(
            "usuarioNome",
            usuarioCadastrado.nome
        );

        localStorage.setItem(
            "usuarioEmail",
            usuarioCadastrado.email
        );

        localStorage.setItem(
            "usuarioLogado",
            "true"
        );

        alert("Cadastro realizado com sucesso!");

        window.location.href = "inicio.html";

    } catch (erro) {

        console.error("Erro:", erro);

        alert(
            "Não foi possível realizar o cadastro. Verifique se o JSON Server está funcionando."
        );

    }

}


async function entrar() {
    const email = document.getElementById("email");
    const senha = document.getElementById("senha");

    if (!email || !senha) {
        return;
    }

    const emailValor = email.value.trim();
    const senhaValor = senha.value.trim();

    if (emailValor === "" || senhaValor === "") {
        alert("Preencha o e-mail e a senha.");
        return;
    }

    try {
        const resposta = await fetch("http://localhost:3000/usuarios");

        if (!resposta.ok) {
            throw new Error("Erro ao buscar usuários.");
        }

        const usuarios = await resposta.json();

        const usuario = usuarios.find(
            usuario => usuario.email.toLowerCase() === emailValor.toLowerCase()
        );

        if (!usuario) {
            alert("E-mail não cadastrado.");
            return;
        }

        if (String(usuario.senha).trim() !== String(senhaValor).trim()) {
            alert("Senha incorreta.");
            return;
        }

        localStorage.setItem("usuarioId", usuario.id);
        localStorage.setItem("usuarioNome", usuario.nome);
        localStorage.setItem("usuarioEmail", usuario.email);
        localStorage.setItem("usuarioLogado", "true");

        alert("Login realizado com sucesso!");

        window.location.href = "inicio.html";

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível realizar o login. Verifique se o JSON Server está funcionando.");
    }
}

function loginGoogle() {
    alert("Login com Google selecionado.");
}


function recuperarSenha() {
    alert("Função de recuperação de senha.");
}


function carregarPaginaInicial() {

    const titulo = document.querySelector("header h1");
    const nomeUsuario = document.getElementById("nomeUsuario");

    const nome = localStorage.getItem("usuarioNome");

    if (nome) {

        if (titulo) {
            titulo.innerHTML = `Olá, ${nome}! 👋`;
        }

        if (nomeUsuario) {
            nomeUsuario.textContent = nome;
        }

    }

}


function verificarLogin() {

    const usuarioLogado =
        localStorage.getItem("usuarioLogado");

    if (usuarioLogado !== "true") {
        window.location.href = "index.html";
        return;
    }

    carregarPaginaInicial();

}


function sair() {

    localStorage.removeItem("usuarioId");
    localStorage.removeItem("usuarioNome");
    localStorage.removeItem("usuarioEmail");
    localStorage.removeItem("usuarioLogado");

    window.location.href = "index.html";

}


function agendarConsulta() {
    window.location.href = "agendar-consulta.html";
}


function meusPets() {
    window.location.href = "cadastro-pet.html";
}


async function historicoConsultas() {

    const usuarioId =
        localStorage.getItem("usuarioId");

    if (!usuarioId) {
        alert("Usuário não encontrado.");
        return;
    }

    try {

        const resposta = await fetch(
            "http://localhost:3000/consultas"
        );

        if (!resposta.ok) {
            throw new Error("Erro ao buscar consultas.");
        }

        const consultas = await resposta.json();

        console.log(
            "Histórico de consultas:",
            consultas
        );

        alert(
            `Você possui ${consultas.length} consulta(s) registrada(s).`
        );

    } catch (erro) {

        console.error("Erro:", erro);

        alert(
            "Não foi possível carregar o histórico."
        );

    }

}


async function servicosClinica() {

    try {

        const resposta = await fetch(
            "http://localhost:3000/servicos"
        );

        if (!resposta.ok) {
            throw new Error("Erro ao buscar serviços.");
        }

        const servicos = await resposta.json();

        console.log(
            "Serviços da clínica:",
            servicos
        );

    } catch (erro) {

        console.error("Erro:", erro);

        alert(
            "Não foi possível carregar os serviços."
        );

    }

}


async function verLembretes() {

    try {

        const resposta = await fetch(
            "http://localhost:3000/lembretes"
        );

        if (!resposta.ok) {
            throw new Error("Erro ao buscar lembretes.");
        }

        const lembretes = await resposta.json();

        console.log(
            "Lembretes:",
            lembretes
        );

    } catch (erro) {

        console.error("Erro:", erro);

        alert(
            "Não foi possível carregar os lembretes."
        );

    }

}


function dicasPet() {
    alert("Dicas para seu pet em desenvolvimento.");
}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        const paginaAtual = window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

        if (paginaAtual === "inicio.html") {
            verificarLogin();
        }

    }
);