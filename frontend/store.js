const CATEGORIES = [
  { id: 'clothing',       name: 'Clothing',          desc: 'Latest trends and premium apparel.',      icon: 'fa-shirt',       img: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80',  slug: 'clothing' },
  { id: 'perfumes',       name: 'Perfumes',           desc: 'Luxury scents and signature fragrances.', icon: 'fa-flask-vial',  img: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80',  slug: 'perfumes' },
  { id: 'tech-gadgets',   name: 'Tech & Gadgets',     desc: 'Cutting-edge gadgets and smart tech.',    icon: 'fa-microchip',   img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80',  slug: 'tech-gadgets' },
  { id: 'home-furniture', name: 'Home & Furniture',   desc: 'Premium decor for your modern space.',    icon: 'fa-house',       img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',  slug: 'home-furniture' },
  { id: 'health-wellness',name: 'Health & Wellness',  desc: 'Supplements and wellness gear.',          icon: 'fa-dumbbell',    img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',  slug: 'health-wellness' },
  { id: 'sports-outdoors',name: 'Sports & Outdoors',  desc: 'Gear for the athlete and adventurer.',   icon: 'fa-trophy',      img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80',  slug: 'sports-outdoors' },
];

function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.rv').forEach(el => observer.observe(el));
}

function renderCategories() {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;

    grid.innerHTML = CATEGORIES.map((cat, idx) => `
        <a href="/category/${cat.slug}" class="cat-card rv" style="transition-delay: ${idx * 50}ms">
            <img src="${cat.img}" alt="${cat.name}" class="cat-img">
            <div class="cat-info">
                <i class="fas ${cat.icon}"></i>
                <h3>${cat.name}</h3>
                <p>${cat.desc}</p>
            </div>
        </a>
    `).join('');
}

async function fetchProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    try {
        const response = await fetch('/api/products');
        const data = await response.json();
        const products = data.data.products;

        grid.innerHTML = ''; 

        products.forEach((product, idx) => {
            const card = document.createElement('div');
            card.className = 'prod-card rv';
            card.style.transitionDelay = `${idx * 50}ms`;
            card.innerHTML = `
                <div class="prod-img">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="prod-info">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                        <h3 style="font-size: 1.5rem; font-weight: 800;">${product.name}</h3>
                        <span class="prod-price">$${product.price}</span>
                    </div>
                    <p style="color: #bbbb; font-size: 0.9rem; margin-bottom: 2rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 2.8rem;">
                        ${product.description || 'Premium quality product from Goobo-Market curated for excellence.'}
                    </p>
                    <button class="btn btn-accent" style="width: 100%; justify-content: center;" onclick="addToCartGuard('${product._id}', event)">
                        <i class="fas fa-shopping-cart"></i> ADD TO CART
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });

        initScrollReveal();

    } catch (error) {
        console.error('Error fetching products:', error);
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666;">Failed to load products. Please check your connection.</p>';
    }
}

async function addToCartGuard(productId, event) {
    const user = await checkAuthStatus();
    if (!user) {
        alert('Please sign in to add items to your cart. You will be redirected to the sign-in page.');
        window.location.href = '/signin.html';
        return;
    }

    try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        const product = data.data.product;
        
        if (product) {
            await addToCart({
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
                qty: 1
            });
            alert('Added to cart!');
        }
    } catch (err) {
        console.error('Failed to add to cart:', err);
        alert('Could not add product to cart.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderCategories();
    
    initScrollReveal(); 
});
