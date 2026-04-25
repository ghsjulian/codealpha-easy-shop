const api = "http://localhost:3000/api/v1/products/get-product";
const api2 = "http://localhost:3000/api/v1/products/get-products";

const detailContainer = document.querySelector(".container");
const relatedGrid = document.querySelector(".related-grid");
const cartCount = document.querySelector(".cart-count");

const updateCartCount = () => {
    let cartList = JSON.parse(localStorage.getItem("cart")) || [];
    cartCount.innerHTML = cartList.length;
};
const addToCart = product => {
    let cartList = JSON.parse(localStorage.getItem("cart")) || [];
    const img = document.querySelector(".detail-image img");
    const qyt = document.querySelector("#qty-input");
    const priceTag = document.querySelector(".detail-info .price");
    const cart = {
        name: img.alt,
        image: img.src,
        qty: parseInt(qyt.value),
        stok: parseInt(img.getAttribute("stok")),
        price: parseInt(priceTag.getAttribute("val")),
        salePrice: parseInt(img.getAttribute("price")),
        id: img.getAttribute("id")
    };

    const isExist = cartList.some(prod => prod.id === cart.id);
    if (isExist) {
        window.location.href = "cart.html";
        return;
    }
    cartList.unshift(cart);
    localStorage.setItem("cart", JSON.stringify(cartList));
    document.getElementById("crt-btn").textContent = "Added Already";
    updateCartCount();
};
const fetchSkeleton = () => {
    detailContainer.innerHTML = `
        <div class="gallery-sk">
                    <div class="skeleton main-img-sk"></div>
                    <div class="thumb-row-sk">
                        <div class="skeleton thumb-sk"></div>
                        <div class="skeleton thumb-sk"></div>
                        <div class="skeleton thumb-sk"></div>
                        <div class="skeleton thumb-sk"></div>
                    </div>
                </div>
                <div class="info-sk">
                    <div class="skeleton badge-sk"></div>
                    <div class="skeleton title-sk"></div>
                    <div class="skeleton price-sk"></div>
                    <div style="border-top: 1px solid var(--border-color); padding-top: 20px;">
                        <div class="skeleton" style="height: 18px; width: 100px; margin-bottom: 10px;"></div>
                        <div class="variant-sk">
                            <div class="skeleton circle-sk"></div>
                            <div class="skeleton circle-sk"></div>
                            <div class="skeleton circle-sk"></div>
                        </div>
                    </div>
                    <div class="desc-sk">
                        <div class="skeleton line-sk"></div>
                        <div class="skeleton line-sk"></div>
                        <div class="skeleton line-sk"></div>
                        <div class="skeleton line-sk short"></div>
                    </div>
                    <div class="btn-group-sk">
                        <div class="skeleton btn-sk"></div>
                        <div class="skeleton btn-sk" style="flex: 0.3;"></div>
                    </div>
                </div>
    `;
};
const fetchProduct = async id => {
    try {
        fetchSkeleton();
        const req = await fetch(api + "?id=" + id);
        const response = await req.json();
        if (response?.success) {
            if (!response?.product?._id) {
                detailContainer.innerHTML = `
                    <h3>Product not found</h3>
                `;
                return;
            }
            let cartList = JSON.parse(localStorage.getItem("cart")) || [];
            let isExist = cartList.filter(prod => prod?.id === id);
            detailContainer.innerHTML = `
             <div class="detail-container">
                    <div class="detail-image">
                        <img
                            id="${response?.product?._id}"
                            stok="${response?.product?.stok}"
                            price="${response?.product?.price}"
                            src="${response?.product?.image}"
                            alt="${response?.product?.name}"
                        />
                    </div>
                    <div class="detail-info">
                        <h1>${response?.product?.name}</h1>
                        <div fixed="${response?.product?.price}" 
                            val="${response?.product?.price}" class="price">$${response?.product?.price}</div>
                        <div class="rating">
                            ★★★★☆
                            <span
                                style="
                                    font-size: 1rem;
                                    color: #666;
                                    margin-left: 12px;
                                "
                                >(128 reviews)</span
                            >
                        </div>
                        <p>
                            ${response?.product?.description}
                        </p>
                        <div class="quantity-row">
                            <label>Quantity</label>
                            <div class="quantity-control">
                                <button onclick="changeQty(-1)">–</button>
                                <input
                                    type="number"
                                    id="qty-input"
                                    value="1"
                                    max="${response?.product?.stok}"
                                    readonly
                                />
                                <button onclick="changeQty(+1)">+</button>
                            </div>
                        </div>
                        <div class="action-buttons">
                            <button id="crt-btn" onclick="addToCart()" class="btn-primary">
                                ${isExist.length == 0 ? "Add to Cart" : "Added Already"} – $${response?.product?.price}
                            </button>
                            <button
                                onclick="window.history.back()"
                                class="btn-secondary"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.log(error);
    }
};
const fetchRelated = async () => {
    try {
        const req = await fetch(api2);
        const response = await req.json();
        const products = response?.products || [];
        if (!products.length) {
            productGrid.innerHTML = "<p>No products found</p>";
            return;
        }
        let html = "";
        products.forEach((product, index) => {
            html += `
            <div key="${index}" class="related-card">
                        <img
                            src="${product?.image}"
                            alt="${product?.name}"
                        />
                        <div class="content">
                            <h3>${product?.name}</h3>
                            <p class="price">$${product?.price}</p>
                            <button
                                data-id="${product?._id}"
                                style="
                                    width: 100%;
                                    padding: 12px;
                                    background: #0d6efd;
                                    color: white;
                                    border: none;
                                    border-radius: 12px;
                                    font-weight: 600;
                                    margin-top: 8px;
                                "
                            >
                                Quick View
                            </button>
                        </div>
                    </div>
            `;
        });
        relatedGrid.innerHTML = html;
    } catch (error) {
        console.log(error);
    }
};

window.onload = () => {
    let param = location?.search.split("?")[1] || "";
    if (!param) window.location.href = "/";
    fetchProduct(param);
    fetchRelated();
    updateCartCount();
};
