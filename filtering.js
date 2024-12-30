
const API_URL = "https://elisiyan.onrender.com/product/clothing/";

async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
}

async function filterProducts(event) {
    event.preventDefault(); 

    const color = document.getElementById("color").value.trim();
    const size = document.getElementById("size").value.trim();
    const minPrice = parseFloat(document.getElementById("minPrice").value);
    const maxPrice = parseFloat(document.getElementById("maxPrice").value);
    const minPopularity = parseFloat(document.getElementById("minPopularity").value);

    const products = await fetchProducts();

    const filteredProducts = products.filter(product => {
        return (
            (color === "" || product.color.toLowerCase() === color.toLowerCase()) &&
            (size === "" || product.size.toLowerCase() === size.toLowerCase()) &&
            (isNaN(minPrice) || parseFloat(product.price) >= minPrice) &&
            (isNaN(maxPrice) || parseFloat(product.price) <= maxPrice) &&
            (isNaN(minPopularity) || product.popularity >= minPopularity)
        );
    });

    displayProducts(filteredProducts);
}

// Display products on the page
function displayProducts(products) {
    const productsDiv = document.getElementById("products");
    productsDiv.innerHTML = ""; 

    if (products.length === 0) {
        productsDiv.innerHTML = "<p>No products found.</p>";
        return;
    }

    products.forEach(product => {
        const productDiv = document.createElement("div");
        productDiv.style.border = "1px solid #ccc";
        productDiv.style.padding = "10px";
        productDiv.style.margin = "10px 0";

        productDiv.innerHTML = `
                    <h3>${product.name}</h3>
                    <p>Description: ${product.description}</p>
                    <p>Price: $${product.price}</p>
                    <p>Color: ${product.color}</p>
                    <p>Size: ${product.size}</p>
                    <p>Popularity: ${product.popularity}</p>
                    <img src="${product.image}" alt="${product.name}" width="150" />
                `;
        productsDiv.appendChild(productDiv);
    });
}

document.getElementById("filterForm").addEventListener("submit", filterProducts);
