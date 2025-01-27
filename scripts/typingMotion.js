window.addEventListener('load', () => {
    document.querySelector("header h2").style.animationPlayState = 'running';
    setTimeout(() => {
       document.querySelector("header h2").style.borderRight = "none";
       document.querySelector("header h2").style.width = "fit-content";
    }, 7500);

})
