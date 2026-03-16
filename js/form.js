'use strict'

// Кнопка отправки формы
let btn = document.getElementById('btn');
// Название фильма
let title = document.getElementById('title');
// Описание фильма
let desc = document.getElementById('desc');
// Сюжет фильма
let plot = document.getElementById('plot');
// Ссылка на постер
let link = document.getElementById('link');
// Страна выпуска
let country = document.getElementById('country');
// Длительность фильма
let duration = document.getElementById('duration');
// Кинокомпания
let company = document.getElementById('company');
// Рейтинг фильма
let rating = document.getElementById('rating');
// Год выпуска
let year = document.getElementById('year');
// Массив ошибок
let errors = [];
// Актёры
let actors = [];
const selectedActorIds = new Set();

let port = 5047;
let host = 'localhost';

const input = document.getElementById("actorInput");
const suggestions = document.getElementById("actorSuggestions");
const selectedActors = document.getElementById("selectedActors");

btn.onclick = async function(e){
    // Проверка присутствия названия фильма
    if(title.value.trim() == '') errors.push("Название фильма не может быть пустым");
    // Проверка количества символов в описании фильма
    if(desc.value.length < 10) errors.push("Описание фильма должно содержать не менее 100 символов");
    // Проверка количества символов в сюжете фильма
    if(plot.value.length < 20) errors.push("Сюжет фильма должен содержать не менее 200 символов");
    // Проверка корректности ссылки
    const pattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
    if(!pattern.test(link.value)) errors.push("Неправильная сслыка на постер");
    // Проверка количества выбранных жанров
    let numberOfGenres = 0;
    document.querySelectorAll('.checkbox').forEach(genre => {if(genre.checked) numberOfGenres++;});
    if(numberOfGenres == 0 || numberOfGenres > 5) errors.push("Количество жанров фильма должно быть от 1 до 5");
    // Проверка выбранных актёров
    if(selectedActorIds.length == 0) errors.push("Выберите актёров фильма");
    // Проверка страны выпуска
    if(country.value == '') errors.push("Выберите страну выпуска");
    // Проверка ввода продолжительности фильма
    if(duration.value != '' && !isNaN(duration.value)){
        let durationValue = Number(duration.value);
        if(!Number.isInteger(durationValue)) errors.push("Продолжительность фильма должна быть целым числом");
        if(durationValue < 1 || durationValue > 2880) errors.push("Продолжительность фильма должна быть от 1 до 2880 минут");
    }
    else errors.push("Продолжительность фильма должна быть числом");
    // Проверка ввода кинокомпании
    if(company.value == '') errors.push("Выберите кинокомпанию");
    // Проверка ввода рейтинга
    if(rating.value != '' && !isNaN(rating.value)){
        let ratingValue = Number(rating.value);
        if(ratingValue < 1 || ratingValue > 10) errors.push("Рейтинг должен быть от 1 до 10");
    }
    else errors.push("Рейтинг должен быть числом");
    if(year.value != '' && !isNaN(year.value)){
        let yearValue = Number(year.value);
        if(yearValue < 1888 || yearValue > 2026) errors.push("Год выпуска должен быть от 1888 до 2000");
    }
    else errors.push("Год выпуска должен быть числом");

    // Вывод всех ошибок
    if(errors.length > 0) {
        const numberedErrors = errors.map((error, index) => `${index + 1}. ${error}`);
        const errorMessage = "Для отправки формы исправьте следующие ошибки:\n" + numberedErrors.join('\n');
        alert(errorMessage);
    }

    const genreIds = [...document.querySelectorAll(".genre__container input:checked")]
        .map(g => Number(g.dataset.id));


    const actorIds = [...document.querySelectorAll("#selectedActors .actors__actor")]
        .map(a => Number(a.dataset.id));

    const movie = {
        title: title.value,
        duration: duration.value,
        rating: rating.value,
        year: year.value,
        poster: link.value,
        description: desc.value,
        plot: plot.value,
        countryId: country.options[country.selectedIndex].dataset.id,
        companyId: company.options[company.selectedIndex].dataset.id,
        genreIds: genreIds,
        actorIds: actorIds
    };

    let response = await fetch(`http://${host}:${port}/api/movies`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(movie)
    })
    if (!response.ok) {
        let error = await response.text();
        document.querySelector('.error').innerHTML = error;
        document.querySelector('.error').style.display = 'block';
    }
    else {
        clearForm();
        document.querySelector('.error').innerHTML = '';
        document.querySelector('.error').style.display = 'none';
    }
}

