function renderArticle({ image, title, shortDescription, author, keywords }) {
    return `
        <div class="card">
            <img src="${image}" class="card-img-top" alt="${title}">
            <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">${shortDescription.slice(0, 100)}${shortDescription.length > 100 ? '...' : ''}</p>
            </div>
            <ul class="list-group list-group-flush">
                <li class="list-group-item">Written by <b>${author}</b></li>
                <li class="list-group-item">
                    ${keywords.map(el => `<span class="badge badge-primary">${el}</span>`)}
                </li>
            </ul>
            <div class="card-body">
                <a href="#" class="card-link">Card link</a>
            </div>
        </div>
    `;
}

const renderContent = articles => {
  const container = document.getElementById('main');

    articles.forEach(article => {
        const element = renderArticle(article);

        container.insertAdjacentHTML('beforeend', element);
    })
};

const fetchArticles = (q = '') => {
    const URL = `http://127.0.0.1:3000/api/posts?q=${q}`;

    const token = localStorage.getItem('access-token');

    fetch(URL, {
        method: 'get',
        headers: {
            'Authorization': token
        }
    })
    .then(async response => {
        const parsedResponse = await response.json();

        if (response.ok) {
            return parsedResponse;
        }

        throw new Error(parsedResponse.message)
    })
        .then(articles => renderContent(articles))
        .catch(error => {
            alert(error);
            window.location.href = './index.html';
        });
};

const querySearch = event => {
    event.preventDefault();

    const container = document.getElementById('main');
    const [...children] = container.children;
    children.forEach(el => container.removeChild(el));
    const q = event.target[0].value;

    fetchArticles(q);
};


const main = () => {
    fetchArticles();

    const searchForm = document.getElementById('searchForm');

    searchForm.addEventListener('submit', querySearch);
    searchForm.addEventListener('reset', () => console.log('reset'));
};

document.addEventListener("DOMContentLoaded", main);

