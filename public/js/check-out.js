const api = "https://codealpha-easy-shop-api.onrender.com/api/v1/orders/create-order";
const cartList = JSON.parse(localStorage.getItem("cart")) || [];
const cartCount = document.querySelector(".cart-count");
const payBtn = document.querySelector(".btn-pay");
const methods = document.querySelectorAll(".method");

methods.forEach(el => {
    el.onclick = () => {
        methods.forEach(mt => mt.classList.remove("active"));
        el.classList.add("active");
    };
});

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
    const user = JSON.parse(localStorage.getItem("user")) || null;
    let price = 0;
    cartList.map(prod => {
        return (price += prod.price);
    });
    const prices = calculateFinalPrice(price, 10, 10, 0);
    document.querySelector("#name").value = user?.name;
    document.querySelector("#phone").value = user?.phone;
    document.querySelector("#email").value = user?.email;
    document
        .querySelector("#final-price")
        .setAttribute("val", prices.finalPrice);
    document.querySelector("#sub-total").textContent = "$" + prices.subtotal;
    document.querySelector("#tax").textContent = "$" + prices.tax;
    document.querySelector("#discount").textContent = "$" + prices.discount;
    document.querySelector("#final-price").textContent =
        "$" + prices.finalPrice;
    cartCount.innerHTML = cartList.length;
};

payBtn.onclick = async () => {
    const user = JSON.parse(localStorage.getItem("user")) || null;
    const name = document.querySelector("#name").value;
    const phone = document.querySelector("#phone").value;
    const email = document.querySelector("#email").value;
    const address = document.querySelector("#address").value;
    const city = document.querySelector("#city").value;
    const zip = document.querySelector("#zip").value;
    const holder = document.querySelector("#holder-name").value;
    const card = document.querySelector("#card").value;
    const cvv = document.querySelector("#cvv").value;
    const expiry = document.querySelector("#expiry").value;
    const method = document.querySelector(".method.active>span").textContent;
    const price = document.querySelector("#final-price").getAttribute("val");

    if (
        !name ||
        !phone ||
        !email ||
        !address ||
        !city ||
        !zip ||
        !holder ||
        !card ||
        !cvv ||
        !method ||
        !expiry
    ) {
        alert("Please fill out the checkout form");
        return;
    }
    if(cartList?.length == 0) {
        alert("No item in your cart");
        return;
    }
    let payData = {
        name,
        phone,
        email,
        address,
        city,
        zip,
        holder,
        card,
        cvv,
        method,
        expiry
    };
    const products = {
        allProducts: JSON.stringify(cartList),
        totalPrice: price,
        paymentType: method,
        paymentStatus: "UNPAID"
    };
    payData.products = products;

    try {
        payBtn.disable = true;
        payBtn.innerHTML = ' <i class="bx bx-lock-alt"></i> Processing...';
        const request = await fetch(api, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                token: localStorage.getItem("token") || null
            },
            body: JSON.stringify({ payData })
        });
        const response = await request.json();
        if (response?.success) {
            localStorage.removeItem("cart");
            window.location = "/";
        }
    } catch (error) {
        console.log(error);
    } finally {
        payBtn.disable = false;
        payBtn.innerHTML = ' <i class="bx bx-lock-alt"></i> Complete Purchase';
    }
};

updateCartCount();
