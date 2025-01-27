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