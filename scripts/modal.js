function modalBox(heading,details) {
    document.querySelector(".modalBox h3").innerHTML = `${heading}`;
    document.querySelector(".modalBox p").innerHTML = `${details}`;
    document.querySelector(".modalBox").style.animationName = "modalBox";
    setTimeout(function(){
        document.querySelector(".modalBox").style.animationName = "none";
    }, 5000);
}