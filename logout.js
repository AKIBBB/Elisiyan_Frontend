function handleLogout() {
    fetch('https://elisiyan.onrender.com/users/logout/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${localStorage.getItem('token')}`  
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
