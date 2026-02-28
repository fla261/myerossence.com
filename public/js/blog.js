// MyErossence — Blog (fetch from Supabase)

async function loadArticles(limit = 20) {
  const params = `status=eq.published&order=created_at.desc&limit=${limit}`;
  return supabaseFetch('articles', params);
}

async function loadArticleBySlug(slug) {
  const params = `slug=eq.${encodeURIComponent(slug)}&status=eq.published&limit=1`;
  const articles = await supabaseFetch('articles', params);
  return articles[0] || null;
}

function renderArticleCard(article) {
  const date = new Date(article.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return `
    <article class="blog-card">
      ${article.featured_image ? `
        <div class="blog-image">
          <img src="${article.featured_image}" alt="${article.title}" loading="lazy">
        </div>
      ` : ''}
      <div class="blog-info">
        <span class="blog-category">${article.category || 'Beauty'}</span>
        <h3><a href="article.html?slug=${article.slug}">${article.title}</a></h3>
        <p class="blog-excerpt">${article.excerpt || ''}</p>
        <span class="blog-date">${date}</span>
      </div>
    </article>
  `;
}

function renderBlogGrid(articles, containerId = 'blog-grid') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (articles.length === 0) {
    container.innerHTML = '<p class="no-results">No articles yet. Check back soon!</p>';
    return;
  }

  container.innerHTML = articles.map(renderArticleCard).join('');
}
