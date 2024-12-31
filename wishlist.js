document.addEventListener("DOMContentLoaded", () => {
    const wishlistContainer = document.getElementById("wishlist-container");
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (wishlist.length === 0) {
        displayEmptyWishlistMessage();
    } else {
        displayWishlistItems(wishlist);
    }
});

const displayWishlistItems = (wishlist) => {
    const wishlistContainer = document.getElementById("wishlist-container");

    wishlistContainer.innerHTML = ""; // Clear previous content
    wishlist.forEach(productId => {
        fetch(`https://elisiyan.onrender.com/product/clothing/${productId}/`)
            .then(res => res.json())
            .then(product => {
                const productDiv = document.createElement("div");
                productDiv.classList.add("wishlist-item");

                productDiv.innerHTML = `
                    <div class="product-box">
                        <img src="${product.image || 'default-image.jpg'}" alt="${product.name || 'Product'}">
                        <p>${product.name || 'Product Name'}</p>
                        <p>Price: ${product.price || 'N/A'}</p>
                        <button class="remove-btn" data-product-id="${productId}">Remove</button>
                    </div>
                `;

                wishlistContainer.appendChild(productDiv);

                const removeButton = productDiv.querySelector(".remove-btn");
                removeButton.addEventListener("click", () => removeFromWishlist(productId));
            })
            .catch(err => console.error(`Error fetching product ${productId}:`, err));
    });
};

const removeFromWishlist = (productId) => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    const wishlistContainer = document.getElementById("wishlist-container");
    if (wishlist.length === 0) {
        displayEmptyWishlistMessage();
    } else {
        displayWishlistItems(wishlist);
    }
};

const displayEmptyWishlistMessage = () => {
    const wishlistContainer = document.getElementById("wishlist-container");
    wishlistContainer.innerHTML = `
        <div class="empty-wishlist">
            <p>Your wishlist is empty.</p>
        </div>
    `;
};

