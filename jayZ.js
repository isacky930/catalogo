// A chave que usaremos no localStorage para salvar o array
const STORAGE_KEY = 'catalogoFilmes';

// 1. CARREGAMENTO INICIAL: Tenta carregar os dados do localStorage.
// Se não houver nada, inicializa o catálogo como um array vazio.
let catalogo = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// 2. CAPTURA DE ELEMENTOS DO DOM
const form = document.getElementById('cadastro-filme');
const listaFilmesContainer = document.getElementById('lista-filmes');

//------------------------------------------------------------------------------------------
// FUNÇÕES DE PERSISTÊNCIA E LÓGICA
//------------------------------------------------------------------------------------------

/**
 * Salva o array 'catalogo' atual no LocalStorage.
 */
function salvarCatalogo() {
    // JSON.stringify converte o array JavaScript em uma string JSON para salvar.
    localStorage.setItem(STORAGE_KEY, JSON.stringify(catalogo));
    console.log("Catálogo salvo no localStorage.");
}

/**
 * Remove um filme do array de dados, do localStorage e da tela.
 * @param {number} indice O índice atual do filme no array 'catalogo'.
 * @param {HTMLElement} elementoDOM O elemento <div> do filme a ser removido da tela.
 */
function removerFilme (indice, elementoDOM) {
    // 1. REMOÇÃO DO ARRAY (Lógica)
    catalogo.splice(indice, 1);

    // 2. ATUALIZAÇÃO DO LOCALSTORAGE
    salvarCatalogo();

    // 3. REMOÇÃO DO DOM (Visual)
    elementoDOM.remove();

    // Opcional: Atualiza a mensagem se a lista estiver vazia
    if (catalogo.length === 0) {
        listaFilmesContainer.innerHTML = '<p>Nenhum filme cadastrado ainda.</p>';
    }

    console.log(`Filme no índice ${indice} removido. Catálogo atualizado:`, catalogo);
}

/**
 * Cria e exibe a estrutura HTML de um filme na lista.
 * @param {Object} filme O objeto {titulo, sinopse} do filme.
 */
function renderizarFilme (filme) {
    // Remove a mensagem inicial de "Nenhum filme cadastrado..." se ela existir
    if (listaFilmesContainer.querySelector('p')) {
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
         // Encontra o índice atual do filme no array antes de remover
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

/**
 * Lida com o envio do formulário, captura os dados e salva o filme.
 */
function adicionarFilme (evento) {
    evento.preventDefault();

    const tituloInput = document.getElementById('titulo');
    const sinopseInput = document.getElementById('sinopse');

    const novoFilme = {
        titulo: tituloInput.value,
        sinopse: sinopseInput.value
    };

    // 1. Armazena o filme no Array
    catalogo.push (novoFilme);
    
    // 2. Salva o catálogo atualizado no LocalStorage
    salvarCatalogo();

    // 3. Renderiza na Tela
    renderizarFilme (novoFilme);

    // 4. Limpa o formulario
    form.reset();
}

/**
 * Carrega todos os filmes salvos no 'catalogo' e os renderiza na tela.
 */
function carregarFilmesSalvos() {
    if (catalogo.length > 0) {
        // Limpa a mensagem inicial
        listaFilmesContainer.innerHTML = ''; 
        
        // Renderiza cada filme carregado do localStorage
        catalogo.forEach((filme) => {
            renderizarFilme(filme);
        });
        console.log("Catálogo carregado do localStorage com sucesso!");
    } else {
         // Garante que a mensagem inicial esteja presente se não houver filmes
         listaFilmesContainer.innerHTML = '<p>Nenhum filme cadastrado ainda.</p>';
    }
}

//------------------------------------------------------------------------------------------
// INICIALIZAÇÃO
//------------------------------------------------------------------------------------------

// 1. Anexa a função de adicionar ao evento de 'submit' do formulário
form.addEventListener('submit', adicionarFilme);

// 2. Carrega e exibe os filmes salvos ao iniciar a página
carregarFilmesSalvos();

console.log("JavaScript Carregado. Pronto para persistência de dados!");