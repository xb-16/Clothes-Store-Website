function removeNonIntegerKeys() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
        if (!/^\d+$/.test(key)) {
            localStorage.removeItem(key);
        }
    });
}
removeNonIntegerKeys();
let dropdowns = document.querySelectorAll("nav .dropdown");
let subs = document.querySelectorAll("nav .sub");
let heads = document.querySelectorAll("nav .head");
let searchBar = document.querySelector(".searchBar");
let searchBtn = document.querySelector(".searchBtn");
let closeSearchBtn = document.querySelector(".searchBar .fa-xmark");

/* hambargar */
let hmb = document.querySelector(".hambargar");
hmb.addEventListener("click",function(){
    hmb.classList.toggle("activeHmb");
})

/* show seach bar */
searchBtn.addEventListener("click",function(){
    searchBar.classList.toggle("showSearchBar");
})
/* close search bar */
closeSearchBtn.addEventListener("click",function(){
    searchBar.classList.remove("showSearchBar");
})

/* dropdown menu */
heads.forEach((head) => {
  head.addEventListener("click", (e) => {
    document.querySelector(".main-sub").classList.toggle("active");
  });
});
/* if i click ooutside of dropdown will disappeared also ignoring the mnl-btn */
document.addEventListener("click",function(e){
    if(!dropdowns[0].contains(e.target) && !e.target.classList.contains("mnl-btn")){
        document.querySelectorAll("nav .sub").forEach((sub) => {
            sub.classList.remove("active");
            hmb.classList.remove("activeHmb");
        })
    }
    // if i click ooutside of search bar will disappeared also ignoring the mnl-btn
    if(searchBar.classList.contains("showSearchBar") && !searchBar.contains(e.target) && !e.target.classList.contains("mnl-btn") && !e.target.classList.contains("searchBtn")) {
        searchBar.classList.remove("showSearchBar");
    }
})

// collection select arrow
document.querySelectorAll(".selectContainer").forEach(element => {
    element.addEventListener("click",function(){
        this.classList.toggle("upDownSelect");
    }) 
});

