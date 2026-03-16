'use strict'

function toggle(){
    document.querySelector('.profile_card__information').classList.toggle('hidden');
    document.querySelector('.profile_card__changes').classList.toggle('hidden');
}

document.querySelector('.profile_card__btn').onclick = toggle;
document.querySelector('.changes__cancel').onclick = toggle;

let host = 'localhost';
let port = '5047';

async function getClientData() {
     const response = await fetch(`http://${host}:${port}/api/movies/profile`, {
        method: "GET",
        headers: {
        'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include'
    });
    if(response.ok){
        let data = await response.json();
        document.querySelector('.header__registration').style.display = 'none';
        document.querySelector('.profile').style.display = 'block';
        document.getElementById('name').innerHTML = data.name;
        document.getElementById('email').innerHTML = data.email;
    }
    else{
        alert('Ошибка получения данных пользователя');
    }
}

getClientData();

async function getFav() {
     const response = await fetch(`http://${host}:${port}/api/movies/favorites`, {
        method: "GET",
        headers: {
        'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include'
    });
    if(response.ok){
        let data = await response.json();
        let container = document.querySelector('.movie_section__movies');
        container.innerHTML = '';
        data.forEach(movie => {
            let str =
            `
                <div class="movie_section__movie">
                    <img src="${movie.poster}" alt="Постер" class="movie__img"/>
                    <div class="movie__description">
                        <h2 class="movie__title"><a href="movie.html">${movie.title}</a></h2>
                        <p class="movie__genres">${movie.genres.join(', ')}</p>
                        <div class="movie__rating">
                            <img src="img/star.png" alt="Рейтинг" class="rating__img" />
                            <p class="rating__number">${movie.rating}</p>
                        </div>
                        <button class="movie__btn" data-id="${movie.movieId}">Убрать из избранного</button>
                    </div>
                </div>
            `
            container.insertAdjacentHTML('beforeend', str);
        });
        document.querySelectorAll('.movie__btn').forEach(btn => {
            btn.onclick = deleteFav;
        });
    }
    else{
        alert('Ошибка получения избранного');
    }
}

getFav();

async function deleteFav(e) {
    let movieId = e.currentTarget.dataset.id;
    const response = await fetch(`http://${host}:${port}/api/movies/favorites/${movieId}`, {
        method: "DELETE",
        headers: {
        'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include'
    });
    if(response.ok){
        getFav();
    }
    else{
        alert('Ошибка получения удаления из избранного');
    }
}