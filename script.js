// =========================
// CONFIGURAÇÃO FIREBASE
// =========================
const firebaseConfig = {
  apiKey: "AIzaSyAqJGLYOn3RzLR5iCunYTPIj_ksbhQXtBc",
  authDomain: "catalogo-filme-api.firebaseapp.com",
  projectId: "catalogo-filme-api",
  storageBucket: "catalogo-filme-api.firebasestorage.app",
  messagingSenderId: "105975069751",
  appId: "1:105975069751:web:f5d536bf3646e5558e93b2"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const filmesCollection = db.collection("filmes");

// =========================
// CONFIGURAÇÃO OMDb
// =========================
const API_KEY = '37ad5a34';
const form = document.getElementById('cadastro-filme');
const listaFilmesContainer = document.getElementById('lista-filmes');

// =========================
// FUNÇÃO RENDERIZAR TODOS OS FILMES
// =========================
function renderizarTodosFilmes(filmes) {
  listaFilmesContainer.innerHTML = '';
  if(filmes.length === 0) {
    listaFilmesContainer.innerHTML = '<p>Nenhum filme cadastrado ainda.</p>';
    return;
  }

  filmes.forEach(doc => {
    const filme = doc.data();
    const id = doc.id;

    const filmeDiv = document.createElement('div');
    filmeDiv.classList.add('filme-item');

    const posterImg = document.createElement('img');
    posterImg.src = filme.poster && filme.poster !== "N/A"
      ? filme.poster
      : 'https://via.placeholder.com/110x160?text=Sem+Imagem';
    posterImg.alt = filme.titulo;
    posterImg.classList.add('filme-poster');

    const infoDiv = document.createElement('div');
    infoDiv.classList.add('filme-info');

    const tituloH3 = document.createElement('h3');
    tituloH3.textContent = filme.titulo;

    const sinopseP = document.createElement('p');
    sinopseP.textContent = filme.sinopse;

    const removerBotao = document.createElement('button');
    removerBotao.textContent = 'Remover';
    removerBotao.classList.add('btn-remover');
    removerBotao.addEventListener('click', () => {
      filmesCollection.doc(id).delete();
    });

    infoDiv.append(tituloH3, sinopseP, removerBotao);
    filmeDiv.append(posterImg, infoDiv);
    listaFilmesContainer.appendChild(filmeDiv);
  });
}

// =========================
// LISTENER FIRESTORE (REAL-TIME)
// =========================
filmesCollection.orderBy('titulo').onSnapshot(snapshot => {
  renderizarTodosFilmes(snapshot.docs);
});

// =========================
// ADICIONAR FILME
// =========================
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const titulo = document.getElementById('titulo').value.trim();
  const sinopse = document.getElementById('sinopse').value.trim();
  if(!titulo || !sinopse) {
    alert("Digite título e sinopse!");
    return;
  }

  let poster = '';
  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(titulo)}`);
    const data = await res.json();
    if(data.Response === "True" && data.Poster && data.Poster !== "N/A") poster = data.Poster;
  } catch(err) {
    console.warn("Erro OMDb, será usado placeholder.");
  }

  filmesCollection.add({titulo, sinopse, poster});
  form.reset();
});
