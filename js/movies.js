'use strict'

let images = document.querySelectorAll('.movie__img');
images.forEach(img =>{
    img.onclick = displayImage;
});

function displayImage(elem){
    const overlay = document.createElement("div");
    overlay.classList.add("image-overlay");

    const img = document.createElement("img");
    img.src = elem.currentTarget.src;
    img.alt = elem.currentTarget.alt;

    overlay.appendChild(img);
    document.body.appendChild(overlay);

    overlay.onclick = function(e){
        overlay.remove();
    }
}