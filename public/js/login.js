
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

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
            const res = await fetch("http://localhost:3000/api/v1/auth/login", {
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
            window.location.href = "/index.html";
        } catch (err) {
            console.error(err);
            alert("Server error! Try again later.");
        }
    });
});
