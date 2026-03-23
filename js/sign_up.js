'use strict'

let port = 5047;

document.getElementById('eye1').addEventListener('click', function() {
    const password = document.getElementById('first_password');
    password.type = password.type === 'password' ? 'text' : 'password';
});

document.getElementById('eye2').addEventListener('click', function() {
    const password = document.getElementById('second_password');
    password.type = password.type === 'password' ? 'text' : 'password';
});

document.querySelector('.form__btn').onclick = async function(e){
    let email = document.getElementById('email').value;
    let firstPassword = document.getElementById('first_password').value;
    let secondPassword = document.getElementById('second_password').value;
    let name = document.getElementById('name').value;

    if(firstPassword !== secondPassword){
        document.querySelector('.error').innerHTML = 'Пароли не совпадают';
        document.querySelector('.error').style.display = 'block';
        return;
    }

    let body = {
        'name': name,
        'email': email,
        'password': password
    }

    const response = await fetch(`http://155.212.145.130:${port}/api/movies/register`, {
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