// MyErossence — Blog (fetch from Supabase) v2
// Uses global supabaseFetch() from supabase.js

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

function renderBlogGrid(articles) {
  const container = document.getElementById('blogArticlesGrid');
  const emptyState = document.getElementById('blogEmptyState');
  if (!container) return;

  if (!articles || articles.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';
  container.innerHTML = articles.map(renderArticleCard).join('');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
  try {
    const articles = await loadArticles();
    renderBlogGrid(articles);
  } catch (err) {
    console.error('Blog load error:', err);
    const container = document.getElementById('blogArticlesGrid');
    if (container) {
      container.innerHTML = '<p class="no-results">Unable to load articles. Please try again later.</p>';
    }
  }
});