// Sticky navbar 
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('nav');

    if (window.scrollY > 200) {
        navbar.classList.add('sticky');
    } else {
        navbar.classList.remove('sticky');
    }
});
const cart = document.querySelector(".cartItems");
const cartNotification = document.querySelector(".fa-cart-shopping");
/* first filling cart */
let cartItems = document.querySelector(".cartItems");
cartNotification.style.setProperty("--cart-notification", "'" + localStorage.length + "'");
if(localStorage.length == 0){
   cartItems.innerHTML = `<i class="fa-regular fa-cart-circle-xmark emptyCart" style="color:white;display:block;text-align:center;font-size:60px;"></i><span class="emptyCart" style="color:grey;display:block;text-align:center;padding:60px;">Your cart is empty</span>`;
}
for (let i = 0; i < localStorage.length; i++) {
    let productStored = JSON.parse(localStorage.getItem(localStorage.key(i)));
    let cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
        <div class="cart-item-img">
            <img loading="lazy" src="${productStored.img}" alt="">
        </div>
        <div class="cart-item-info">
            <h3><a href="${productStored.url}" target="_blank">${productStored.name}</a></h3>
            <div class="boxDetails">
            <div class="cart-item-price">${productStored.price}</div>
            <div class="productSizes">
                <span class="choosedSize">${productStored.size}</span>
            </div>
            <div class="colorsAvailable productColor">
                <span style="background-color: ${productStored.color};" class="choosedColor"></span>
            </div>
            </div>            
            <div class="cart-item-quantity number-input">
                <button onclick="this.parentNode.querySelector('input[type=number]').stepDown()" class="minus"></button>
                <input class="quantity" min="1" name="quantity" value="${productStored.quantity}" type="number">
                <button onclick="this.parentNode.querySelector('input[type=number]').stepUp()" class="plus"></button>
            </div>
        </div>
        <i class="fa-solid fa-trash cart-delete"></i>
    `;
    cartItem.dataset.id = productStored.id;
    cartItems.appendChild(cartItem);
}
updateTotal();
/* */

/* cart shopping*/
function openCart() {
    document.getElementById("cartShopping").style.width = "320px";
    document.body.style.opacity = "0.85";
}  
function closeCart() {
    document.getElementById("cartShopping").style.width = "0";
    document.body.style.opacity = "unset";
  }
/* */

/* update total price */
function updateTotal() {
    let cartItems = document.querySelectorAll(".cart-item");
    let total = 0;
    for (let i = 0; i < cartItems.length; i++){
        var productDetails = {
            id: cartItems[i].dataset.id,
            name: cartItems[i].querySelector("h3 a").innerText,
            url : cartItems[i].querySelector("h3 a").href,
            img: cartItems[i].querySelector(".cart-item-img img").getAttribute("src"),
            price: cartItems[i].querySelector(".cart-item-price").innerText,
            size: cartItems[i].querySelector(".choosedSize").innerText,
            color: cartItems[i].querySelector(".choosedColor").style.backgroundColor,
            quantity: cartItems[i].querySelector(".quantity").value
        }
        localStorage.setItem(productDetails.id,JSON.stringify(productDetails));

        let cartItem = cartItems[i];
        let priceElement = cartItem.querySelector(".cart-item-price");
        let quantityElement = cartItem.querySelector(".quantity");
        let price = parseFloat(priceElement.innerText.replace("MAD", ""));
        let quantity = quantityElement.value;
        total += price * quantity;
    }
    document.querySelector("#total").innerText = total.toFixed(2) + " MAD";

    cartNotification.style.setProperty("--cart-notification", "'" + localStorage.length + "'");
    if(localStorage.length == 0){
        cart.innerHTML = `<i class="fa-regular fa-cart-circle-xmark emptyCart" style="padding-top:60px;color:white;display:block;text-align:center;font-size:60px;"></i><span class="emptyCart" style="color:grey;display:block;text-align:center;padding:60px;">Your cart is empty</span>`;
    }
}
/* */

/* update quantity */
cart.addEventListener("change", (event) => {
    if (event.target.classList.contains("quantity")) {
        updateTotal();
    }
});

cart.addEventListener("click", (event) => {
    if(event.target.tagName === "BUTTON") {
        updateTotal();
    }
});
/* */

/* add product to cart */
let addButtons;
function addButton(){
    addButtons = document.querySelectorAll(".productItem:not(.piTgt)");
    for (let i = 0; i < addButtons.length; i++) {
        let addButton = addButtons[i].querySelector(".fa-plus");
        addButton.addEventListener("click", function(e) {
            if(e.target.nextElementSibling.querySelector(".choosedColor") && e.target.parentElement.nextElementSibling.querySelector(".choosedSize")){
                let product = {
                    url: addButton.getAttribute("data-link"),
                    id: addButton.getAttribute("data-id"),
                    name: addButton.getAttribute("data-name"),
                    price: addButton.getAttribute("data-price"),
                    img: addButton.getAttribute("data-img"),
                    color : addButton.getAttribute("data-color"),
                    size : addButton.getAttribute("data-size")
                };
                addToCart(product);
                if(cart.querySelector(".emptyCart")){
                    cart.querySelector(".emptyCart").remove();
                    cart.querySelector(".emptyCart").remove();
                }
                popup("you add a product to your cart","fa-circle-check");
                setTimeout(() => {
                    openCart();
                    
                }, 1500);
            }else{
                popup("Please choose color and size first","fa-triangle-exclamation");
            }
    
        });
    }

}
addButton();

function addToCart(product) {
    const productsIds = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i));
    let found = false;
    productsIds.forEach(productId => {
        if(productId == product.id) {
            let quantityElement = document.querySelector(".cart-item[data-id='" + product.id + "").querySelector(".cart-item-quantity input");
            document.querySelector(".cart-item[data-id='" + product.id + "").querySelector(".choosedSize").innerText = product.size;
            document.querySelector(".cart-item[data-id='" + product.id + "").querySelector(".choosedColor").style.backgroundColor = product.color;
            quantityElement.value++;
            updateTotal();
            found = true;
            return;
        }
    })
    if(found){
        return;
    }

    let cartItems = document.querySelector(".cartItems");
    let cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
        <div class="cart-item-img">
            <img loading="lazy" src="${product.img}" alt="">
        </div>
        <div class="cart-item-info">
            <h3><a href="${product.url}" target="_blank">${product.name}</a></h3>
            <div class="boxDetails">
            <div class="cart-item-price">${product.price} MAD</div>
            <div class="productSizes">
                <span class="choosedSize">${product.size}</span>
            </div>
            <div class="colorsAvailable productColor">
                <span style="background-color: ${product.color};" class="choosedColor"></span>
            </div>
            </div>            
            <div class="cart-item-quantity number-input">
                <button onclick="this.parentNode.querySelector('input[type=number]').stepDown()" class="minus"></button>
                <input class="quantity" min="1" name="quantity" value="1" type="number">
                <button onclick="this.parentNode.querySelector('input[type=number]').stepUp()" class="plus"></button>
            </div>
        </div>
        <i class="fa-solid fa-trash cart-delete"></i>
    `;
    cartItem.dataset.id = product.id;
    cartItems.appendChild(cartItem);
    updateTotal();
}
/* */

