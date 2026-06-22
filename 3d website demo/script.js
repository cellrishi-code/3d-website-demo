// ===== LOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1500);
});

// ===== THREE.JS BACKGROUND SCENE =====
let bgScene, bgCamera, bgRenderer, bgParticles, bgShapes = [];

function initBackgroundScene() {
    const canvas = document.getElementById('bg-canvas');
    
    bgScene = new THREE.Scene();
    bgCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    bgCamera.position.z = 30;
    
    bgRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    bgRenderer.setSize(window.innerWidth, window.innerHeight);
    bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create floating particles
    const particleCount = 800;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const color1 = new THREE.Color(0x00f5ff);
    const color2 = new THREE.Color(0xff00e5);
    const color3 = new THREE.Color(0x7c3aed);
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
        
        const mixedColor = i % 3 === 0 ? color1 : (i % 3 === 1 ? color2 : color3);
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
    }
    
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.15,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });
    
    bgParticles = new THREE.Points(particleGeometry, particleMaterial);
    bgScene.add(bgParticles);
    
    // Create floating geometric shapes
    const geometries = [
        new THREE.IcosahedronGeometry(1.5, 0),
        new THREE.OctahedronGeometry(1.2, 0),
        new THREE.TetrahedronGeometry(1.3, 0),
        new THREE.TorusGeometry(1, 0.3, 8, 16)
    ];
    
    for (let i = 0; i < 12; i++) {
        const geometry = geometries[i % geometries.length];
        const material = new THREE.MeshBasicMaterial({
            color: i % 3 === 0 ? 0x00f5ff : (i % 3 === 1 ? 0xff00e5 : 0x7c3aed),
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        
        const shape = new THREE.Mesh(geometry, material);
        shape.position.x = (Math.random() - 0.5) * 60;
        shape.position.y = (Math.random() - 0.5) * 60;
        shape.position.z = (Math.random() - 0.5) * 40 - 10;
        
        shape.rotationSpeed = {
            x: Math.random() * 0.01,
            y: Math.random() * 0.01,
            z: Math.random() * 0.01
        };
        
        shape.floatSpeed = Math.random() * 0.02 + 0.005;
        shape.floatOffset = Math.random() * Math.PI * 2;
        
        bgShapes.push(shape);
        bgScene.add(shape);
    }
    
    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    
    // Animation loop
    const clock = new THREE.Clock();
    
    function animateBackground() {
        requestAnimationFrame(animateBackground);
        const elapsed = clock.getElapsedTime();
        
        // Rotate particles
        bgParticles.rotation.y = elapsed * 0.05;
        bgParticles.rotation.x = elapsed * 0.02;
        
        // Animate shapes
        bgShapes.forEach((shape, i) => {
            shape.rotation.x += shape.rotationSpeed.x;
            shape.rotation.y += shape.rotationSpeed.y;
            shape.rotation.z += shape.rotationSpeed.z;
            shape.position.y += Math.sin(elapsed * shape.floatSpeed + shape.floatOffset) * 0.01;
        });
        
        // Camera follows mouse
        bgCamera.position.x += (mouseX * 5 - bgCamera.position.x) * 0.05;
        bgCamera.position.y += (-mouseY * 5 - bgCamera.position.y) * 0.05;
        bgCamera.lookAt(bgScene.position);
        
        bgRenderer.render(bgScene, bgCamera);
    }
    
    animateBackground();
    
    // Resize handler
    window.addEventListener('resize', () => {
        bgCamera.aspect = window.innerWidth / window.innerHeight;
        bgCamera.updateProjectionMatrix();
        bgRenderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ===== HERO 3D SCENE =====
let heroScene, heroCamera, heroRenderer, heroObject, heroRings = [];

function initHeroScene() {
    const container = document.getElementById('hero-3d');
    if (!container) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    heroScene = new THREE.Scene();
    heroCamera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    heroCamera.position.z = 8;
    
    heroRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    heroRenderer.setSize(width, height);
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(heroRenderer.domElement);
    
    // Main object - a complex geometric shape
    const mainGeometry = new THREE.IcosahedronGeometry(2, 1);
    const mainMaterial = new THREE.MeshPhongMaterial({
        color: 0x00f5ff,
        emissive: 0x7c3aed,
        emissiveIntensity: 0.3,
        shininess: 100,
        flatShading: true,
        transparent: true,
        opacity: 0.9
    });
    heroObject = new THREE.Mesh(mainGeometry, mainMaterial);
    heroScene.add(heroObject);
    
    // Wireframe overlay
    const wireGeometry = new THREE.IcosahedronGeometry(2.05, 1);
    const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0xff00e5,
        wireframe: true,
        transparent: true,
        opacity: 0.4
    });
    const wireframe = new THREE.Mesh(wireGeometry, wireMaterial);
    heroObject.add(wireframe);
    
    // Orbiting rings
    const ringColors = [0x00f5ff, 0xff00e5, 0x7c3aed];
    for (let i = 0; i < 3; i++) {
        const ringGeometry = new THREE.TorusGeometry(3 + i * 0.5, 0.05, 8, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: ringColors[i],
            transparent: true,
            opacity: 0.6
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        ring.rotationSpeed = {
            x: (Math.random() - 0.5) * 0.02,
            y: (Math.random() - 0.5) * 0.02
        };
        heroRings.push(ring);
        heroScene.add(ring);
    }
    
    // Small orbiting spheres
    const sphereGroup = new THREE.Group();
    for (let i = 0; i < 8; i++) {
        const sphereGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: i % 2 === 0 ? 0x00f5ff : 0xff00e5,
            emissive: i % 2 === 0 ? 0x00f5ff : 0xff00e5,
            emissiveIntensity: 0.5
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        const angle = (i / 8) * Math.PI * 2;
        sphere.position.x = Math.cos(angle) * 3.5;
        sphere.position.y = Math.sin(angle) * 3.5;
        sphere.userData.angle = angle;
        sphereGroup.add(sphere);
    }
    heroScene.add(sphereGroup);
    heroObject.userData.sphereGroup = sphereGroup;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    heroScene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x00f5ff, 2, 50);
    pointLight1.position.set(5, 5, 5);
    heroScene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff00e5, 2, 50);
    pointLight2.position.set(-5, -5, 5);
    heroScene.add(pointLight2);
    
    const pointLight3 = new THREE.PointLight(0x7c3aed, 1.5, 50);
    pointLight3.position.set(0, 5, -5);
    heroScene.add(pointLight3);
    
    // Mouse interaction for hero object
    let heroMouseX = 0, heroMouseY = 0;
    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        heroMouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        heroMouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });
    
    // Animation loop
    const clock = new THREE.Clock();
    
    function animateHero() {
        requestAnimationFrame(animateHero);
        const elapsed = clock.getElapsedTime();
        
        // Rotate main object
        heroObject.rotation.x = elapsed * 0.3;
        heroObject.rotation.y = elapsed * 0.2;
        
        // Float effect
        heroObject.position.y = Math.sin(elapsed) * 0.3;
        
        // Scale pulse
        const scale = 1 + Math.sin(elapsed * 2) * 0.05;
        heroObject.scale.set(scale, scale, scale);
        
        // Rotate rings
        heroRings.forEach((ring, i) => {
            ring.rotation.x += ring.rotationSpeed.x;
            ring.rotation.y += ring.rotationSpeed.y;
            ring.rotation.z = elapsed * 0.1 * (i + 1);
        });
        
        // Orbit spheres
        if (heroObject.userData.sphereGroup) {
            heroObject.userData.sphereGroup.rotation.z = elapsed * 0.5;
            heroObject.userData.sphereGroup.children.forEach((sphere, i) => {
                const angle = sphere.userData.angle + elapsed * 0.5;
                sphere.position.x = Math.cos(angle) * 3.5;
                sphere.position.y = Math.sin(angle) * 3.5;
                sphere.position.z = Math.sin(elapsed + i) * 0.5;
            });
        }
        
        // Camera follows mouse
        heroCamera.position.x += (heroMouseX * 2 - heroCamera.position.x) * 0.05;
        heroCamera.position.y += (-heroMouseY * 2 - heroCamera.position.y) * 0.05;
        heroCamera.lookAt(heroScene.position);
        
        heroRenderer.render(heroScene, heroCamera);
    }
    
    animateHero();
    
    // Resize handler
    window.addEventListener('resize', () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        heroCamera.aspect = w / h;
        heroCamera.updateProjectionMatrix();
        heroRenderer.setSize(w, h);
    });
}

