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
                body: JSON.stringify(info)
            })
            .then(res => res.json())
            .then((data) => {
                console.log(data); 
                if (data.success) {
                    displayMessage("Registered successfully! Please check your email to confirm your account.", "success");
                } else {
                    displayMessage(data.message || "Registration failed.", "error");
                }
            })
            .catch(error => {
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





window.onload = () => {
    const form = document.querySelector("form");
    if (form) {
        form.onsubmit = UserRegistration;  
    }
};




//  UserRegistration();


const handleLogin = (event) => {
    event.preventDefault();
    const username = getvalue("login-username");
    const password = getvalue("login-password");

    if (username && password) {
        fetch("https://elisiyan.onrender.com/users/login/",
            {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ username, password }),
            })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data.token && data.user_id) {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user_id", data.user_id);
                    const messageDiv = document.createElement("div");
                    messageDiv.textContent = "Logged in successfully!";
                    messageDiv.style.position = "fixed";
                    messageDiv.style.top = "20px";
                    messageDiv.style.left = "50%";
                    messageDiv.style.transform = "translateX(-50%)";
                    messageDiv.style.backgroundColor = "#4CAF50";
                    messageDiv.style.color = "white";
                    messageDiv.style.padding = "10px 20px";
                    messageDiv.style.borderRadius = "5px";
                    messageDiv.style.zIndex = "1000";
                    document.body.appendChild(messageDiv);
                    setTimeout(() => {
                        document.body.removeChild(messageDiv);
                        window.location.href = "index.html";
                    }, 3000);
                } else {
                    alert("Login failed. Check your username and password.");
                }
            })
            .catch(error => console.error("Error:", error));
    }
};


handleLogin();
UserRegistration();

// abcd1234%A

const handleLogout=()=>{
    const token=localStorage.getItem('token');
    fetch("https://elisiyan.onrender.com/users/logout/",{
        method:"GET" ,
        headers: {
            "Authorizatiob": `Token ${token}`,
            "Content-Type": "application/json"
        }
    
    })
    .then(res => res.json())
    .then((data)=>{
        console.log(data);
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
    });
   
};