/* delete products from cart */
cart.addEventListener("click", (event) => {
  if (event.target.classList.contains("cart-delete")) {
    var productDeletedId = event.target.parentElement.dataset.id;
    localStorage.removeItem(productDeletedId);
    event.target.parentElement.remove();
    updateTotal();
    popup("you delete a product from your cart","fa-trash");
  }
});
/* */

/* distingush color & size prefered & initialize it in dataset */
var sizes;
var colors;

function productColorsSizes() {
    sizes = document.querySelectorAll(".productItem .productSizes span");
    colors = document.querySelectorAll(".productItem .colorsAvailable span");
    
    sizes.forEach((size) => {
        size.addEventListener("click", (e) => {
            sizes.forEach((size) => {
                size.classList.remove("choosedSize");
            });
            size.classList.add("choosedSize");
            size.parentElement.parentElement.querySelector(".fa-plus").dataset.size = size.innerText;
        });
    });

    colors.forEach((color) => {
        color.addEventListener("click", (e) => {
            colors.forEach((color) => {
                color.classList.remove("choosedColor");
            });
            color.classList.add("choosedColor");
            color.parentElement.parentElement.querySelector(".fa-plus").dataset.color = color.style.backgroundColor;
        });
    })
}

productColorsSizes();
/* */
/* popup */
function popup(popupMessage, icon) {
    var popupElm = document.querySelector(".popup");
    if(popupElm.style.animationName == "popup"){
        let clonedPopup = popupElm.cloneNode(true);
        popupElm.insertAdjacentElement("afterend", clonedPopup);
        clonedPopup.querySelector("span").innerHTML = `${popupMessage}`;
        clonedPopup.querySelector("i").classList.add(`${icon}`);
        clonedPopup.style.animationName = "popup";
        setTimeout(function(){
            clonedPopup.style.animationName = "none";
            clonedPopup.querySelector("span").innerHTML = "";
            clonedPopup.remove();
        }, 4000);
        return;
    }

    popupElm.querySelector("span").innerHTML = `${popupMessage}`;
    popupElm.querySelector("i").classList.add(`${icon}`);
    popupElm.style.animationName = "popup";
    setTimeout(function(){
        popupElm.style.animationName = "none";
        popupElm.querySelector("span").innerHTML = "";
    }, 4000);
}
/* toggle dark mode */
const darkMode = document.querySelector(".dl-switcher input");
const body = document.querySelector("body");
// check cookie if dark mode is on
if(document.cookie.includes("mode=dark")){
    darkMode.click();
    body.style.setProperty("--white-color","black");
    body.style.setProperty("--black-color","white");
}

