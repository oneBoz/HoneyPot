async function getFinancialNews() {
  try {
    const response = await fetch('https://newsapi.org/v2/top-headlines?country=us&category=business&pageSize=10&apiKey=d69fd79ca912474f974049523d33522d');
    const data = await response.json();
    const newsGrid = document.querySelector('.news-grid');

    data.articles.forEach(article => {
      const card = `
        <div class="card">
          <img src="${article.urlToImage || 'default-image.jpg'}" class="card-img-top" alt="${article.title}" title="${article.title}">
          <div class="card-body">
            <h2 class="card-title">${article.title}</h2>
            <div class="card-text">
              <p>${article.description}</p>
            </div>
            <a href="${article.url}" target="_blank" class="btn btn-primary">Read More</a>
          </div>
        </div>
      `;
      newsGrid.innerHTML += card;
    });
  } catch (error) {
    console.error('Error fetching financial news:', error);
  }
}

document.addEventListener('DOMContentLoaded', getFinancialNews);
