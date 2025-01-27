
const displayMessage = (message, type) => {
    const messageBox = document.getElementById("message-box") || document.body.appendChild(document.createElement("div"));
    messageBox.id = "message-box";
    messageBox.innerText = message;
    messageBox.className = `message ${type}`; 
    messageBox.style.display = "block";
    setTimeout(() => (messageBox.style.display = "none"), 3000);
};

const fetchUserProfile = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        displayMessage("You are not logged in. Please log in to continue.", "error");
        return;
    }

    fetch("https://elisiyan.onrender.com/users/profile/", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Unauthorized. Please log in again.");
                }
                if (response.status === 403) {
                    throw new Error("Access forbidden.");
                }
                throw new Error(`Failed to fetch profile. Status: ${response.status}`);
            }
            return response.json();
        })
        .then((profileData) => {
            console.log("Profile Data:", profileData);
            displayUserProfile(profileData);
        })
        .catch((error) => {
            console.error("Error:", error);
            displayMessage(error.message, "error");
        });
};

const displayUserProfile = (data) => {
    const profileContainer = document.getElementById("profile-container");

    if (!profileContainer) {
        console.error("Profile container not found.");
        return;
    }

    profileContainer.innerHTML = `
        <h2>User Profile</h2>
        <p><strong>Username:</strong> ${data.username}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Role:</strong> ${data.role}</p>
        <p><strong>First Name:</strong> ${data.first_name || "N/A"}</p>
        <p><strong>Last Name:</strong> ${data.last_name || "N/A"}</p>
    `;
};


document.addEventListener("DOMContentLoaded", fetchUserProfile);