function clearForm(){
    title.value = '';
    desc.value = '';
    plot.value = '';
    link.value = '';
    year.value = '';
    duration.value = '';
    rating.value = '';
    selectedActorIds.clear();
    selectedActors.innerHTML = '';
    country.selectedIndex = 0;
    company.selectedIndex = 0;
    document.querySelectorAll('.checkbox').forEach(genre => {genre.checked = false;});
}

document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".genre__container");

    fetch(`http://${host}:${port}/api/movies/genres`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка загрузки жанров");
            }
            return response.json();
        })
        .then(genres => {
            genres.forEach(genre => {
                let str = `<label class="checkbox_label"><input type="checkbox" name="genre" class="checkbox" value="${genre.title}" data-id="${genre.genreId}"/>${genre.title}</label>`;
                container.insertAdjacentHTML('beforeend', str);
            });
        })
        .catch(error => {
            document.querySelector('.error').innerHTML = error;
            document.querySelector('.error').style.display = 'block';
        });
});

document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById("country");

    fetch(`http://${host}:${port}/api/movies/countries`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка загрузки стран");
            }
            return response.json();
        })
        .then(countries => {
            countries.forEach(country => {
                const option = document.createElement("option");

                option.value = country.title;
                option.dataset.id = country.countryId;
                option.textContent = country.title;

                select.appendChild(option);
            });
        })
        .catch(error => {
            document.querySelector('.error').innerHTML = error;
            document.querySelector('.error').style.display = 'block';
        });
});

document.addEventListener("DOMContentLoaded", function () {
    const select = document.getElementById("company");

    fetch(`http://${host}:${port}/api/movies/companies`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка загрузки кинокомпаний");
            }
            return response.json();
        })
        .then(companies => {
            companies.forEach(company => {
                const option = document.createElement("option");

                option.value = company.title;
                option.dataset.id = company.companyId;
                option.textContent = company.title;

                select.appendChild(option);
            });
        })
        .catch(error => {
            document.querySelector('.error').innerHTML = error;
            document.querySelector('.error').style.display = 'block';
        });
});

document.addEventListener("DOMContentLoaded", function () {

    fetch(`http://${host}:${port}/api/movies/actors`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка загрузки актеров");
            }
            return response.json();
        })
        .then(data => {
            actors = data;
        })
        .catch(error => {
            document.querySelector('.error').innerHTML = error;
            document.querySelector('.error').style.display = 'block';
        });
});

input.addEventListener("input", () => {

    const value = input.value.toLowerCase().trim();
    suggestions.innerHTML = "";

    if (!value) return;

    const matches = actors.filter(a =>
        a.name.toLowerCase().includes(value) &&
        !selectedActorIds.has(a.actorId)
    );

    matches.slice(0, 5).forEach(actor => {

        const item = document.createElement("div");
        item.textContent = actor.name;
        item.className = "actors__suggestion";

        item.onclick = () => addActor(actor);

        suggestions.appendChild(item);

    });

});


function addActor(actor) {

    selectedActorIds.add(actor.actorId);

    const span = document.createElement("span");
    span.className = "actors__actor";
    span.dataset.id = actor.actorId;
    span.textContent = actor.name;

    span.onclick = () => {
        span.remove();
        selectedActorIds.delete(actor.actorId);
    };

    selectedActors.appendChild(span);

    input.value = "";
    suggestions.innerHTML = "";
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
    }
    else{
        document.querySelector('.top_section__btn').style.display = 'none';
    }
}

checkAuth();

document.querySelector('.profile').onclick = function(e){
    window.location.href = 'profile.html';
}
