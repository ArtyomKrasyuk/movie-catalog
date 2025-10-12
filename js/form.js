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
// Жанры фильма
let genres = document.querySelectorAll('.checkbox');
// Страна выпуска
let country = document.getElementById('country');
// Длительность фильма
let duration = document.getElementById('duration');
// Кинокомпания
let company = document.getElementById('company');
// Рейтинг фильма
let rating = document.getElementById('rating');
// Массив ошибок
let errors = [];

btn.onclick = function(e){
    // Проверка присутствия названия фильма
    if(title.value.trim() == '') errors.push("Название фильма не может быть пустым");
    // Проверка количества символов в описании фильма
    if(desc.value.length < 100) errors.push("Описание фильма должно содержать не менее 100 символов");
    // Проверка количества символов в сюжете фильма
    if(plot.value.length < 200) errors.push("Сюжет фильма должен содержать не менее 200 символов");
    // Проверка корректности ссылки
    const pattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
    if(!pattern.test(link.value)) errors.push("Неправильная сслыка на постер");
    // Проверка количества выбранных жанров
    let numberOfGenres = 0;
    genres.forEach(genre => {if(genre.checked) numberOfGenres++;});
    if(numberOfGenres == 0 || numberOfGenres > 5) errors.push("Количество жанров фильма должно быть от 1 до 5");
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
    if(company.value.trim() == '') errors.push("Кинокомпания не должна быть пустой");
    if(!/^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(company.value)) errors.push("Название кинокомпании должно содержать только кириллические или латинские буквы");
    // Проверка ввода рейтинга
    if(rating.value != '' && !isNaN(rating.value)){
        let ratingValue = Number(rating.value);
        if(ratingValue < 1 || ratingValue > 10) errors.push("Рейтинг должен быть от 1 до 10");
    }
    else errors.push("Рейтинг должен быть числом");

    // Вывод всех ошибок
    if(errors.length > 0) {
        const numberedErrors = errors.map((error, index) => `${index + 1}. ${error}`);
        const errorMessage = "Для отправки формы исправьте следующие ошибки:\n" + numberedErrors.join('\n');
        alert(errorMessage);
    }
}