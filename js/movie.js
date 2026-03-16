'use strict'

let host = 'localhost';
let port = '5047';

async function getMovie() {
    const response = await fetch(`http://${host}:${port}/api/movies/${getUrlParameter('id')}`, {
        method: "GET",
        headers: {
        'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include'
    });

    if (response.ok) {
        let body = await response.json();
        document.querySelector('.top_section__title').innerHTML = body.title;
        document.querySelector('.top_section__genres').innerHTML = '';
        body.genres.forEach(genre => {
            document.querySelector('.top_section__genres').insertAdjacentHTML('beforeend', `<p class="top_section__genre">${genre}</p>`);
        });
        document.querySelector('.top_section__text').innerHTML = body.description;
        document.querySelector('.description__text').innerHTML = body.plot;
        document.querySelector('.top_section__img').src = body.poster;
        document.querySelector('.actors_section__list').innerHTML = '';
        body.actors.forEach(actor => {
            document.querySelector('.actors_section__list').insertAdjacentHTML('beforeend', `<li class="list__item">${actor}</li>`);
        });
        document.getElementById('country').innerHTML = body.country;
        document.getElementById('rating').innerHTML = body.rating;
        document.getElementById('company').innerHTML = body.company;
        document.getElementById('duration').innerHTML = `${body.duration} минут`;
    }
    else{
        alert('Ошибка получения фильма');
    }
    checkAuth();
}

function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

document.querySelector('.profile').onclick = function(e){
    window.location.href = 'profile.html';
}

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
        checkFav();
    }
    else{
        document.querySelector('.top_section__btn').style.display = 'none';
    }
}

async function checkFav(){
    const response = await fetch(`http://${host}:${port}/api/movies/favorites/${getUrlParameter('id')}`, {
        method: "GET",
        headers: {
        'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include'
    });
    if(response.ok){
        let result = await response.text();
        if(result == 'no'){
            document.querySelector('.top_section__btn').onclick = setFav;
        }
        else{
            document.querySelector('.top_section__btn').style.backgroundColor = result;
            document.querySelector('.top_section__btn').style.color = '#000';
            document.querySelector('.top_section__btn').innerHTML = 'Добавлено в избранное';
        }
    }
    else{
        document.querySelector('.top_section__btn').style.display = 'none';
    }
}

async function setFav() {
    const response = await fetch(`http://${host}:${port}/api/movies/favorites`, {
        method: "POST",
        headers: {
        'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({movieId: parseInt(getUrlParameter('id'))}),
        credentials: 'include'
    });
    if(response.ok){
        let result = await response.text();
        document.querySelector('.top_section__btn').style.backgroundColor = result;
        document.querySelector('.top_section__btn').style.color = '#000';
        document.querySelector('.top_section__btn').innerHTML = 'Добавлено в избранное';
        document.querySelector('.top_section__btn').onclick = null;
    }
    else{
        alert('Ошибка добавления в избранное')
    }
}

getMovie();