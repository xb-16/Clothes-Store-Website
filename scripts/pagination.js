// pagination
let previous = document.querySelector(".pagination .np:first-child");
let next = document.querySelector(".pagination .np:last-child");
let rounded = document.querySelectorAll(".pagination .rounded");
let counter = 1;

rounded.forEach((rnd) => {
    rnd.addEventListener("click", function () {
        rounded.forEach((rd) => {
            rd.classList.remove("selected");
        })
        rnd.classList.add("selected");
    })
})
next.addEventListener("click", function () {
    counter = rounded[0].innerHTML;    
    console.log();
    if(Number(this.dataset.max) > Number(rounded[2].innerHTML.trim())){
        rounded[0].innerHTML = ++counter;
        rounded[1].innerHTML = ++counter;
        rounded[2].innerHTML = ++counter;
    }
})
previous.addEventListener("click", function () {
    counter = rounded[2].innerHTML;
    if(counter > 3){
        rounded[2].innerHTML = --counter;
        rounded[1].innerHTML = --counter;
        rounded[0].innerHTML = --counter;
    }
})

rounded.forEach((rnd) => {
    rnd.addEventListener("click", function () {
        const page = this.innerHTML;
        const collection = this.parentElement.dataset.collection; 

        const params = new URLSearchParams({
            page: page,
            collection: collection
        });

        fetch(`/priimo/models/fetchProductsPagination.php?${params.toString()}`) // Append parameters to the URL
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text(); 
            })
            .then(html => {
                var productsBox = document.querySelector('.products');
                productsBox.insertAdjacentHTML('afterend', html);
                productsBox.remove();
                productColorsSizes();
                addButton();
                lazyLoad();
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    });
});



