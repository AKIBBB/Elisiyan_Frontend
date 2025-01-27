const displayMessage = (message, type) => {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageDiv.style.position = "fixed";
    messageDiv.style.top = "20px";
    messageDiv.style.left = "50%";
    messageDiv.style.transform = "translateX(-50%)";
    messageDiv.style.padding = "10px 20px";
    messageDiv.style.borderRadius = "5px";
    messageDiv.style.zIndex = "1000";

    if (type === "success") {
        messageDiv.style.backgroundColor = "#4CAF50";
        messageDiv.style.color = "white";
    } else if (type === "error") {
        messageDiv.style.backgroundColor = "#f44336";
        messageDiv.style.color = "white";
    }

    document.body.appendChild(messageDiv);
    setTimeout(() => {
        document.body.removeChild(messageDiv);
    }, 3000);
};

function getvalue(id) {
    return document.getElementById(id)?.value;
}

const UserRegistration = (event) => {
    event.preventDefault();
    const username = getvalue("username");
    const first_name = getvalue("firstname");
    const last_name = getvalue("lastname");
    const email = getvalue("email");
    const password = getvalue("password");
    const confirm_password = getvalue("confirm_password");

    const info = {
        username,
        first_name,
        last_name,
        email,
        password,
        confirm_password,
    };

    if (password === confirm_password) {
        document.getElementById("error").innerText = "";

        if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)) {
            fetch("https://elisiyan.onrender.com/users/register/", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify(info),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    if (data.success) {
                        displayMessage("Registered successfully! Please check your email to confirm your account.", "success");
                    } else {
                        displayMessage(data.message || "Registration failed.", "error");
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                    displayMessage("Registration failed.", "error");
                });
        } else {
            document.getElementById("error").innerText = "Password must be at least 8 characters long, and contain at least one number, one letter, and one special character.";
        }
    } else {
        document.getElementById("error").innerText = "Passwords do not match.";
        displayMessage("Passwords do not match.", "error");
    }
};

const handleLogin = (event) => {
    event.preventDefault();

    const username = getvalue("login-username");
    const password = getvalue("login-password");

    if (username && password) {
        fetch("https://elisiyan.onrender.com/users/login/", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Login failed with status ${res.status}`);
                }
                return res.json();
            })
            .then((data) => {
                if (data.token && data.user_id) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user_id", data.user_id);

                    if (data.role === "Superuser" || data.role === "Staff") {
                        displayMessage("Welcome Admin!", "success");

                        // Fetch admin interface
                        fetch("https://elisiyan.onrender.com/users/admin-interface/", {
                            method: "GET",
                            headers: {
                                "Authorization": `Bearer ${data.token}`,
                            },
                        })
                            .then((res) => {
                                if (!res.ok) {
                                    throw new Error(
                                        `Access forbidden with status ${res.status}`
                                    );
                                }
                                return res.json();
                            })
                            .then((adminData) => {
                                console.log("Admin Data:", adminData);
                                setTimeout(() => {
                                    window.location.href = "admin_interface.html";
                                }, 2000);
                            })
                            .catch((error) => {
                                console.error("Error fetching admin interface:", error);
                                displayMessage("Access forbidden.", "error");
                            });
                    } else {
                        displayMessage("Logged in successfully!", "success");
                        setTimeout(() => {
                            window.location.href = "index.html";
                        }, 2000);
                    }
                } else {
                    displayMessage(
                        "Login failed. Check your username and password.",
                        "error"
                    );
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                displayMessage("An error occurred. Please try again later.", "error");
            });
    } else {
        displayMessage("Please fill in both fields.", "error");
    }
};


// Function to fetch admin interface data
const fetchAdminInterface = () => {
    const token = localStorage.getItem("token");
    if (!token) {
        displayMessage("You are not logged in. Please log in to continue.", "error");
        return;
    }

    fetch("https://elisiyan.onrender.com/users/admin-interface/", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    })
        .then((res) => {
            if (res.status === 403) {
                throw new Error("Access forbidden. Ensure you have the correct permissions.");
            }
            return res.json();
        })
        .then((data) => {
            console.log("Admin data:", data);
        })
        .catch((error) => {
            console.error("Error:", error);
            displayMessage(error.message, "error");
        });
};


document.getElementById("login-form").addEventListener("submit", handleLogin);


window.onload = () => {
    const loginForm = document.querySelector("#login-form");
    const registerForm = document.querySelector("#registration-form");

    if (loginForm) {
        loginForm.onsubmit = handleLogin;
    }

    if (registerForm) {
        registerForm.onsubmit = UserRegistration;
    }
};


document.getElementById('logoutButton').addEventListener('click', function () {
    handleLogout();
});

function handleLogout() {
    const token = localStorage.getItem('token'); 
    console.log('Token:', token);

    if (!token) {
        alert('No token found. You are already logged out.');
        window.location.href = 'index.html';
        return;
    }
    const authHeader = `Token ${token}`;

    fetch('https://elisiyan.onrender.com/users/logout/', {
        method: 'POST',
        headers: {
            Authorization: authHeader, 
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Response:', data);
        if (data.message && data.message.toLowerCase().includes('logged out')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            alert('Logout successful');
            window.location.href = 'index.html';
        } else {
            alert('Logout failed: ' + (data.message || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
};



