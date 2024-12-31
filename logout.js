function handleLogout() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('No token found, you are not logged in.');
        return;
    }

    fetch('https://elisiyan.onrender.com/users/logout/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`  
        }
    })
    .then(response => {
        if (response.ok) {
            localStorage.removeItem('token');
            alert('Logged out successfully');
            window.location.href = 'index.html'; 
        } else {
            alert('Logout failed');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred');
    });
}
