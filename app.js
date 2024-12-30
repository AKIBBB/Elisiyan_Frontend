const header = document.querySelector("header");

window.addEventListener("scroll", function () {
    header.classList.toggle("sticky", this.window.scrollY > 0);
});

let currentPage = 1;
const itemsPerPage = 4;
let allProducts = [];

const loadProducts = (search) => {
    const rowContainer = document.getElementById("row");

    fetch(`https://elisiyan.onrender.com/product/clothing/?name=${search ? search : ""}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if (data.length === 0) {
                rowContainer.innerHTML = `<img src="rb_2148257696.png" alt="">`;
            } else {
                displayProducts(data);
                createPagination(data);
            }
        })
        .catch((err) => {
            console.log(err)
            // console.error("Error fetching products:", err);
            rowContainer.innerHTML = `<img id="errimg" src="rb_2148257696.png" alt="">`;
        });
};


const displayProducts = (services) => {
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

// document.getElementById("explore-btn").addEventListener("click", () => {
//     if (allProducts.length > 0) {
//         displayProducts(allProducts);
//         createPagination(allProducts);
//     } else {
//         loadProducts();
//     }
// });


const createPagination = (services) => {
    const totalItems = services.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    if (currentPage > 1) {
        const prevButton = document.createElement("button");
        prevButton.textContent = "Previous";
        prevButton.classList.add("pagination-btn");
        prevButton.addEventListener("click", () => {
            currentPage--;
            displayProducts(services);
            createPagination(services);
        });
        paginationContainer.appendChild(prevButton);
    }

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.classList.add("pagination-btn");
        if (i === currentPage) pageButton.classList.add("active");
        pageButton.addEventListener("click", () => {
            currentPage = i;
            displayProducts(services);
            createPagination(services);
        });
        paginationContainer.appendChild(pageButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement("button");
        nextButton.textContent = "Next";
        nextButton.classList.add("pagination-btn");
        nextButton.addEventListener("click", () => {
            currentPage++;
            displayProducts(services);
            createPagination(services);
        });
        paginationContainer.appendChild(nextButton);
    }
};


const searchCategory = (event) => {
    const value = document.getElementById("search").value;
    loadProducts(value);
};

searchCategory();

loadProducts();
// about
// Get the elements
