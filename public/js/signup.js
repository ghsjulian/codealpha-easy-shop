

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    const fullNameInput = document.querySelector('input[type="text"]');
    const emailInput = document.querySelector('input[type="email"]');
    const phoneInput = document.querySelector('input[type="tel"]');
    const passwordInput = document.getElementById("reg-password");
    const confirmPasswordInput = document.getElementById("confirm-password");

    form.addEventListener("submit", async e => {
        e.preventDefault();

        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // ---------------- VALIDATION ----------------
        if (!fullName || !email || !phone || !password || !confirmPassword) {
            alert("All fields are required!");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Invalid email address!");
            return;
        }

        // Phone validation (Bangladesh format basic)
        const phoneRegex = /^(\+8801|01)[3-9]\d{8}$/;
        if (!phoneRegex.test(phone.replace(/\s|-/g, ""))) {
            alert("Invalid phone number!");
            return;
        }

        // Password validation
        if (password.length < 6) {
            alert("Password must be at least 6 characters!");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // ---------------- API CALL ----------------
        try {
            const res = await fetch(
                "http://localhost:3000/api/v1/auth/signup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    //credentials: "include",
                    body: JSON.stringify({
                        name: fullName,
                        email,
                        phone,
                        password
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Registration failed!");
                return;
            }

            // Success
            alert("Account created successfully!");
            localStorage.setItem("token", data?.token);
            localStorage.setItem("user", JSON.stringify(data?.user));

            // Optional redirect
            window.location.href = "/login.html";
        } catch (err) {
            console.error(err);
            alert("Server error! Try again later.");
        }
    });
});
