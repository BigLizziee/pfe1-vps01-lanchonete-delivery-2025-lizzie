document.addEventListener("DOMContentLoaded", () => {
    const produtoSelect = document.getElementById("produtoSelect");
    const pedidosEmExecucao = document.getElementById("pedidosEmExecucao");
    const pedidosEmEntrega = document.getElementById("pedidosEmEntrega");
    const pedidosFinalizados = document.getElementById("pedidosFinalizados");
    const resumoPedido = document.getElementById("resumoPedido");
    const mostrarResumoButton = document.getElementById("mostrarResumo");
    const cadastrarPedidoButton = document.getElementById("cadastrarPedido");

    let produtos = [];

    fetch('assets/dados.json')
        .then(response => response.json())
        .then(data => {
            produtos = data;
            preencherSelectComProdutos(produtos);
        })
        .catch(error => console.error('Erro ao carregar os dados:', error));

    const pedidosFinalizadosStorage = JSON.parse(localStorage.getItem("pedidosFinalizados")) || [];
    pedidosFinalizadosStorage.forEach(pedido => {
        const finalizadoCard = document.createElement("div");
        finalizadoCard.className = "card";
        finalizadoCard.innerHTML = `
            <h3>${pedido.produto}</h3>
            <p>Cliente: ${pedido.clienteNome}</p>
            <p>Endereço: ${pedido.endereco}</p>
            <p>Data e Hora: ${pedido.dataHora}</p>
        `;
        pedidosFinalizados.appendChild(finalizadoCard);
    });

    function preencherSelectComProdutos(produtos) {
        produtos.forEach(produto => {
            const option = document.createElement("option");
            option.value = produto.id;
            option.textContent = `${produto.nome} - R$ ${produto.preco ? produto.preco.toFixed(2) : 'Preço indisponível'}`;
            produtoSelect.appendChild(option);
        });
    }

    mostrarResumoButton.addEventListener("click", () => {
        const clienteNome = document.getElementById("clienteNome").value;
        const endereco = document.getElementById("endereco").value;
        const produtoSelecionado = produtos.find(p => p.id === parseInt(produtoSelect.value));
        const dataHora = new Date().toLocaleString();

        if (clienteNome && endereco && produtoSelecionado) {
            document.getElementById("resumoNome").textContent = clienteNome;
            document.getElementById("resumoEndereco").textContent = endereco;
            document.getElementById("resumoProduto").textContent = produtoSelecionado.nome;
            document.getElementById("resumoDataHora").textContent = dataHora;
            document.getElementById("resumoPreco").textContent = `R$ ${produtoSelecionado.preco ? produtoSelecionado.preco.toFixed(2) : 'Preço indisponível'}`;

            const imgProduto = document.getElementById("resumoImagem");
            imgProduto.src = produtoSelecionado.imagem || 'https://via.placeholder.com/150';
            imgProduto.alt = produtoSelecionado.nome;

            resumoPedido.style.display = "block";
        } else {
            alert("Por favor, preencha todos os campos antes de visualizar o resumo.");
        }
    });

    cadastrarPedidoButton.addEventListener("click", () => {
        const clienteNome = document.getElementById("clienteNome").value;
        const endereco = document.getElementById("endereco").value;
        const produtoSelecionado = produtos.find(p => p.id === parseInt(produtoSelect.value));
        const dataHora = new Date().toLocaleString();

        if (clienteNome && endereco && produtoSelecionado) {
            const pedido = {
                clienteNome,
                endereco,
                produto: produtoSelecionado.nome,
                dataHora
            };

            adicionarPedido(pedido);

            document.getElementById("pedidoForm").reset();
            resumoPedido.style.display = "none";
        }
    });

    function adicionarPedido(pedido) {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${pedido.produto}</h3>
            <p>Cliente: ${pedido.clienteNome}</p>
            <p>Endereço: ${pedido.endereco}</p>
            <p>Data e Hora: ${pedido.dataHora}</p>
            <button onclick="moverParaEntrega(this)">Mover para Entrega</button>
        `;
        pedidosEmExecucao.appendChild(card);
    }

    window.moverParaEntrega = function (button) {
        const card = button.parentElement;
        const pedido = {
            clienteNome: card.querySelector("p").textContent.split(": ")[1],
            endereco: card.querySelector("p:nth-child(2)").textContent.split(": ")[1],
            produto: card.querySelector("h3").textContent,
            dataHora: card.querySelector("p:nth-child(3)").textContent
        };
        card.querySelector("button").remove();
        adicionarFinalizadoButton(card, pedido);
        pedidosEmEntrega.appendChild(card);
    };

    function adicionarFinalizadoButton(card, pedido) {
        const finalizarButton = document.createElement("button");
        finalizarButton.textContent = "Finalizar Pedido";
        finalizarButton.onclick = function () {
            finalizarPedido(pedido, card);
        };
        card.appendChild(finalizarButton);
    }

    function finalizarPedido(pedido, card) {
        let finalizados = JSON.parse(localStorage.getItem("pedidosFinalizados")) || [];
        finalizados.push(pedido);
        localStorage.setItem("pedidosFinalizados", JSON.stringify(finalizados));

        const finalizadoCard = document.createElement("div");
        finalizadoCard.className = "card";
        finalizadoCard.innerHTML = `
            <h3>${pedido.produto}</h3>
            <p>Cliente: ${pedido.clienteNome}</p>
            <p>Endereço: ${pedido.endereco}</p>
            <p>Data e Hora: ${pedido.dataHora}</p>
        `;
        pedidosFinalizados.appendChild(finalizadoCard);

        card.remove();
    }
});
