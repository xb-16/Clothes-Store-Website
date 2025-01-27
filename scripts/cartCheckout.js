const cart = document.querySelector(".cartItems");

/* first filling cart */
let cartItems = document.querySelector(".cartItems");
if(localStorage.length == 0){
   cartItems.innerHTML = `<span class="emptyCart" style="color:grey;display:block;text-align:center;padding:60px;">Your cart is empty</span>`;
}
for (let i = 0; i < localStorage.length; i++) {
    let productStored = JSON.parse(localStorage.getItem(localStorage.key(i)));
    let cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
        <div class="cart-item-img">
            <img loading="lazy" src="${productStored.img}" alt="">        </div>
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


/* update total price */
function updateTotal() {
    let cartItems = document.querySelectorAll(".cart-item");
    let total = 0;
    for (let i = 0; i < cartItems.length; i++){
        var productDetails = {
            id: cartItems[i].dataset.id,
            url : cartItems[i].querySelector("h3 a").href,
            name: cartItems[i].querySelector("h3 a").innerText,
            img: cartItems[i].querySelector(".cart-item-img img").src,
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
    let subtotal = document.querySelector("#subtotal");
    let shipping = document.querySelector("#shipping");
    let totalElement = document.querySelector("#total");
    
    subtotal.innerText = total.toFixed(2) + " MAD";
    if(total > 599.00){
        shipping.innerText = "0.00 MAD";
        totalElement.innerText = (total + 0.00).toFixed(2) + " MAD";
    } else{
        shipping.innerText = "49.00 MAD";
        totalElement.innerText = (total + 49.00).toFixed(2) + " MAD";
    }
    
    if(localStorage.length == 0){
        cart.innerHTML = `<i class="fa-regular fa-cart-circle-xmark" style="color:black;display:block;text-align:center;font-size:60px;"></i><span class="emptyCart" style="display:block;text-align:center;padding:25px 0 60px;">Your cart is empty</span>`;
        shipping.innerText = "00.00 MAD";
        totalElement.innerText = total.toFixed(2) + " MAD";
        
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