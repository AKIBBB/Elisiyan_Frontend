const getReviewData = () => {
    const param = new URLSearchParams(window.location.search).get("productId");
    if (!param) {
        console.error("Product ID is missing from the URL for reviews.");
        return;
    }

   
    fetch(`https://elisiyan.onrender.com/product/reviews/`)
        .then(res => res.json())
        .then((reviews) => {
            const productReviews = reviews.filter(review => review.clothing_item === parseInt(param));
            displayReviews(productReviews);
        })
        .catch(err => console.error('Error fetching reviews:', err));
};

const displayReviews = (reviews) => {
    const reviewContainer = document.getElementById("review-container");
    reviewContainer.innerHTML = "";
    if (reviews.length === 0) {
        reviewContainer.innerHTML = "<p>No reviews available for this product yet.</p>";
        return;
    }

    reviews.forEach(review => {
        const reviewElement = document.createElement("div");
        reviewElement.classList.add("review-item");

        reviewElement.innerHTML = `
            <p><strong>Reviewer:</strong> ${review.user_name}</p>
            <p><strong>Comment:</strong> ${review.comment}</p>
            <p><strong>Rating:</strong> ${review.rating}</p>
            <p><strong>Date:</strong> ${new Date(review.created_at).toLocaleString()}</p>
            <hr>
        `;

        reviewContainer.appendChild(reviewElement);
    });
};

getReviewData();


document.getElementById("review-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const clothingItemId = new URLSearchParams(window.location.search).get("productId");
    const comment = document.getElementById("comment").value;
    const rating = document.getElementById("rating").value;

    // Check if the user is logged in by looking for the token
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);

    // If the token is not found, show the message and return
    if (!token) {
        showMessage("You need to log in to submit a review.");
        return;
    }

    // Create a message box for feedback to the user
    const messageBox = document.createElement("div");
    messageBox.id = "message-box";
    messageBox.style.display = "none";
    messageBox.style.position = "fixed";
    messageBox.style.top = "10px";
    messageBox.style.right = "10px";
    messageBox.style.padding = "10px";
    messageBox.style.backgroundColor = "#ffcccb";
    messageBox.style.border = "1px solid #f5a9a9";
    messageBox.style.color = "#d8000c";
    messageBox.style.borderRadius = "5px";
    document.body.appendChild(messageBox);

    const showMessage = (message, success = false) => {
        messageBox.textContent = message;
        messageBox.style.display = "block";
        messageBox.style.backgroundColor = success ? "#ccffcc" : "#ffcccb";
        messageBox.style.color = success ? "#008000" : "#d8000c";
        setTimeout(() => {
            messageBox.style.display = "none";
        }, 5000);
    };

    // Send the review data to the backend if the token is present
    fetch("https://elisiyan.onrender.com/product/reviews/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`  // Send the token in the Authorization header
        },
        body: JSON.stringify({
            clothing_item: clothingItemId,
            comment: comment,
            rating: parseInt(rating, 10)
        })
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to submit review");
        }
        return response.json();
    })
    .then((data) => {
        console.log("Review submitted:", data);
        showMessage("Review submitted successfully!", true);
        document.getElementById("review-form").reset();
        getReviewData();
    })
    .catch((error) => {
        console.error("Error submitting review:", error);
        showMessage("Failed to submit review. Please try again.");
    });
});
