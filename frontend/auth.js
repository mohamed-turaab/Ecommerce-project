async function checkAuthStatus() {
    try {
        const response = await fetch('/api/users/me');
        if (response.ok) {
            const data = await response.json();
            const user = data.data.user;
            updateNavbar(user);
            return user;
        } else {
            updateNavbar(null);
            return null;
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        updateNavbar(null);
        return null;
    }
}

function updateNavbar(user) {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    const cartCount = getCartCount();
    const badgeHtml = cartCount > 0 ? `<span class="cart-badge">${cartCount}</span>` : '';

    if (user) {
        navActions.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1.25rem;">
                <span style="font-weight: 800; font-size: 0.85rem; color: #FFC107;">
                    <i class="fas fa-user-circle"></i> User
                </span>
                <a href="/cart.html" class="btn btn-outline cart-link" style="padding: 0.5rem 1.25rem;">
                    <i class="fas fa-shopping-cart"></i>
                    ${badgeHtml}
                </a>
                <button onclick="handleLogout()" class="btn btn-accent" style="padding: 0.5rem 1.25rem;">Sign Out</button>
            </div>
        `;
    } else {
        navActions.innerHTML = `
            <a href="/cart.html" class="btn btn-outline cart-link">
                <i class="fas fa-shopping-cart"></i> Cart
                ${badgeHtml}
            </a>
            <a href="/signin.html" class="btn btn-accent">Sign In</a>
        `;
    }
}

async function handleLogin(email, password, isAdmin = false) {
    const endpoint = isAdmin ? '/api/auth/admin/login' : '/api/auth/login';
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        if (response.ok) {
            
            await migrateCartToServer();

            const urlParams = new URLSearchParams(window.location.search);
            const redirectPath = urlParams.get('redirect');
            window.location.href = redirectPath || (isAdmin ? '/admin.html' : '/home.html');
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        alert('An error occurred during login');
    }
}

async function handleSignup(name, email, password) {
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        if (response.ok) {
            
            await migrateCartToServer();
            window.location.href = '/';
        } else {
            alert(data.message || 'Signup failed');
        }
    } catch (error) {
        alert('An error occurred during signup');
    }
}

async function handleLogout() {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.reload();
    } catch (error) {
        console.error('Logout failed');
    }
}

document.addEventListener('DOMContentLoaded', checkAuthStatus);

function getCart() {
    const cart = localStorage.getItem('goobo_cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('goobo_cart', JSON.stringify(cart));
}

function getCartCount() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.qty || 1), 0);
}

async function addToCart(product) {
    let cart = getCart();
    const existing = cart.find(item => item._id === product._id);
    
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({
            _id: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            qty: 1
        });
    }
    saveCart(cart);

    const user = await checkAuthStatus();
    if (user) {
        try {
            await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product._id, quantity: 1 })
            });
        } catch (err) {
            console.error('Failed to sync cart add:', err);
        }
    }

    checkAuthStatus(); 
}

async function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item._id !== productId);
    saveCart(cart);

    const user = await checkAuthStatus();
    if (user) {
        try {
            await fetch(`/api/cart/${productId}`, { method: 'DELETE' });
        } catch (err) {
            console.error('Failed to sync cart remove:', err);
        }
    }

    checkAuthStatus();
}

async function getRemoteCart() {
    try {
        const res = await fetch('/api/cart');
        if (!res.ok) return null;
        const data = await res.json();
        return data.data.cart;
    } catch (err) {
        console.error('Failed to fetch remote cart:', err);
        return null;
    }
}

async function migrateCartToServer() {
    const localCart = getCart();
    if (localCart.length === 0) return;

    try {
        await fetch('/api/cart', { method: 'DELETE' });
    } catch (err) {
        console.error('Failed to clear server cart:', err);
    }

    for (const item of localCart) {
        try {
            await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    productId: item._id, 
                    quantity: item.qty || 1 
                })
            });
        } catch (err) {
            console.error('Failed to sync item:', item.name, err);
        }
    }
    console.log('Cart migrated to server:', localCart.length, 'items');
}
