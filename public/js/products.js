// MyErossence — Products (fetch from Supabase, render cards)

async function loadProducts(filters = {}) {
  let params = 'status=eq.active&order=created_at.desc';

  if (filters.category) {
    params += `&category=eq.${encodeURIComponent(filters.category)}`;
  }
  if (filters.brand) {
    params += `&brand=eq.${encodeURIComponent(filters.brand)}`;
  }
  if (filters.search) {
    params += `&name=ilike.*${encodeURIComponent(filters.search)}*`;
  }

  const products = await supabaseFetch('products', params);
  return products;
}

function renderProductCard(product) {
  const priceDisplay = product.price
    ? `$${Number(product.price).toFixed(2)}`
    : '';

  const ratingStars = product.rating
    ? '&#9733;'.repeat(Math.round(product.rating)) + '&#9734;'.repeat(5 - Math.round(product.rating))
    : '';

  const reviewText = product.review_count
    ? `(${product.review_count.toLocaleString()} reviews)`
    : '';

  const hairTypes = (product.hair_type || [])
    .map(t => `<span class="tag">${t}</span>`)
    .join('');

  return `
    <article class="product-card" data-category="${product.category || ''}" data-brand="${product.brand || ''}">
      <div class="product-image">
        <img src="${product.image_url || 'images/placeholder.svg'}"
             alt="${product.name}"
             loading="lazy"
             onerror="this.src='images/placeholder.svg'">
      </div>
      <div class="product-info">
        <span class="product-brand">${product.brand || ''}</span>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-rating">
          <span class="stars">${ratingStars}</span>
          <span class="review-count">${reviewText}</span>
        </div>
        <p class="product-description">${product.description || ''}</p>
        <div class="product-tags">${hairTypes}</div>
        <div class="product-footer">
          <span class="product-price">${priceDisplay}</span>
          <a href="/go/${encodeURIComponent(product.slug)}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
            View on Amazon
          </a>
        </div>
      </div>
    </article>
  `;
}

function renderProductGrid(products, containerId = 'product-grid') {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = '<p class="no-results">No products found matching your criteria.</p>';
    return;
  }

  container.innerHTML = products.map(renderProductCard).join('');
}

function getUniqueCategories(products) {
  return [...new Set(products.map(p => p.category).filter(Boolean))].sort();
}

function getUniqueBrands(products) {
  return [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
}

function renderFilters(products) {
  const categories = getUniqueCategories(products);
  const brands = getUniqueBrands(products);

  const categoryFilter = document.getElementById('category-filter');
  if (categoryFilter) {
    categoryFilter.innerHTML = '<option value="">All Categories</option>' +
      categories.map(c => `<option value="${c}">${c.charAt(0).toUpperCase() + c.slice(1)}</option>`).join('');
  }

  const brandFilter = document.getElementById('brand-filter');
  if (brandFilter) {
    brandFilter.innerHTML = '<option value="">All Brands</option>' +
      brands.map(b => `<option value="${b}">${b}</option>`).join('');
  }
}
