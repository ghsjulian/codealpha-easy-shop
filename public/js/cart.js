const api = "";
const cartGrid = document.querySelector(".cart-items");
const itemsCount = document.querySelector("#cart-items-count");

const renderCart = () => {
    let cartList = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartList?.length == 0) return;
    let html = "";
    cartGrid.innerHTML = "";
    itemsCount.textContent = cartList.length + " Items";
    cartList.forEach((prod, index) => {
        html += `
                      <div class="cart-item" id="${prod?.id}">
                            <img
                                src="${prod?.image}"
                                alt="${prod?.name}"
                            />
                            <div class="cart-item-info">
                                <h4>${prod?.name}</h4>
                                <p>$${prod?.price}</p>
                            </div>
                            <div class="quantity-control">
                                <button data-index="ghs-${index}" data-id="${prod?.id}" id="less">
                                    –
                                </button>
                                <input
                                    type="text"
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
                            <button id class="remove-btn" onclick="removeItem(1)">
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
    const tax = total * 0.05;
    const finalPrice = total+tax
    document.querySelector("#subtotal").textContent = "$" + total;
    document.querySelector("#grand-total").textContent =
        "$" + finalPrice.toFixed(2);
};
renderCart();
updateTotal();
cartGrid.addEventListener("click", e => {
    const add = e.target.closest("#add");
    const less = e.target.closest("#less");
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
                    prod.price;
                cartList[index] = prod;
                localStorage.setItem("cart", JSON.stringify(cartList));
                updateTotal();
            }
        });
        console.log(cartList);
    }
});
