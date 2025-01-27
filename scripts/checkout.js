/* bank selection */
let banks = document.querySelectorAll(".bank");
banks.forEach((bank) => {
    bank.addEventListener("click", (e) => {
        banks.forEach((bank) => {
            bank.classList.remove("choosed");
        });
        bank.classList.add("choosed");
        document.querySelector("#nCompte").innerHTML = bank.dataset.n;
        document.querySelector("#bankName").setAttribute("value", bank.dataset.bank);
    });
})
/* copy bank infos */
let copyButtons = document.querySelectorAll(".bankInfos .fa-copy");
copyButtons.forEach((copyButton) => {
    copyButton.addEventListener("click", async (e) => {
        try {
            await navigator.clipboard.writeText(e.target.previousElementSibling.innerText);
            popup("copied successfully", "fa-check");
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    });
});
/* end of bank */

/* image uplaod */
const fileTypes = [
    "image/apng",
    "image/bmp",
    "image/gif",
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "image/svg+xml",
    "image/tiff",
    "image/webp",
    "image/x-icon",
    "image/avif",
];
function validFileType(file) {
    return fileTypes.includes(file.type);
}

let inputHidden = document.querySelector("#screenshoot");
let triggerInput = document.querySelector(".selectImage");
let imgArea = document.querySelector(".imgArea");

triggerInput.addEventListener("click",function(){
    inputHidden.click();
})

let screenshootFlag = false;
inputHidden.addEventListener("change",function(e){
    let image = e.target.files[0];
    if(!validFileType(image)){
        popup("invalid file type","fa-triangle-exclamation");
        return;
    }
    if(image.size > 2097152){
        popup("image size must be less than 2MB","fa-triangle-exclamation");
        return;
    }else{
        const reader = new FileReader();
        reader.addEventListener("load",function(){
            const allImgs = document.querySelectorAll(".imgArea img");
            allImgs.forEach((img) => {
                img.remove();
            })
            const imgUrl = reader.result;
            const img = document.createElement("img");
            img.src = imgUrl;
            imgArea.appendChild(img);
            imgArea.classList.add("active");
            imgArea.dataset.title = image.name;
            popup("image uploaded successfully","fa-check");
            screenshootFlag = true;
        })
        reader.readAsDataURL(image);
    }
})


/* tabs */
let firstTab = document.querySelector(".personalInfos");
let form = document.querySelector(".myForm");

/* form validation */
let fullName = document.getElementById('fullName');
let phoneNumber = document.getElementById('phoneNumber');
let weight = document.getElementById('weight');
let height = document.getElementById('height');

function validateWeight(){
    weight.value = weight.value.replace(/[^0-9.]/g, '');
    var wght = parseFloat(weight.value);
    if (wght < 20 || wght > 150) {
        weight.value = '';
        popup("invalid weight value","fa-triangle-exclamation");
    }
}
function validateHeight(){
    height.value = height.value.replace(/[^0-9.]/g, '');
    var hght = parseFloat(height.value);
    if (hght < 100 || hght > 250) {
        height.value = '';
        popup("invalid height value","fa-triangle-exclamation");
    }
}
function validatePhoneNumber(){
    phoneNumber.value = phoneNumber.value.replace(/[^0-9]/g, '');
    if (phoneNumber.value.length > 10) {
        phoneNumber.value = phoneNumber.value.substring(0, 10);
    }
}
function validateFullName(){
    fullName.value = fullName.value.replace(/[^a-zA-Z\s]/g, '');
}

form.addEventListener("submit",function(e){
    e.preventDefault();

    validateFullName();
    validatePhoneNumber();
    validateWeight();
    validateHeight();

    if (!localStorage.length){
        popup("your cart is empty","fa-triangle-exclamation");
        return;
    }

    let emptyInputFlag = false;
    let checkedInputFlag = false;
    let inputs = document.querySelectorAll(".myForm input:not(.submit,#screenshoot)");
    inputs.forEach((input) => {
        if(input.getAttribute("type") == "checkbox" && !input.checked){
            popup("please agree all","fa-triangle-exclamation");
            checkedInputFlag = true;
            return;
        }
        if(input.value == ""){
            popup("please fill all fields","fa-triangle-exclamation");
            emptyInputFlag = true;
            return;
        }
    })
    
    if (emptyInputFlag == true) {return;}
    const validateEmail = (email) => {
        return email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
      };

    if (!validateEmail(form.email.value)) {
        popup('email is invalid!', 'fa-triangle-exclamation');
        return
    }

    if(screenshootFlag == false){
        popup("please upload screenshoot","fa-triangle-exclamation");
        return;
    }
    if (checkedInputFlag == true) {return;}

    // after ajax request run modal
    var productsIds = [];

    // Loop through all keys in localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const productData = localStorage.getItem(key);

        // Check if the data is valid JSON
        try {
            const productDetails = JSON.parse(productData);
            productsIds.push({
                id: productDetails.id,
                size: productDetails.size,
                color: productDetails.color,
                quantity: productDetails.quantity
            });
        } catch (e) {
            console.error(`Error parsing product data for key "${key}":`, e);
        }
    }
    //


    const formData = new FormData();
    formData.append('fullName', document.getElementById('fullName').value);
    formData.append('instructions', document.getElementById('instrct').value);
    formData.append('phone', document.getElementById('phoneNumber').value);
    formData.append('city', document.getElementById('city').value);
    formData.append('height', document.getElementById('height').value);
    formData.append('weight', document.getElementById('weight').value);
    formData.append('address', document.getElementById('address').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('bank', document.getElementById('bankName').value);
    formData.append('productsIds', JSON.stringify(productsIds)); // Sending the array of product IDs
    formData.append('proofImg', document.getElementById('screenshoot').files[0]);

    fetch('/models/submitOrder.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        if (data.success) {
            modalBox("Order placed successfully", "We will verify your order as soon as possible and ship it to you");
            localStorage.clear();
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        } else {
            popup("Order failed" + data.errors ? data.errors.join(", ") : "An unknown error occurred.", "fa-triangle-exclamation");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        popup("Error, There was a problem processing your order.", "fa-triangle-exclamation");
    });
    
})