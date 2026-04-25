const api = "";
const cartGrid = document.querySelector(".cart-items");
const itemsCount = document.querySelector("#cart-items-count");
const cartCount = document.querySelector(".cart-count");

const calculateFinalPrice = (
    total,
    taxPercent,
    discountPercent,
    shipping = 0
) => {
    const taxAmount = (total * taxPercent) / 100;
    const priceAfterTax = total + taxAmount;
    const discountAmount = (priceAfterTax * discountPercent) / 100;
    const finalPrice = priceAfterTax - discountAmount + shipping;

    return {
        subtotal: total,
        tax: taxAmount,
        priceAfterTax,
        discount: discountAmount,
        shipping: shipping === 0 ? "FREE" : shipping,
        finalPrice: Number(finalPrice.toFixed(2))
    };
};

const updateCartCount = () => {
    let cartList = JSON.parse(localStorage.getItem("cart")) || [];
    cartCount.innerHTML = cartList.length;
};

const removeItem = id => {
    let cartList = JSON.parse(localStorage.getItem("cart")) || [];
    const item = document.querySelector(`.cart-item[index="${id}"]`);
    if (item) {
        item.remove();
        itemsCount.textContent = cartList.length + " Items";
        if (cartList?.length == 0) {
            cartGrid.innerHTML = `<div id="empty-cart" class="empty-cart">
                    <h3>Your cart is empty</h3>
                    <p style="margin: 20px 0; color: #666">
                        Looks like you haven't added anything yet.
                    </p>
                    <a
                        href="/"
                        class="btn btn-primary"
                        style="
                            display: inline-block;
                            width: auto;
                            padding: 16px 40px;
                        "
                        >Start Shopping</a
                    >
                </div>`;
        }
    }
};

const renderCart = () => {
    let cartList = JSON.parse(localStorage.getItem("cart")) || [];
    let html = "";
    cartGrid.innerHTML = "";
    itemsCount.textContent = cartList.length + " Items";
    if (cartList?.length == 0) {
        cartGrid.innerHTML = `<div id="empty-cart" class="empty-cart">
                    <h3>Your cart is empty</h3>
                    <p style="margin: 20px 0; color: #666">
                        Looks like you haven't added anything yet.
                    </p>
                    <a
                        href="/"
                        class="btn btn-primary"
                        style="
                            display: inline-block;
                            width: auto;
                            padding: 16px 40px;
                        "
                        >Start Shopping</a
                    >
                </div>`;
        return;
    }

    cartList.forEach((prod, index) => {
        html += `
                      <div class="cart-item" id="${prod?.id}" index="item-${index}">
                            <img
                                src="${prod?.image}"
                                alt="${prod?.name}"
                            />
                            <div class="cart-item-info">
                                <h4>${prod?.name}</h4>
                                <p id="cart-${index}">$${prod?.price}</p>
                            </div>
                            <div class="quantity-control">
                                <button data-index="ghs-${index}" data-id="${prod?.id}" id="less">
                                    –
                                </button>
                                <input
                                    type="number"
                                    id="qty-1"
                                    value="${prod?.qty}"
                                    readonly
                                />
                                <button data-index="ghs-${index}" data-id="${prod?.id}" id="add">
                                    +
                                </button>
                            </div>
                            <div style="display:flex; justify-content:left; align-items:center;" class="${prod.id} item-total" id="ghs-${index}">
                            <span>$</span>
                            <p class="sale-price">${prod?.price}</p>
                            </div>
                            <button class="remove-btn" data-index="${index}" data-id="item-${index}">
                                ✕
                            </button>
                        </div>
       `;
    });
    cartGrid.innerHTML = html;
};

const updateTotal = () => {
    let cartList = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    cartList.forEach(prod => {
        total += prod.price;
    });
    const prices = calculateFinalPrice(total, 10, 10, 0);
    document.querySelector("#tax").textContent = "$" + prices.tax;
    document.querySelector("#discount").textContent = "$" + prices.discount;
    document.querySelector("#subtotal").textContent = "$" + prices.subtotal;
    document.querySelector("#grand-total").textContent =
        "$" + prices.finalPrice
};
renderCart();
updateTotal();
updateCartCount();
cartGrid.addEventListener("click", e => {
    const add = e.target.closest("#add");
    const less = e.target.closest("#less");
    const remove = e.target.closest(".remove-btn");

    if (add) {
        let id = add.dataset.id;
        let index = add.dataset.index;
        let cartList = JSON.parse(localStorage.getItem("cart")) || [];
        cartList.filter((prod, index) => {
            if (prod.id === id) {
                if (prod.qty >= prod.stok) return;

                let price = prod.price + prod.salePrice;
                prod.price = price;
                prod.qty += 1;
                add.parentElement.querySelector("#qty-1").value = prod.qty;
                document.querySelector("#ghs-" + index).textContent =
                    "$" + prod.price;
                document.querySelector("#cart-" + index).textContent =
                    "$" + prod.price;
                cartList[index] = prod;
                localStorage.setItem("cart", JSON.stringify(cartList));
                updateTotal();
            }
        });
    }
    if (less) {
        let id = less.dataset.id;
        let index = less.dataset.index;
        let cartList = JSON.parse(localStorage.getItem("cart")) || [];

        cartList.filter((prod, index) => {
            if (prod.id === id) {
                if (prod.qty <= 1) return;

                let price = prod.price - prod.salePrice;
                prod.price = price;
                prod.qty -= 1;
                less.parentElement.querySelector("#qty-1").value = prod.qty;
                document.querySelector("#ghs-" + index).textContent =
                    "$" + prod.price;
                document.querySelector("#cart-" + index).textContent =
                    "$" + prod.price;
                cartList[index] = prod;
                localStorage.setItem("cart", JSON.stringify(cartList));
                updateTotal();
            }
        });
    }
    if (remove) {
        let cartList = JSON.parse(localStorage.getItem("cart")) || [];
        const id = remove.dataset.id;
        const index = Number(remove.dataset.index);
        const newCart = cartList.filter((_, idx) => idx !== index);
        localStorage.setItem("cart", JSON.stringify(newCart));
        removeItem(id);
        updateCartCount();
    }
});
