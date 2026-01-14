// Highlight service cards based on search

document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('mainSearch');
    const searchBar = document.querySelector('.search-bar');
    const serviceCards = document.querySelectorAll('.service-card');
    const orderForm = document.querySelector('.order-form');
    const serviceSelect = document.getElementById('service');
    const orderBtns = document.querySelectorAll('.order-btn');
    const cartBtns = document.querySelectorAll('.cart-btn');
    const cartIcon = document.getElementById('cartIcon');
    const cartCount = document.getElementById('cartCount');
    const cartModal = document.getElementById('cartModal');
    const closeCart = document.getElementById('closeCart');
    const cartItemsList = document.getElementById('cartItems');
    const checkoutBtn = document.getElementById('checkoutBtn');

    let cart = [];

    // Search functionality
    document.querySelector('.search-bar button').addEventListener('click', function () {
        const query = searchInput.value.toLowerCase();
        serviceCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            if (title.includes(query)) {
                card.style.border = '2px solid #ffd700';
                card.style.background = '#fffbe6';
            } else {
                card.style.border = '';
                card.style.background = '';
            }
        });
    });

    // "Order Now" button functionality
    orderBtns.forEach((btn, idx) => {
        btn.addEventListener('click', function () {
            const serviceName = serviceCards[idx].getAttribute('data-service');
            serviceSelect.value = serviceName;
            document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Add to Cart functionality
    cartBtns.forEach((btn, idx) => {
        btn.addEventListener('click', function () {
            const card = serviceCards[idx];
            const serviceName = card.querySelector('h3').textContent;
            const serviceType = card.getAttribute('data-service');
            cart.push({ name: serviceName, type: serviceType });
            updateCartCount();
            showCartToast(serviceName + ' added to cart!');
        });
    });

    function updateCartCount() {
        cartCount.textContent = cart.length;
    }

    // Cart icon click - show modal
    cartIcon.addEventListener('click', function () {
        renderCartItems();
        cartModal.style.display = 'block';
    });

    // Close cart modal
    closeCart.addEventListener('click', function () {
        cartModal.style.display = 'none';
    });

    // Remove item from cart
    cartItemsList.addEventListener('click', function (e) {
        if (e.target.classList.contains('remove-cart-item')) {
            const idx = parseInt(e.target.getAttribute('data-idx'));
            cart.splice(idx, 1);
            renderCartItems();
            updateCartCount();
        }
    });

    function renderCartItems() {
        cartItemsList.innerHTML = '';
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<li>Your cart is empty.</li>';
            checkoutBtn.style.display = 'none';
        } else {
            cart.forEach((item, idx) => {
                const li = document.createElement('li');
                li.textContent = item.name + ' ';
                const removeBtn = document.createElement('button');
                removeBtn.textContent = 'Remove';
                removeBtn.className = 'remove-cart-item';
                removeBtn.setAttribute('data-idx', idx);
                li.appendChild(removeBtn);
                cartItemsList.appendChild(li);
            });
            checkoutBtn.style.display = 'block';
        }
    }

    // Checkout button fills order form and closes modal
    checkoutBtn.addEventListener('click', function () {
        if (cart.length > 0) {
            // Fill service select with first cart item
            serviceSelect.value = cart[0].type;
            cartModal.style.display = 'none';
            document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
        }
    });

    // Service Details Modal
    const detailsModal = document.getElementById('detailsModal');
    const closeDetails = document.getElementById('closeDetails');
    const detailsTitle = document.getElementById('detailsTitle');
    const detailsDesc = document.getElementById('detailsDesc');
    const detailsImgs = document.getElementById('detailsImgs');
    const detailsBtns = document.querySelectorAll('.details-btn');

    function openDetails(card) {
        detailsTitle.textContent = card.querySelector('h3').textContent;
        detailsDesc.textContent = card.getAttribute('data-details');
        detailsImgs.innerHTML = '';
        const imgs = card.getAttribute('data-imgs').split(',');
        imgs.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            detailsImgs.appendChild(img);
        });
        detailsModal.style.display = 'flex';
    }
    detailsBtns.forEach((btn, idx) => {
        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            openDetails(serviceCards[idx]);
        });
    });
    closeDetails.addEventListener('click', function () {
        detailsModal.style.display = 'none';
    });
    detailsModal.addEventListener('click', function (e) {
        if (e.target === detailsModal) detailsModal.style.display = 'none';
    });

    // Card click opens details
    serviceCards.forEach((card, idx) => {
        card.addEventListener('click', function (e) {
            if (!e.target.classList.contains('order-btn') && !e.target.classList.contains('cart-btn')) {
                openDetails(card);
            }
        });
    });

    // Form validation
    orderForm.addEventListener('submit', function (e) {
        let valid = true;
        document.getElementById('nameError').textContent = '';
        document.getElementById('emailError').textContent = '';
        document.getElementById('detailsError').textContent = '';
        document.getElementById('fabricError').textContent = '';
        if (!orderForm.name.value.trim()) {
            document.getElementById('nameError').textContent = 'Name is required.';
            valid = false;
        }
        if (!orderForm.email.value.match(/^\S+@\S+\.\S+$/)) {
            document.getElementById('emailError').textContent = 'Valid email required.';
            valid = false;
        }
        if (!orderForm.fabric.value.trim()) {
            document.getElementById('fabricError').textContent = 'Fabric is required.';
            valid = false;
        }
        if (!orderForm.details.value.trim()) {
            document.getElementById('detailsError').textContent = 'Please provide order details.';
            valid = false;
        }
        if (!valid) {
            e.preventDefault();
            showCartToast('Please fix errors in the form.');
            return;
        }
        alert('Thank you for your order! We will contact you soon.');
        orderForm.reset();
        cart = [];
        updateCartCount();
        renderCartItems();
        saveCart();
    });

    // Toast notification for cart
    function showCartToast(msg) {
        let toast = document.createElement('div');
        toast.className = 'cart-toast';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 1800);
    }

    // Cart persistence
    function saveCart() {
        localStorage.setItem('gbsCart', JSON.stringify(cart));
    }
    function loadCart() {
        const saved = localStorage.getItem('gbsCart');
        if (saved) cart = JSON.parse(saved);
        updateCartCount();
    }
    cartBtns.forEach((btn, idx) => {
        btn.addEventListener('click', function () {
            const card = serviceCards[idx];
            const serviceName = card.querySelector('h3').textContent;
            const serviceType = card.getAttribute('data-service');
            cart.push({ name: serviceName, type: serviceType });
            updateCartCount();
            showCartToast(serviceName + ' added to cart!');
            saveCart();
        });
    });
    cartItemsList.addEventListener('click', function (e) {
        if (e.target.classList.contains('remove-cart-item')) {
            const idx = parseInt(e.target.getAttribute('data-idx'));
            cart.splice(idx, 1);
            renderCartItems();
            updateCartCount();
            saveCart();
        }
    });
    loadCart();

    // Profile/Login Modal
    const profileIcon = document.getElementById('profileIcon');
    const profileModal = document.getElementById('profileModal');
    const closeProfile = document.getElementById('closeProfile');
    const profileForm = document.getElementById('profileForm');
    const avatarPreview = document.getElementById('avatarPreview');

    profileIcon.addEventListener('click', function () {
        profileModal.style.display = 'flex';
    });
    closeProfile.addEventListener('click', function () {
        profileModal.style.display = 'none';
    });
    profileModal.addEventListener('click', function (e) {
        if (e.target === profileModal) profileModal.style.display = 'none';
    });
    profileForm.profileAvatar.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (ev) {
                avatarPreview.innerHTML = `<img src="${ev.target.result}" alt="Avatar">`;
            };
            reader.readAsDataURL(file);
        } else {
            avatarPreview.innerHTML = '';
        }
    });
    profileForm.addEventListener('submit', function (e) {
        e.preventDefault();
        // Save profile to localStorage
        const profile = {
            name: profileForm.profileName.value,
            email: profileForm.profileEmail.value,
            avatar: avatarPreview.querySelector('img') ? avatarPreview.querySelector('img').src : ''
        };
        localStorage.setItem('gbsProfile', JSON.stringify(profile));
        showCartToast('Profile saved!');
        profileModal.style.display = 'none';
    });
    // Load profile on page load
    function loadProfile() {
        const saved = localStorage.getItem('gbsProfile');
        if (saved) {
            const profile = JSON.parse(saved);
            profileForm.profileName.value = profile.name || '';
            profileForm.profileEmail.value = profile.email || '';
            if (profile.avatar) avatarPreview.innerHTML = `<img src="${profile.avatar}" alt="Avatar">`;
        }
    }
    loadProfile();

    // Measurement fields logic
    const measurementFields = document.getElementById('measurementFields');
    const measurementInputs = document.getElementById('measurementInputs');
    const measurementData = {
        shirt: [
            { label: 'Chest (inches)', name: 'chest' },
            { label: 'Shoulder (inches)', name: 'shoulder' },
            { label: 'Sleeve Length (inches)', name: 'sleeve' },
            { label: 'Shirt Length (inches)', name: 'shirtLength' }
        ],
        dress: [
            { label: 'Bust (inches)', name: 'bust' },
            { label: 'Waist (inches)', name: 'waist' },
            { label: 'Hip (inches)', name: 'hip' },
            { label: 'Dress Length (inches)', name: 'dressLength' }
        ],
        pant: [
            { label: 'Waist (inches)', name: 'pantWaist' },
            { label: 'Hip (inches)', name: 'pantHip' },
            { label: 'Inseam (inches)', name: 'inseam' },
            { label: 'Pant Length (inches)', name: 'pantLength' }
        ]
    };
    function showMeasurements(service) {
        measurementInputs.innerHTML = '';
        if (measurementData[service]) {
            measurementFields.style.display = '';
            measurementData[service].forEach(m => {
                const div = document.createElement('div');
                div.className = 'measurement-input';
                div.innerHTML = `<label>${m.label}</label><input type='number' name='${m.name}' min='0' step='0.1'>`;
                measurementInputs.appendChild(div);
            });
        } else {
            measurementFields.style.display = 'none';
        }
    }
    document.getElementById('service').addEventListener('change', function (e) {
        showMeasurements(e.target.value);
    });
    // Show measurements on page load if needed
    showMeasurements(document.getElementById('service').value);

    // Add AI suggestion dropdown
    let aiDropdown = document.createElement('div');
    aiDropdown.className = 'ai-suggestions';
    aiDropdown.style.display = 'none';
    aiDropdown.style.position = 'absolute';
    aiDropdown.style.top = '40px';
    aiDropdown.style.left = '0';
    aiDropdown.style.width = '100%';
    aiDropdown.style.background = '#fff';
    aiDropdown.style.border = '1px solid #ffd700';
    aiDropdown.style.zIndex = '999';
    aiDropdown.style.boxShadow = '0 2px 8px rgba(45,62,80,0.12)';
    searchBar.appendChild(aiDropdown);

    const serviceNames = Array.from(serviceCards).map(card =>
        card.querySelector('h3').textContent
    );

    searchInput.addEventListener('input', function () {
        const query = searchInput.value.toLowerCase();
        if (!query) {
            aiDropdown.style.display = 'none';
            return;
        }
        const matches = serviceNames.filter(name =>
            name.toLowerCase().includes(query)
        );
        if (matches.length > 0) {
            aiDropdown.innerHTML = matches.map(name =>
                `<div class="ai-suggestion-item" style="padding:8px;cursor:pointer;">${name}</div>`
            ).join('');
            aiDropdown.style.display = 'block';
        } else {
            aiDropdown.innerHTML = `<div style="padding:8px;color:#888;">No suggestions</div>`;
            aiDropdown.style.display = 'block';
        }
    });

    aiDropdown.addEventListener('click', function (e) {
        if (e.target.classList.contains('ai-suggestion-item')) {
            searchInput.value = e.target.textContent;
            aiDropdown.style.display = 'none';
            document.querySelector('.search-bar button').click();
        }
    });

    document.addEventListener('click', function (e) {
        if (!searchBar.contains(e.target)) {
            aiDropdown.style.display = 'none';
        }
    });
});
