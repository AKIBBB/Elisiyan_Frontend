const displayWishlist = () => {
    const wishlistContainer = document.getElementById("wishlist-container");
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    if (wishlist.length === 0) {
        wishlistContainer.innerHTML = "<p>Your wishlist is empty.</p>";
        return;
    }

    wishlistContainer.innerHTML = ""; 

    wishlist.forEach(productId => {
        fetch(`https://elisiyan.onrender.com/product/clothing/${productId}/`)
            .then(res => res.json())
            .then(product => {
                const div = document.createElement("div");
                div.classList.add("wishlist-item");
                div.innerHTML = `
                    <div class="product-details">
                        <img src="${product.image || 'default-image.jpg'}" alt="${product.name}">
                        <p>Name:${product.name}</p>
                        <p>Description:${product.description}</p>
                        <p>Price:${product.price}</p>
                        <button class="remove">Remove</button>
                    </div>
                `;
                
                // Add event listener to the remove button
                const removeButton = div.querySelector(".remove");
                removeButton.addEventListener("click", () => {
                    // Remove the productId from the wishlist
                    const updatedWishlist = wishlist.filter(id => id !== productId);
                    // Update the wishlist in localStorage
                    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
                    // Re-display the wishlist
                    displayWishlist();
                });

                wishlistContainer.appendChild(div);
            })
            .catch(err => console.error('Error fetching wishlist product:', err));
    });
};

window.onload = displayWishlist;
