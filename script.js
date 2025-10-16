const listaFilmesContainer = document.getElementById('lista-filmes');
const form = document.getElementById('cadastro-filme');
const API_KEY = '37ad5a34';

const filmesCollection = db.collection("filmes");

// Renderiza todos os filmes do snapshot
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

    const poster = document.createElement('img');
    poster.src = filme.poster && filme.poster !== 'N/A' 
                  ? filme.poster 
                  : 'https://via.placeholder.com/110x160?text=Sem+Imagem';
    poster.classList.add('filme-poster');

    const info = document.createElement('div');
    info.classList.add('filme-info');

    const titulo = document.createElement('h3');
    titulo.textContent = filme.titulo;

    const sinopse = document.createElement('p');
    sinopse.textContent = filme.sinopse;

    const btnRemover = document.createElement('button');
    btnRemover.textContent = 'Remover';
    btnRemover.classList.add('btn-remover');
    btnRemover.addEventListener('click', () => {
      filmesCollection.doc(id).delete();
    });

    info.append(titulo, sinopse, btnRemover);
    filmeDiv.append(poster, info);
    listaFilmesContainer.appendChild(filmeDiv);
  });
}

// Listener Firestore
filmesCollection.orderBy('titulo').onSnapshot(snapshot => {
  renderizarTodosFilmes(snapshot.docs);
});

// Adicionar filme
form.addEventListener('submit', async e => {
  e.preventDefault();
  const titulo = document.getElementById('titulo').value.trim();
  const sinopse = document.getElementById('sinopse').value.trim();

  let poster = '';
  try {
    const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(titulo)}`);
    const data = await res.json();
    if(data.Response === 'True' && data.Poster !== 'N/A') poster = data.Poster;
  } catch {}

  filmesCollection.add({titulo, sinopse, poster});
  form.reset();
});