// ===== PRODUCT DATA =====
const products = [
    {
        id: 1,
        name: 'Quantum Headset X1',
        category: 'audio',
        price: 299.99,
        oldPrice: 399.99,
        icon: 'fa-headphones',
        badge: 'Sale',
        description: 'Immersive 3D audio experience with noise cancellation and spatial sound technology.',
        specs: ['Active Noise Cancellation', '40h Battery Life', 'Bluetooth 5.3', 'Spatial Audio']
    },
    {
        id: 2,
        name: 'HoloWatch Pro',
        category: 'wear',
        price: 499.99,
        icon: 'fa-clock',
        badge: 'New',
        description: 'Holographic display smartwatch with health monitoring and AR capabilities.',
        specs: ['Holographic Display', 'Heart Rate Monitor', 'GPS Tracking', 'Water Resistant']
    },
    {
        id: 3,
        name: 'Neural VR Headset',
        category: 'tech',
        price: 799.99,
        icon: 'fa-vr-cardboard',
        badge: 'Hot',
        description: 'Next-gen virtual reality with neural feedback and 8K resolution per eye.',
        specs: ['8K Per Eye', 'Neural Feedback', '120Hz Refresh', 'Wireless']
    },
    {
        id: 4,
        name: 'CyberBuds Air',
        category: 'audio',
        price: 149.99,
        oldPrice: 199.99,
        icon: 'fa-earbuds',
        badge: 'Sale',
        description: 'Ultra-light wireless earbuds with adaptive sound and wireless charging.',
        specs: ['Adaptive Sound', '30h Battery', 'Wireless Charging', 'IPX7 Waterproof']
    },
    {
        id: 5,
        name: 'Photon Drone',
        category: 'tech',
        price: 1299.99,
        icon: 'fa-helicopter',
        badge: 'Premium',
        description: 'AI-powered drone with 8K camera and 60-minute flight time.',
        specs: ['8K Camera', '60min Flight', 'AI Tracking', '5km Range']
    },
    {
        id: 6,
        name: 'Pulse Band 5',
        category: 'wear',
        price: 89.99,
        icon: 'fa-heart-pulse',
        badge: 'Popular',
        description: 'Fitness tracker with ECG, SpO2, and sleep analysis.',
        specs: ['ECG Monitor', 'SpO2 Sensor', 'Sleep Analysis', '14-day Battery']
    },
    {
        id: 7,
        name: 'Nexus Speaker',
        category: 'audio',
        price: 249.99,
        icon: 'fa-volume-high',
        badge: 'New',
        description: '360-degree smart speaker with AI assistant and premium sound.',
        specs: ['360° Sound', 'AI Assistant', 'Multi-room', 'Premium Bass']
    },
    {
        id: 8,
        name: 'Quantum Laptop',
        category: 'tech',
        price: 1999.99,
        oldPrice: 2299.99,
        icon: 'fa-laptop',
        badge: 'Sale',
        description: 'Ultra-thin laptop with quantum processor and holographic display.',
        specs: ['Quantum CPU', '32GB RAM', '2TB SSD', 'Holographic Display']
    }
];

