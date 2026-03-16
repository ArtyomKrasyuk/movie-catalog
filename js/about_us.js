'use strict'

let host = 'localhost';
let port = '5047';

async function checkAuth() {
    const response = await fetch(`http://${host}:${port}/api/movies/session`, {
        method: "GET",
        headers: {
        'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include'
    });
    if(response.ok){
        document.querySelector('.header__registration').style.display = 'none';
        document.querySelector('.profile').style.display = 'block';
    }
}

checkAuth();

document.querySelector('.profile').onclick = function(e){
    window.location.href = 'profile.html';
}