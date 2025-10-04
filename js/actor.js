'use strict'

document.querySelector('.back_btn').onclick = function(e){
    if (window.history.length > 1) window.history.back();
    else window.location.href = 'index.html';
}