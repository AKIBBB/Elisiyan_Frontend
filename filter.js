
const handleCetageroy = (category) => {
    const rowContainer = document.getElementById("row");
    fetch(`https://elisiyan.onrender.com/product/clothing/?category=${category}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.length === 0) {
                rowContainer.innerHTML = `<img src="rb_2148257696.png" alt="No products found">`;
            } else {
                displayCategoryProducts(data);
                createPagination(data); 
            }
        })
        .catch((err) => {
            console.error("Error fetching products:", err);
            rowContainer.innerHTML = `<img id="errimg" src="rb_2148257696.png" alt="Error loading products">`;
        });
};


const displayCategoryProducts = (services) => {
    const parent = document.getElementById("row");
    parent.innerHTML = "";

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedServices = services.slice(startIndex, endIndex);

    paginatedServices.forEach((service) => {
        const div = document.createElement("div");
        div.classList.add("main-row");
        div.innerHTML = `
            <div class="row-text">
                <h6>Explore new arrivals</h6>
                <h3>Give the gift <br>of choice</h3>
            </div>
            <div class="row-img">
                <img src=${service.image} alt="${service.name}">
                <p>${service.name}</p>
            </div>
            <a target="_blank" href="product.html?productId=${service.id}" class="row-btn">Show me all</a>
        `;
        parent.appendChild(div);
    });
};


const searchCategoryName = (event) => {
    event.preventDefault(); 
    const category = event.target.getAttribute("data-category"); 
    handleCetageroy(category); 
};


handleCetageroy("men"); 
