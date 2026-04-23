const api = "http://localhost:3000/api/v1/products/get-product";
const api2 = "http://localhost:3000/api/v1/products/get-products";

const detailContainer = document.querySelector(".container");
const relatedGrid = document.querySelector(".related-grid");

const fetchProduct = async id => {
    try {
        const req = await fetch(api + "?id=" + id);
        const response = await req.json();
        if (response?.success) {
            detailContainer.innerHTML = `
             <div class="detail-container">
                    <div class="detail-image">
                        <img
                            src="${response?.product?.image}"
                            alt="${response?.product?.name}"
                        />
                    </div>
                    <div class="detail-info">
                        <h1>${response?.product?.name}</h1>
                        <div class="price">$${response?.product?.price}</div>
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
                                    type="text"
                                    id="qty-input"
                                    value="1"
                                    readonly
                                />
                                <button onclick="changeQty(1)">+</button>
                            </div>
                        </div>
                        <div class="action-buttons">
                            <button onclick="addToCart(1)" class="btn-primary">
                                Add to Cart – $${response?.product?.price}
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
};
