var api = "http://localhost:3000/api/v1/products/add-product"
const fileInput = document.getElementById("fileInput");
const imagePreview = document.getElementById("imagePreview");
const form = document.querySelector("form");
const submitBtn = document.querySelector("#submit");

// Preview image
fileInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const objectURL = URL.createObjectURL(file);
    imagePreview.src = objectURL;
    imagePreview.style.display = "block";

    imagePreview.onload = () => {
        URL.revokeObjectURL(objectURL);
    };
});

// Convert file to base64 helper
const toBase64 = file => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
};

// Submit form
form.addEventListener("submit", async e => {
    e.preventDefault();

    const name = form.querySelector('input[type="text"]').value.trim();
    const category = form.querySelector("select").value;
    const price = form.querySelector('input[type="number"]').value;
    const description = form.querySelector("textarea").value.trim();
    const stock = form.querySelectorAll('input[type="number"]')[1].value;
    const file = fileInput.files[0];

    // Validation
    if (!name) return alert("Product name is required");
    if (!category) return alert("Category is required");
    if (!price || price <= 0) return alert("Valid price is required");
    if (!description) return alert("Description is required");
    if (!stock || stock < 0) return alert("Valid stock is required");
    if (!file) return alert("Please upload an image");

    if (!file.type.startsWith("image/")) {
        return alert("Only image files allowed");
    }

    if (file.size > 2 * 1024 * 1024) {
        return alert("Image must be under 2MB");
    }

    try {
        // ✅ wait for base64 conversion
        const fileData = await toBase64(file);
        submitBtn.textContent = "Please wait..."
        const res = await fetch(
            api,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "token" : localStorage.getItem("token") || null
                },
                body: JSON.stringify({
                    name,
                    category,
                    price,
                    description,
                    stock,
                    file: fileData
                })
            }
        );

        const data = await res.json();

        if (!res.ok) {
            return alert(data.message || "Failed to create product");
        }

        alert("Product created successfully!");
        form.reset();
        imagePreview.src = "";
        imagePreview.style.display = "none";

    } catch (error) {
        console.error(error);
        alert("Server error");
    }finally{
        submitBtn.textContent = "Publish Product"
    }
});