// ===== RENDER PRODUCTS =====
let currentFilter = 'all';

function renderProducts(filter = 'all') {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    
    const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
    
    filtered.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="product-image">
                <span class="product-badge">${product.badge}</span>
                <i class="fas ${product.icon}"></i>
            </div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart" onclick="addToCart(${product.id}); event.stopPropagation();">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
        card.addEventListener('click', () => openProductModal(product));
        grid.appendChild(card);
    });
}

// ===== PRODUCT FILTERS =====
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderProducts(currentFilter);
    });
});

// ===== PRODUCT MODAL =====
function openProductModal(product) {
    const modal = document.getElementById('product-modal');
    const body = document.getElementById('modal-body');
    
    body.innerHTML = `
        <div class="modal-image">
            <i class="fas ${product.icon}"></i>
        </div>
        <div class="modal-info">
            <p class="product-category">${product.category}</p>
            <h2>${product.name}</h2>
            <p class="product-description">${product.description}</p>
            <div class="modal-specs">
                <h4>Specifications</h4>
                <ul>
                    ${product.specs.map(spec => `<li>${spec}</li>`).join('')}
                </ul>
            </div>
            <div class="modal-price">
                <span class="product-price">$${product.price.toFixed(2)}</span>
                ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
            </div>
            <div class="modal-actions">
                <button class="btn-primary" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('product-modal').classList.remove('active');
});

document.getElementById('product-modal').addEventListener('click', (e) => {
    if (e.target.id === 'product-modal') {
        document.getElementById('product-modal').classList.remove('active');
    }
});

// ===== CART FUNCTIONALITY =====
let cart = [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    showToast(`${product.name} added to cart!`);
    
    // Cart button bounce animation
    const cartBtn = document.getElementById('cart-btn');
    cartBtn.style.animation = 'none';
    setTimeout(() => {
        cartBtn.style.animation = 'pulse 0.4s ease';
    }, 10);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function changeQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    
    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCart();
    }
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const totalAmount = document.getElementById('total-amount');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    cartCount.textContent = totalItems;
    totalAmount.textContent = `$${totalPrice.toFixed(2)}`;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <i class="fas ${item.icon}"></i>
                </div>
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
}

// ===== CART SIDEBAR =====
document.getElementById('cart-btn').addEventListener('click', () => {
    document.getElementById('cart-sidebar').classList.add('active');
    document.getElementById('cart-overlay').classList.add('active');
});

document.getElementById('close-cart').addEventListener('click', closeCart);
document.getElementById('cart-overlay').addEventListener('click', closeCart);

function closeCart() {
    document.getElementById('cart-sidebar').classList.remove('active');
    document.getElementById('cart-overlay').classList.remove('active');
}

// ===== CHECKOUT =====
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'fa-exclamation-circle');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    showToast(`Order placed! Total: $${total.toFixed(2)}`, 'fa-check-circle');
    cart = [];
    updateCart();
    closeCart();
});

// ===== TOAST NOTIFICATION =====
function showToast(message, icon = 'fa-check-circle') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = toast.querySelector('i');
    
    toastMessage.textContent = message;
    toastIcon.className = `fas ${icon}`;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Update active nav link
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== MOBILE MENU =====
document.getElementById('menu-toggle').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.remove('active');
    });
});

// ===== SMOOTH SCROLL FUNCTIONS =====
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

function scrollToAbout() {
    document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    });
}

// ===== SCROLL REVEAL ANIMATIONS =====
function initScrollReveal() {
    const elements = document.querySelectorAll('.product-card, .feature, .section-header, .about-text');
    
    elements.forEach(el => {
        el.classList.add('reveal');
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
}

// ===== CONTACT FORM =====
document.getElementById('contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Message sent successfully!', 'fa-paper-plane');
    e.target.reset();
});

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Three.js scenes
    if (typeof THREE !== 'undefined') {
        initBackgroundScene();
        initHeroScene();
    }
    
    // Render products
    renderProducts();
    
    // Initialize cart
    updateCart();
    
    // Initialize scroll reveal
    initScrollReveal();
    
    // Animate counters after a delay
    setTimeout(animateCounters, 2000);
});