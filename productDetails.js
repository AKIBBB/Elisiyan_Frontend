const getparams = () => {
    const param = new URLSearchParams(window.location.search).get("productId");
    if (!param) {
        console.error("Product ID is missing from the URL.");
        return;
    }
    fetch(`https://elisiyan.onrender.com/product/clothing/${param}/`)
        .then(res => res.json())
        .then((data) => displayDetails(data));
};


const getReviewData = () => {
    const param = new URLSearchParams(window.location.search).get("productId");
    fetch(`https://elisiyan.onrender.com/product/reviews/?productId=${param}`)
        .then(res => res.json())
        .then(data => displayReviews(data))
        .catch(err => console.error('Error fetching reviews:', err));
};

getReviewData();

// Display product details
const displayDetails = (service) => {
    console.log("Service data:", service);

    if (!service) {
        console.error("Service is undefined");
        return;
    }

    const parent = document.getElementById("product");
    if (!parent) {
        console.error("Element with id 'product' not found.");
        return;
    }

    const div = document.createElement("div");
    div.classList.add("product-content");

    div.innerHTML = `
        <div class="box">
            <div class="box-img">
                <img src="${service.image || 'default-image.jpg'}" alt="${service.name || 'Product Image'}">
            </div>
            <p>Name: ${service.name || 'N/A'}</p>
            <p>Description: ${service.description || 'No description available'}</p>
            <p>Color: ${service.color || 'N/A'}</p>
            <p>Size: ${service.size || 'N/A'}</p>
            <p>Average Rating: ${service.average_rating || 'Not rated yet'}</p>
            <p>Category: ${service.category?.name || 'N/A'}</p>
            <h4 class="price">Price: ${service.price || 'Contact for price'}</h4>
        </div>
        <div class="Button">
            <button class="buy" id="add-to-wishlist" data-product-id="${service.id}">Add To Wishlist</button>
            <p>
                <button class="buy" id="review">Review</button>
            </p>
            <button class="buy" id="buy">Buy</button>
        </div>
        <div id="wishlist-success-message" style="display:none; color: green;">Added to wishlist successfully!</div>
    `;

    parent.appendChild(div);
    const wishlistButton = div.querySelector("#add-to-wishlist");
    wishlistButton.addEventListener("click", () => {
        const productId = wishlistButton.getAttribute("data-product-id");
        addToWishlist(productId);
    });

    const reviewButton = div.querySelector("#review");
    reviewButton.addEventListener("click", () => {
        if (isUserLoggedIn()) {
            window.location.href = `review.html?productId=${service.id}`;
        } else {
            alert("Please log in to review the product.");
        }
    });

    const buyButton = div.querySelector("#buy");
    buyButton.addEventListener("click", () => {
        if (isUserLoggedIn()) {
            showBuyForm(service);
        } else {
            alert("Please log in to buy the product.");
        }
    });
};




const showBuyForm = (product) => {
    const modal = document.createElement('div');
    modal.id = 'buy-modal';
    modal.classList.add('modal');
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn" id="close-modal">&times;</span>
            <h3>Enter your details to purchase</h3>
            <form id="purchase-form">
                <label for="name">Name:</label>
                <input type="text" id="name" required><br><br>
                <label for="phone">Phone Number:</label>
                <input type="text" id="phone" required><br><br>
                <label for="address">Address:</label>
                <textarea id="address" required></textarea><br><br>
                <button type="submit">Submit</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    modal.style.display = 'block';
    const closeModalBtn = document.getElementById('close-modal');
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        modal.remove();
    });

    const form = document.getElementById('purchase-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        generatePDF(product);
        modal.style.display = 'none';
        modal.remove();
    });
};


const generatePDF = (product) => {
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    if (typeof jsPDF === 'undefined') {
        console.error("jsPDF is not loaded!");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Purchase Receipt", 20, 20);

    doc.setFontSize(12);
    doc.text(`Name: ${name}`, 20, 30);
    doc.text(`Phone: ${phone}`, 20, 40);
    doc.text(`Address: ${address}`, 20, 50);

    doc.text(`Product: ${product.name}`, 20, 60);
    doc.text(`Size: ${product.size}`, 20, 70);
    doc.text(`Price: ${product.price}`, 20, 80);
    doc.save(`purchase-receipt-${product.id}.pdf`);
};

if (typeof jsPDF === 'undefined') {
    console.error('jsPDF is not available!');
}

const isUserLoggedIn = () => {
    const userToken = localStorage.getItem('token');  
    return userToken !== null;
};



const addToWishlist = (productId) => {
    // Check if the user is logged in
    if (!isUserLoggedIn()) {
        alert("Please log in to add products to your wishlist.");
        return; // Stop the function if the user is not logged in
    }

    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));

        const successMessage = document.getElementById('wishlist-success-message');
        if (successMessage) {
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 10000);
        }
    } else {
        console.log("Product is already in the wishlist.");
    }
};


getparams();




