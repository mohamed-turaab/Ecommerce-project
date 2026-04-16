const CATEGORY_MAP = {
  'clothing': {
    dbName: 'Clothing',
    title: 'Clothing',
    desc: 'Explore the latest trends in premium fashion and everyday apparel.',
    icon: 'fa-shirt'
  },
  'perfumes': {
    dbName: 'Perfumes',
    title: 'Perfumes',
    desc: 'Discover luxury scents and signature fragrances from around the world.',
    icon: 'fa-flask-vial'
  },
  'health-wellness': {
    dbName: 'Health & Wellness',
    title: 'Health & Wellness',
    desc: 'Premium supplements, fitness gear and wellness products for your best self.',
    icon: 'fa-dumbbell'
  },
  'tech-gadgets': {
    dbName: 'Tech & Gadgets',
    title: 'Tech & Gadgets',
    desc: 'Cutting-edge technology and smart gadgets for the modern lifestyle.',
    icon: 'fa-microchip'
  },
  'sports-outdoors': {
    dbName: 'Sports & Outdoors',
    title: 'Sports & Outdoors',
    desc: 'High-performance gear for athletes and outdoor adventure seekers.',
    icon: 'fa-trophy'
  },
  'home-furniture': {
    dbName: 'Home & Furniture',
    title: 'Home & Furniture',
    desc: 'Premium decor and furniture for your modern, stylish living space.',
    icon: 'fa-house'
  }
};

let allProducts = []; 

function getCategorySlug() {
  const parts = window.location.pathname.split('/');
  return parts[parts.length - 1] || '';
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = '';
  for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
  if (half) html += '<i class="fas fa-star-half-alt"></i>';
  const empty = 5 - full - (half ? 1 : 0);
  for (let i = 0; i < empty; i++) html += '<i class="far fa-star"></i>';
  return html;
}

function getProductImage(product) {
  if (product.images && product.images.length > 0) {
    return product.images[0].url || product.images[0];
  }
  if (product.image) return product.image;
  return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400';
}

function renderProductCard(product, idx) {
  const img = getProductImage(product);
  const rating = product.ratingAverage || 4.5;
  const reviews = product.ratingQuantity || 0;
  const inStock = product.countInStock > 0;

  return `
    <div class="prod-card rv" style="transition-delay: ${Math.min(idx * 60, 600)}ms">
      <div class="prod-img">
        <img src="${img}" alt="${product.name}" loading="lazy"
             onerror="this.src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'">
        ${inStock ? '' : '<span class="prod-badge" style="background:#444;color:#fff;">Out of Stock</span>'}
      </div>
      <div class="prod-info">
        <p class="prod-category-tag">${product.category}</p>
        <h3 class="prod-name">${product.name}</h3>
        <p class="prod-desc">${product.description || 'Premium quality product from Goobo-Market.'}</p>
        <div class="prod-footer">
          <div class="prod-price-wrap">
            <div class="prod-price">$${product.price}</div>
            <div class="prod-rating">
              ${renderStars(rating)}
              <span style="margin-left:4px;">(${reviews})</span>
            </div>
          </div>
          <button class="btn-cart" onclick="addToCartGuard('${product._id}', event)" ${!inStock ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''}>
            <i class="fas fa-cart-plus"></i> Add
          </button>
        </div>
      </div>
    </div>
  `;
}

function applySortAndRender() {
  const sort = document.getElementById('sort-select').value;
  let sorted = [...allProducts];

  if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
  else if (sort === 'rating') sorted.sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0));

  renderProducts(sorted);
}

function renderProducts(products) {
  const grid = document.getElementById('product-grid');
  const resultsText = document.getElementById('results-text');

  if (products.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-box-open"></i>
        <h3>No products found</h3>
        <p>This category doesn't have any products yet. Check back soon!</p>
        <a href="/" class="btn btn-accent">Back to Home</a>
      </div>`;
    resultsText.textContent = '0 products found';
    return;
  }

  resultsText.innerHTML = `Showing <span>${products.length}</span> product${products.length !== 1 ? 's' : ''}`;
  grid.innerHTML = products.map((p, i) => renderProductCard(p, i)).join('');

  setTimeout(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('show');
      });
    }, { threshold: 0.05 });
    document.querySelectorAll('.prod-card.rv').forEach(el => observer.observe(el));
  }, 50);
}

async function fetchCategoryProducts(dbCategoryName) {
  const grid = document.getElementById('product-grid');
  const resultsText = document.getElementById('results-text');

  try {
    const encodedCat = encodeURIComponent(dbCategoryName);
    const res = await fetch(`/api/products?category=${encodedCat}&limit=100`);

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    const products = data.data?.products || data.data || [];

    allProducts = products;

    document.getElementById('product-count-badge').innerHTML =
      `<i class="fas fa-box"></i> ${products.length} Products`;

    renderProducts(products);
    resultsText.innerHTML = `Showing <span>${products.length}</span> product${products.length !== 1 ? 's' : ''}`;

  } catch (err) {
    console.error('Failed to fetch products:', err);
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Failed to load products</h3>
        <p>Could not connect to the server. Please try again later.</p>
        <a href="/" class="btn btn-accent">Go Home</a>
      </div>`;
    resultsText.textContent = 'Error loading products';
  }
}

async function addToCartGuard(productId, event) {
    
    const user = await checkAuthStatus();
    
    if (!user) {
        
        alert('Please sign in to add items to your cart. You will be redirected to the sign-in page.');
        window.location.href = '/signin.html';
        return;
    }

    const product = allProducts.find(p => p._id === productId);
    if (!product) return;

    await addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: getProductImage(product),
        qty: 1
    });

    const btn = event.currentTarget;
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Added!';
    btn.style.background = 'var(--accent-color)';
    btn.style.color = '#000';
    setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.style.color = '';
    }, 1500);
}

document.addEventListener('DOMContentLoaded', async () => {
  const slug = getCategorySlug();
  const catInfo = CATEGORY_MAP[slug];

  if (!catInfo) {
    
    document.getElementById('cat-title').textContent = 'Category Not Found';
    document.getElementById('cat-desc').textContent = 'This category does not exist.';
    document.getElementById('product-grid').innerHTML = `
      <div class="empty-state">
        <i class="fas fa-compass"></i>
        <h3>Category Not Found</h3>
        <p>The category "<strong>${slug}</strong>" doesn't exist.</p>
        <a href="/" class="btn btn-accent">Back to Home</a>
      </div>`;
    document.getElementById('results-text').textContent = '';
    if (typeof checkAuthStatus === 'function') checkAuthStatus();
    return;
  }

  document.title = `${catInfo.title} – Goobo-Market`;
  document.getElementById('cat-title').textContent = catInfo.title;
  document.getElementById('cat-desc').textContent = catInfo.desc;
  document.getElementById('cat-icon').className = `fas ${catInfo.icon} cat-icon`;
  document.getElementById('breadcrumb-name').textContent = catInfo.title;

  setTimeout(() => {
    document.querySelectorAll('.rv').forEach(el => el.classList.add('show'));
  }, 100);

  await fetchCategoryProducts(catInfo.dbName);
});