darkMode.addEventListener("click",function(){
    if(body.style.getPropertyValue("--white-color") == "black"){
        document.cookie = "mode=light; max-age=1296000; path=/;"; // after 15 day
        body.style.setProperty("--white-color","white");
        body.style.setProperty("--black-color","black");
    }else{
        document.cookie = "mode=dark; max-age=1296000; path=/;"; // after 15 day
        body.style.setProperty("--white-color","black");
        body.style.setProperty("--black-color","white");

   }
})
let currentImageIndex = 0; // Track the current image index
let images = []; // Array to hold image URLs
let imgUrl = "";
function openLargePreviewEye(element) {
  const preview = document.getElementById("largePreview");
  const previewImage = document.getElementById("largePreviewImage");
  const imgElements = element.querySelectorAll("img");
  imgUrl = element.parentElement.querySelector("h4 a").href;

  // Populate images array with src of images
  images = Array.from(imgElements).map((img) => img.src);

  // Set the first image in the preview
  currentImageIndex = 0;
  previewImage.src = images[currentImageIndex];
  preview.style.display = "block";
  resetZoom(); // Reset zoom when opening
}

function nextImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length; // Cycle to next image
  updatePreviewImage();
}

function prevImage() {
  currentImageIndex = (currentImageIndex - 1 + images.length) % images.length; // Cycle to previous image
  updatePreviewImage();
}

function updatePreviewImage() {
  const previewImage = document.getElementById("largePreviewImage");
  previewImage.src = images[currentImageIndex]; // Update the image src
}

// Close modal and other functions remain the same...

/* large Preview */
let zoomLevel = 1; // Initial zoom level
let isFullScreen = false; // Track full-screen state

function closeLargePreview() {
  document.getElementById("largePreview").style.display = "none";
}

function zoomIn() {
  zoomLevel += 0.2; // Increase zoom level
  applyZoom();
}

function zoomOut() {
  if (zoomLevel > 1) {
    // Prevent zooming out beyond original size
    zoomLevel -= 0.2;
    applyZoom();
  }
}

function applyZoom() {
  const img = document.getElementById("largePreviewImage");
  img.style.transform = `scale(${zoomLevel})`; // Apply current zoom level
}

function resetZoom() {
  zoomLevel = 1; // Reset zoom level
  applyZoom();
}

function shareImage() {
  navigator.clipboard.writeText(imgUrl).then(() => {
    popup("Image URL copied to clipboard!", "fa-check");
  });
}

function toggleFullScreen() {
  const preview = document.getElementById("largePreview");
  if (!isFullScreen) {
    if (preview.requestFullscreen) {
      preview.requestFullscreen();
    } else if (preview.mozRequestFullScreen) {
      preview.mozRequestFullScreen();
    } else if (preview.webkitRequestFullscreen) {
      preview.webkitRequestFullscreen();
    } else if (preview.msRequestFullscreen) {
      preview.msRequestFullscreen();
    }
    isFullScreen = true;
    document.getElementById("fullscreen-icon").classList.remove("fa-expand");
    document.getElementById("fullscreen-icon").classList.add("fa-compress"); // Change icon to compress
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
    isFullScreen = false;
    document.getElementById("fullscreen-icon").classList.remove("fa-compress");
    document.getElementById("fullscreen-icon").classList.add("fa-expand"); // Change icon to expand
  }
}

