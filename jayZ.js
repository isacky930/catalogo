<script>
    // 1. ARMAZENAMENTO DE DADOS
    // A chave que usaremos no localStorage
    const STORAGE_KEY = 'catalogoFilmes';
    
    // Tenta carregar os dados do localStorage.
    // JSON.parse converte a string JSON salva de volta para um array JavaScript.
    // Se não houver dados, ele inicia com um array vazio ([]).
    let catalogo = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    // 2. CAPTURA DE ELEMENTOS DO DOM (Document Object Model)
    const form = document.getElementById('cadastro-filme');
    const listaFilmesContainer = document.getElementById('lista-filmes');

    //------------------------------------------------------------------------------------------
    // NOVO: Função para salvar o catálogo no LocalStorage
    //------------------------------------------------------------------------------------------
    function salvarCatalogo() {
        // JSON.stringify converte o array JavaScript em uma string JSON para salvar.
        localStorage.setItem(STORAGE_KEY, JSON.stringify(catalogo));
        console.log("Catálogo salvo no localStorage.");
    }

    //------------------------------------------------------------------------------------------
    // FUNÇÃO DE REMOÇÃO
    //------------------------------------------------------------------------------------------
    /**
     * Remove um filme do array de dados e do elemento HTML na tela.
     * @param {number} indice A posição do filme no array 'catalogo'.
     * @param {HTMLElement} elementoDOM O elemento <div> do filme a ser removido da tela.
     */
    function removerFilme (indice, elementoDOM) {
        // A. REMOÇÃO DO ARRAY (Lógica)
        catalogo.splice(indice, 1);

        // B. ATUALIZAÇÃO DO LOCALSTORAGE
        salvarCatalogo(); // <--- CHAMA A FUNÇÃO DE SALVAMENTO

        // C. REMOÇÃO DO DOM (Visual)
        elementoDOM.remove();

        // Opcional: Atualiza a mensagem da lista se estiver vazia
        if (catalogo.length === 0) {
            listaFilmesContainer.innerHTML = '<p>Nenhum filme cadastrado ainda.</p>';
        }

        console.log(`Filme no índice ${indice} removido. Catálogo atualizado:`, catalogo);
    }

    //-------------------------------------------------------------------------------------
    // FUNÇÃO RENDERIZAÇÃO
    //-------------------------------------------------------------------------------------
    /** * Cria e exibe a estrutura HTML de um filme na lista.
     * @param {Object} filme O objeto (titulo, sinopse) do filme.
     * @param {number} indice Indice atual do filme no array catalogo.
     */
    function renderizarFilme (filme, indice) {
        // Remove a mensagem Inicial se não for o primeiro carregamento
        if (listaFilmesContainer.querySelector('p') && catalogo.length > 0) {
            listaFilmesContainer.innerHTML = '';
        }

        // A. CRIAÇÃO DE ELEMENTOS HTML
        const filmeDiv = document.createElement('div');
        filmeDiv.classList.add('filme-item'); 

        const tituloH3 = document.createElement("h3");
        tituloH3.textContent = filme.titulo;

        const sinopseP = document.createElement('p');
        sinopseP.textContent = filme.sinopse;

        const removerBotao = document.createElement('button');
        removerBotao.textContent = 'Remover';
        removerBotao.classList.add('btn-remover');

        // B. DEFINIÇÃO DO EVENTO DE REMOÇÃO
        removerBotao.addEventListener('click', () => {
             // O 'indice' pode estar desalinhado após remoções, então
             // encontramos o índice atual do filme no array antes de remover.
             const indiceAtual = catalogo.findIndex(f => f.titulo === filme.titulo && f.sinopse === filme.sinopse);
             if (indiceAtual !== -1) {
                 removerFilme (indiceAtual, filmeDiv);
             }
        });

        // C. ANEXAR ELEMENTOS
        filmeDiv.appendChild(tituloH3);
        filmeDiv.appendChild(sinopseP);
        filmeDiv.appendChild(removerBotao);

        // D. INSERÇÃO NO DOM FINAL
        listaFilmesContainer.appendChild(filmeDiv);
    }

    //-------------------------------------------------------------------------------------
    // FUNÇÃO PRINCIPAL DE ADIÇÃO (Manipulador do Formulário)
    //-------------------------------------------------------------------------------------
    function adicionarFilme (evento) {
        evento.preventDefault();

        const tituloInput = document.getElementById('titulo');
        const sinopseInput = document.getElementById('sinopse');

        const novoFilme = {
            titulo: tituloInput.value,
            sinopse: sinopseInput.value
        };

        // 5. Armazena o filme no Array
        catalogo.push (novoFilme);
        
        // 6. Atualiza o LocalStorage
        salvarCatalogo(); // <--- CHAMA A FUNÇÃO DE SALVAMENTO

        // 7. Renderiza na Tela (usando o último índice)
        renderizarFilme (novoFilme, catalogo.length - 1);

        // 8. Limpa o formulario
        form.reset();
    }

    //-------------------------------------------------------------------------------------
    // NOVO: Inicialização - Carrega e Renderiza filmes salvos
    //-------------------------------------------------------------------------------------
    function carregarFilmesSalvos() {
        if (catalogo.length > 0) {
            // Se houver filmes no array (carregados do localStorage), renderiza cada um.
            listaFilmesContainer.innerHTML = ''; // Limpa a mensagem inicial
            catalogo.forEach((filme, index) => {
                renderizarFilme(filme, index);
            });
            console.log("Catálogo carregado do localStorage com sucesso!");
        } else {
             // Mantém a mensagem de "Nenhum filme cadastrado ainda."
             listaFilmesContainer.innerHTML = '<p>Nenhum filme cadastrado ainda.</p>';
        }
    }

    // 9. ESCUTANDO O EVENTO DO BOTÃO/FORMULARIO
    form.addEventListener('submit', adicionarFilme);

    // CHAMA A FUNÇÃO DE CARREGAMENTO AO INICIAR A PÁGINA
    carregarFilmesSalvos();

    console.log("JavaScript Carregado. Pronto para iniciar o catálogo!");
</script>