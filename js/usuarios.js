const tabelaUsuarios = document.getElementById("tabelaUsuarios");
const adicionarUsuarioBtn = document.getElementById("adicionarUsuario");

// Função para carregar usuários
function carregarUsuarios() {
    fetch("http://localhost:8080/usuario_cadastro/findall")
        .then(res => {
            if (!res.ok) {
                throw new Error(`Erro HTTP! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            console.log(data); // Debug: verificar a estrutura da resposta no console

            // Ajuste para acessar o array de usuários dentro da propriedade 'content'
            const usuarios = data.content;

            // Verifica se 'content' é realmente um array
            if (!Array.isArray(usuarios)) {
                throw new Error("A propriedade 'content' não é uma lista de usuários.");
            }

            tabelaUsuarios.innerHTML = ""; // Limpa a tabela antes de preencher
            usuarios.forEach(usuario => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${usuario.id}</td>
                    <td>${usuario.nome}</td>
                    <td>${usuario.email}</td>
                    <td>${usuario.telefone}</td>
                    <td>
                        <button class="editar" data-id="${usuario.id}">Editar</button>
                        <button class="apagar" data-id="${usuario.id}">Apagar</button>
                    </td>
                `;
                tabelaUsuarios.appendChild(tr);
            });

            // Adiciona os eventos aos botões de editar e apagar
            document.querySelectorAll(".editar").forEach(btn => {
                btn.addEventListener("click", editarUsuario);
            });
            document.querySelectorAll(".apagar").forEach(btn => {
                btn.addEventListener("click", apagarUsuario);
            });
        })
        .catch(err => console.error("Erro ao carregar usuários:", err));
}

// Função para adicionar um novo usuário
adicionarUsuarioBtn.addEventListener("click", () => {
    window.location.href = "index.html"; // Redireciona para a tela de cadastro
});

// Função para apagar um usuário
function apagarUsuario(event) {
    const userId = event.target.getAttribute("data-id");

    fetch(`http://localhost:8080/usuario_cadastro/delete/${userId}`, {
        method: "DELETE"
    })
        .then(() => {
            alert("Usuário apagado com sucesso!");
            carregarUsuarios(); // Atualiza a tabela
        })
        .catch(err => console.error("Erro ao apagar usuário:", err));
}

// Função para editar um usuário
function editarUsuario(event) {
    const userId = event.target.getAttribute("data-id");
    
    // Abre um prompt para capturar os novos dados do usuário
    const usuario = prompt("Digite os novos dados no formato: Nome, Email, Telefone, Senha");
    
    if (usuario) {
        const [nome, email, telefone, senha] = usuario.split(",");

        // Verifica se todos os campos foram preenchidos
        if (!nome || !email || !telefone || !senha) {
            alert("Por favor, insira todos os campos corretamente (Nome, Email, Telefone, Senha).");
            return;
        }

        // Monta o objeto para o corpo da requisição
        const usuarioAtualizado = {
            id: userId, // Inclui o ID no corpo
            nome: nome.trim(),
            email: email.trim(),
            telefone: telefone.trim(),
            senha: senha.trim()
        };

        // Envia a requisição PUT ao servidor
        fetch("http://localhost:8080/usuario_cadastro/update", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "PUT",
            body: JSON.stringify(usuarioAtualizado)
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`Erro HTTP! status: ${res.status}`);
            }
            return res.json();
        })
        .then(() => {
            alert("Usuário atualizado com sucesso!");
            carregarUsuarios(); // Atualiza a tabela
        })
        .catch(err => console.error("Erro ao atualizar usuário:", err));
    }
}


// Carregar usuários ao abrir a página
document.addEventListener("DOMContentLoaded", carregarUsuarios);
