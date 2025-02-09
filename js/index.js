const formulario = document.querySelector("form");
const Inome = document.querySelector(".nome");
const Iemail = document.querySelector(".email");
const Itel = document.querySelector(".tel");
const Isenha = document.querySelector(".senha");

function cadastrar() {
    fetch("http://localhost:8080/usuario_cadastro/save", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            nome: Inome.value,
            email: Iemail.value,
            telefone: Itel.value,
            senha: Isenha.value
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`Erro HTTP! status: ${res.status}`);
        }
        return res.json();
    })
    .then(() => {
        alert("Usuário cadastrado com sucesso!");
        window.location.href = "usuario.html"; // Redireciona para a tela da tabela
    })
    .catch(err => {
        console.error("Erro ao cadastrar usuário:", err);
        alert("Erro ao cadastrar usuário. Por favor, tente novamente.");
    });
}

function limpar() {
    Inome.value = "";
    Iemail.value = "";
    Itel.value = "";
    Isenha.value = "";
}

formulario.addEventListener('submit', function (event) {
    event.preventDefault();
    cadastrar();
});
