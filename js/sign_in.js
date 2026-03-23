'use strict'

let port = 5047;

document.querySelector('.eye').addEventListener('click', function() {
    const password = document.getElementById('password');
    password.type = password.type === 'password' ? 'text' : 'password';
});

document.querySelector('.form__btn').onclick = async function(e){
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let body = {
        'email': email,
        'password': password
    }

    const response = await fetch(`http://155.212.145.130:${port}/api/movies/login`, {
        method: "POST",
        headers: {
        'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(body),
        credentials: 'include'
    });

    if (response.ok) {
        window.location.href = '/index';
    }
    else{
        document.querySelector('.error').innerHTML = await response.text();
        document.querySelector('.error').style.display = 'block';
    }
}