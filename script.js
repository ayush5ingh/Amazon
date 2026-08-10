const apiEndpoint = 'https://fakestoreapi.com/products?limit=6';
const featuredGrid = document.getElementById('featuredGrid');
const apiStatusText = document.getElementById('apiStatusText');
const searchInput = document.querySelector('.search-input');
let products = [];

const createProductCard = (product) => {
  const card = document.createElement('article');
  card.className = 'product-card fade-up';
  card.innerHTML = `
    <div class="product-img" style="background-image:url('${product.image}')"></div>
    <div class="product-body">
      <div class="product-badge">${product.category}</div>
      <h3>${product.title}</h3>
      <p>${product.description.slice(0, 90)}...</p>
      <div class="product-footer">
        <span class="price">₹${(product.price * 83).toFixed(0)}</span>
        <span class="rating">⭐ ${product.rating.rate.toFixed(1)}</span>
      </div>
    </div>
  `;
  return card;
};

const renderProducts = (list) => {
  featuredGrid.innerHTML = '';
  if (!list.length) {
    featuredGrid.innerHTML = '<div class="api-error">No products matched your search.</div>';
    return;
  }
  list.forEach(product => featuredGrid.appendChild(createProductCard(product)));
};

const setStatus = (message, status = 'normal') => {
  apiStatusText.textContent = message;
  apiStatusText.dataset.status = status;
};

const fetchFeaturedProducts = async () => {
  try {
    setStatus('Loading latest deals...');
    const response = await fetch(apiEndpoint);
    if (!response.ok) throw new Error('Unable to fetch products');
    products = await response.json();
    renderProducts(products);
    setStatus('Live deals loaded', 'success');
  } catch (error) {
    featuredGrid.innerHTML = '<div class="api-error">Unable to load deals. Please refresh.</div>';
    setStatus('API unavailable', 'error');
    console.error(error);
  }
};

const filterProducts = () => {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(product => {
    return product.title.toLowerCase().includes(query) || product.category.toLowerCase().includes(query);
  });
  renderProducts(filtered);
};

searchInput.addEventListener('input', () => {
  filterProducts();
});

window.addEventListener('scroll', () => {
  document.body.classList.toggle('scrolled', window.scrollY > 20);
});

window.addEventListener('DOMContentLoaded', () => {
  fetchFeaturedProducts();
});