/* skeleton lazy loding product items */
let elements;
window.addEventListener("load", lazyLoad);
function lazyLoad() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          if (Array.from(entry.target.classList).includes("productImg")) {
            entry.target.querySelectorAll("img").forEach((img) => {
              img.style.visibility = "visible";
            })
          } else {
            entry.target.style.animation = "none";
          }
        }, 500);
      }
    });
  });

  elements = document.querySelectorAll(
    ".productSizes span, .colorsAvailable span, .productItem a, .productPrice, .productImg i, .productImg, .discount, .productImg"
  );

  elements.forEach(
    (element) => {
      observer.observe(element);
    },
    {
      rootMargin: "0px 0px 200px 0px", // Trigger the observer before the element fully enters the viewport
      threshold: 0, // Trigger when even a small portion of the element is visible
    }
  );
}
lazyLoad();

document.querySelector('.rltvInpt i').addEventListener('click', function() {
    const email = document.querySelector('.footerInput').value;

    if (!email) {
        popup('Please enter an email address.', 'fa-triangle-exclamation');
        return;
    }

    fetch('/models/addEmail.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ email: email }),
    })
    .then(response => response.json())
    .then(data => {
        popup(data.message, data.status === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation');
        if (data.status === 'success') {
            document.querySelector('.footerInput').value = '';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        popup("An error occurred. Please try again.", "fa-triangle-exclamation");
    });
});
/* slider in hero section */
var radios = Array.from(document.querySelectorAll(".mnl-btn"));
radios.forEach(element => {
    element.addEventListener("click",function() {
        radios.forEach(element => {
            element.style.backgroundColor = "transparent";
            element.style.width = "1px";
        });
        element.style.backgroundColor = "white";
        element.style.width = "40px";
    });
});

var counter = 2;    
document.querySelector("#radio1").addEventListener("click",function(e){
    counter = 2;
    document.querySelector(".first").style.marginLeft = "0";
});
document.querySelector("#radio2").addEventListener("click",function(e){
    counter = 3;
    document.querySelector(".first").style.marginLeft = "-25%";
});
document.querySelector("#radio3").addEventListener("click",function(e){
    counter = 4;
    document.querySelector(".first").style.marginLeft = "-50%";
});
document.querySelector("#radio4").addEventListener("click",function(e){
    counter = 1;
    document.querySelector(".first").style.marginLeft = "-75%";
});

setInterval(function(){
    document.querySelector("#radio" + counter).click();
    if(counter == 5){
        counter = 1;
    }
},7000);
/* */
/* lazy loading for video */
document.addEventListener("DOMContentLoaded", function() {
    let lazyVideos = [...document.querySelectorAll("video.lazy")]
   
    if ("IntersectionObserver" in window) {
        let lazyVideoObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(video) {
            if (video.isIntersecting) {
                for (let source in video.target.children) {
                    let videoSource = video.target.children[source];
                    if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
                        videoSource.src = videoSource.dataset.src;
                    }
                }
                video.target.load();
                video.target.classList.remove("lazy");
                lazyVideoObserver.unobserve(video.target);
            }
            });
        });

        lazyVideos.forEach(function(lazyVideo) {
            lazyVideoObserver.observe(lazyVideo);
        });
    }
});

/* horizontall slider of cllection */
const collectionBox = document.querySelector(".collection .container");
const collectionBtns = document.querySelectorAll(".collection button");
const maxScrollLeft = collectionBox.scrollWidth - collectionBox.clientWidth;

collectionBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const direction = btn.className == "right" ? 1 : -1;
        const scrollAmount = collectionBox.clientWidth * direction;
        collectionBox.scrollBy({left: scrollAmount, behavior: "smooth"});
    });
})
collectionBox.addEventListener("scroll", (e) => {
    collectionBtns[0].style.backgroundColor = collectionBox.scrollLeft <= 0 ? "grey" : "var(--black-color)";
    collectionBtns[1].style.backgroundColor = collectionBox.scrollLeft >= maxScrollLeft ? "grey" : "var(--black-color)";
})