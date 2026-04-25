
// const api = "http://localhost:3000/api/v1/auth/login"
const api = "https://codealpha-easy-shop-api.onrender.com/api/v1/auth/login"

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const btn = document.querySelector(".login-btn")
    
    
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.getElementById("password");

    form.addEventListener("submit", async e => {
        e.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        // ---------------- VALIDATION ----------------
        if (!email || !password) {
            alert("All fields are required!");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Invalid email address!");
            return;
        }

        // Password validation
        if (password.length < 6) {
            alert("Password must be at least 6 characters!");
            return;
        }
        // ---------------- API CALL ----------------
        try {
            btn.textContent = "Processing..."
            btn.disable = true;
            const res = await fetch(api, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                // credentials: "include",
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Registration failed!");
                return;
            }

            // Success
            console.log(data);
            //  alert("Account created successfully!");
            //Setting token in
            localStorage.setItem("token", data?.token);
            localStorage.setItem("user", JSON.stringify(data?.user));
            // Optional redirect
            if(data?.user?.role === "ADMIN"){
            window.location.href = "/admin.html";
            }
            window.location.href = "/index.html";
        } catch (err) {
            console.error(err);
            alert("Server error! Try again later.");
        }finally{
            btn.textContent = "Login Now"
            btn.disable = false;
        }
    });
});
