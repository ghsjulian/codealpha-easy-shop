const api = "http://localhost:3000/api/v1/products/get-products";
const productGrid = document.querySelector(".products-grid");
const cartCount = document.querySelector(".cart-count");

const updateCartCount = () => {
    let cartList = JSON.parse(localStorage.getItem("cart")) || [];
    cartCount.innerHTML = cartList.length;
};

const fetchProductLoading = () => {
    productGrid.innerHTML = `
            <div class="product-card-skeleton">
                    <div class="skeleton sk-thumb"></div>
                    <div class="skeleton sk-title"></div>
                    <div class="skeleton sk-price"></div>
                    <div class="skeleton sk-btn"></div>
                </div>
                <div class="product-card-skeleton">
                    <div class="skeleton sk-thumb"></div>
                    <div class="skeleton sk-title"></div>
                    <div class="skeleton sk-price"></div>
                    <div class="skeleton sk-btn"></div>
                </div>
                <div class="product-card-skeleton">
                    <div class="skeleton sk-thumb"></div>
                    <div class="skeleton sk-title"></div>
                    <div class="skeleton sk-price"></div>
                    <div class="skeleton sk-btn"></div>
                </div>
                <div class="product-card-skeleton">
                    <div class="skeleton sk-thumb"></div>
                    <div class="skeleton sk-title"></div>
                    <div class="skeleton sk-price"></div>
                    <div class="skeleton sk-btn"></div>
                </div>
                <div class="product-card-skeleton">
                    <div class="skeleton sk-thumb"></div>
                    <div class="skeleton sk-title"></div>
                    <div class="skeleton sk-price"></div>
                    <div class="skeleton sk-btn"></div>
                </div>
                <div class="product-card-skeleton">
                    <div class="skeleton sk-thumb"></div>
                    <div class="skeleton sk-title"></div>
                    <div class="skeleton sk-price"></div>
                    <div class="skeleton sk-btn"></div>
                </div>
                <div class="product-card-skeleton">
                    <div class="skeleton sk-thumb"></div>
                    <div class="skeleton sk-title"></div>
                    <div class="skeleton sk-price"></div>
                    <div class="skeleton sk-btn"></div>
                </div>
                <div class="product-card-skeleton">
                    <div class="skeleton sk-thumb"></div>
                    <div class="skeleton sk-title"></div>
                    <div class="skeleton sk-price"></div>
                    <div class="skeleton sk-btn"></div>
                </div>
                <div class="product-card-skeleton">
                    <div class="skeleton sk-thumb"></div>
                    <div class="skeleton sk-title"></div>
                    <div class="skeleton sk-price"></div>
                    <div class="skeleton sk-btn"></div>
                </div>
                <div class="product-card-skeleton">
                    <div class="skeleton sk-thumb"></div>
                    <div class="skeleton sk-title"></div>
                    <div class="skeleton sk-price"></div>
                    <div class="skeleton sk-btn"></div>
                </div>
            `;
};

const fetchAll = async () => {
    try {
        fetchProductLoading();
        const req = await fetch(api);
        const response = await req.json();
        const products = response?.products || [];
        if (!products.length) {
            productGrid.innerHTML = "No product found";
            return;
        }
        let html = "";
        products.forEach((product, index) => {
            let cartList = JSON.parse(localStorage.getItem("cart")) || [];
            const isExist = cartList.some(prod => prod.id === product?._id);

            html += `
                <div class="product-card" data-id="${product._id || index}">
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    />
                    <div class="content">
                        <h3>${product.name}</h3>
                        <p class="price">$${product.price}</p>
                        <p>${product.description}</p>
                        <div class="card-actions">
                            <button class="view-btn" 
                            data-id="${product?._id || index}"
                            data-img="${product?.image}"
                            data-name="${product?.name}"
                            data-price="${product?.price}"
                            data-stok="${product?.stok}"
                                style="background: #0d6efd; color: white">
                                View Details
                            </button>
                            <button class="cart-btn" 
                            data-id="${product?._id || index}"
                            data-img="${product?.image}"
                            data-name="${product?.name}"
                            data-price="${product?.price}"
                            data-stok="${product?.stok}"
                                style="background: #198754; color: white">
                                ${isExist ? "Added Already" : "Add to Cart"}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        productGrid.innerHTML = html;
    } catch (error) {
        console.error("Fetch error:", error);
        productGrid.innerHTML = "<p>Failed to load products</p>";
    }
};
updateCartCount();
fetchAll();

productGrid.addEventListener("click", e => {
    const cartBtn = e.target.closest(".cart-btn");
    const viewBtn = e.target.closest(".view-btn");

    if (cartBtn) {
        let cartList = JSON.parse(localStorage.getItem("cart")) || [];
        const cart = {
            id: cartBtn.dataset.id,
            name: cartBtn.dataset.name,
            image: cartBtn.dataset.img,
            qty: 1,
            stok: parseInt(cartBtn.dataset.stok, 10),
            salePrice: parseInt(cartBtn.dataset.price, 10),
            price: parseInt(cartBtn.dataset.price, 10)
        };
        // Check if product already exists
        const isExist = cartList.some(prod => prod.id === cart.id);
        if (isExist) {
            window.location.href = "cart.html";
            return;
        }
        // Add new product at the beginning
        cartList.unshift(cart);
        localStorage.setItem("cart", JSON.stringify(cartList));
        cartBtn.textContent = "Added Already";
        updateCartCount();
    }
    if (viewBtn) {
        const id = viewBtn.dataset.id;
        window.location.href = "view-product.html?" + id;
    }
});
