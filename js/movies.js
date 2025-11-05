'use strict'

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

// --- Инициализация ---
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.searchline__input');
    const searchButton = document.querySelector('.searchline__btn');
    const yearSelect = document.getElementById('years');
    const countrySelect = document.getElementById('country');
    const genreSelect = document.getElementById('genre');
    const ratingSelect = document.getElementById('rating');
    const newnessSelect = document.getElementById('newness');
    const movieContainer = document.querySelector('.movie_section__movies');
    const paginationContainer = document.querySelector('.movie_section__pages');

    // --- Исходные данные фильмов ---
    const movies = [
        {
            title: 'Дюна: часть вторая',
            genres: ['Фантастика', 'Боевик', 'Драма', 'Приключения'],
            year: 2024,
            country: 'США',
            rating: 8.2,
            img: 'img/dune.webp',
            link: 'movie.html'
        },
        {
            title: '1+1',
            genres: ['Драма', 'Комедия'],
            year: 2011,
            country: 'Франция',
            rating: 9.0,
            img: 'img/1+1.jpg',
            link: 'no_page.html'
        },
        {
            title: 'Леон',
            genres: ['Триллер', 'Драма', 'Криминал'],
            year: 1994,
            country: 'Франция',
            rating: 9.2,
            img: 'img/leon.jpg',
            link: 'no_page.html'
        },
        {
            title: 'Белорусский вокзал',
            genres: ['Драма'],
            year: 1971,
            country: 'СССР',
            rating: 9.0,
            img: 'img/vokzal.jpg',
            link: 'no_page.html'
        },
        // Пример для демонстрации пагинации
        { title: 'Матрица', genres: ['Фантастика', 'Боевик'], year: 1999, country: 'США', rating: 8.7, img: 'img/Matrix-DVD.jpg', link: 'no_page.html' },
        { title: 'Интерстеллар', genres: ['Фантастика', 'Драма'], year: 2014, country: 'США', rating: 8.6, img: 'img/Interstellar_2014.jpg', link: 'no_page.html' },
        { title: 'Форрест Гамп', genres: ['Драма', 'Комедия'], year: 1994, country: 'США', rating: 9.5, img: 'img/forest.webp', link: 'no_page.html' },
        { title: 'Начало', genres: ['Фантастика', 'Триллер'], year: 2010, country: 'США', rating: 8.9, img: 'img/nachalo.webp', link: 'no_page.html' },
        { title: 'Таксист', genres: ['Драма', 'Криминал'], year: 1976, country: 'США', rating: 8.4, img: 'img/taxi_driver.jpg', link: 'no_page.html' },
        { title: 'Брат', genres: ['Драма', 'Криминал'], year: 1997, country: 'Россия', rating: 8.3, img: 'img/brother.webp', link: 'no_page.html' },
        { title: 'Брат 2', genres: ['Драма', 'Криминал'], year: 2000, country: 'Россия', rating: 8.2, img: 'img/Brat2.jpg', link: 'no_page.html' },
    ];

    // --- Настройки пагинации ---
    const MOVIES_PER_PAGE = 4;
    let currentPage = 1;

    // --- Основные функции ---
    function filterMovies() {
        const searchText = searchInput.value.toLowerCase();
        const selectedYear = yearSelect.value;
        const selectedCountry = countrySelect.value;
        const selectedGenre = genreSelect.value;

        return movies.filter(movie => {
            const matchesSearch = movie.title.toLowerCase().includes(searchText);
            const matchesYear = selectedYear
                ? Math.floor(movie.year / 10) * 10 === +selectedYear
                : true;
            const matchesCountry = selectedCountry ? movie.country === selectedCountry : true;
            const matchesGenre = selectedGenre ? movie.genres.includes(selectedGenre) : true;
            return matchesSearch && matchesYear && matchesCountry && matchesGenre;
        });
    }

    function sortMovies(filtered) {
        const ratingSort = ratingSelect.value;
        const newnessSort = newnessSelect.value;

        if (ratingSort) {
            filtered.sort((a, b) =>
                ratingSort === 'ascending' ? a.rating - b.rating : b.rating - a.rating
            );
        }

        if (newnessSort) {
            filtered.sort((a, b) =>
                newnessSort === 'ascending' ? b.year - a.year : a.year - b.year
            );
        }

        return filtered;
    }

    function renderMovies(filtered) {
        movieContainer.innerHTML = '';
        const start = (currentPage - 1) * MOVIES_PER_PAGE;
        const end = start + MOVIES_PER_PAGE;
        const moviesToShow = filtered.slice(start, end);

        if (moviesToShow.length === 0) {
            movieContainer.innerHTML = '<p>Фильмы не найдены.</p>';
            return;
        }

        moviesToShow.forEach(movie => {
            const div = document.createElement('div');
            div.classList.add('movie_section__movie');
            div.innerHTML = `
                <img src="${movie.img}" alt="Постер" class="movie__img"/>
                <div class="movie__description">
                    <h2 class="movie__title"><a href="${movie.link}">${movie.title}</a></h2>
                    <p class="movie__genres">${movie.genres.join(', ')}</p>
                    <div class="movie__rating">
                        <img src="img/star.png" alt="Рейтинг" class="rating__img" />
                        <p class="rating__number">${movie.rating}</p>
                    </div>
                </div>
            `;
            movieContainer.appendChild(div);
        });
    }

     // --- обновленная функция пагинации ---
    function renderPagination(totalMovies) {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(totalMovies / MOVIES_PER_PAGE);
        if (totalPages <= 1) return;

        const prev = document.createElement('span');
        prev.textContent = '<';
        prev.classList.add('pages__page');
        if (currentPage === 1) prev.classList.add('disabled');
        prev.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updateMovies();
            }
        });
        paginationContainer.appendChild(prev);

        const maxVisible = 2; // сколько страниц по бокам от текущей

        for (let i = 1; i <= totalPages; i++) {
            // показываем всегда первую, последнюю, текущую и соседние
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - maxVisible && i <= currentPage + maxVisible)
            ) {
                const page = document.createElement('span');
                page.textContent = i;
                page.classList.add('pages__page');
                if (i === currentPage) page.classList.add('active');
                page.addEventListener('click', () => {
                    currentPage = i;
                    updateMovies();
                });
                paginationContainer.appendChild(page);
            } else if (
                i === currentPage - maxVisible - 1 ||
                i === currentPage + maxVisible + 1
            ) {
                // вставляем троеточие
                const ellipsis = document.createElement('span');
                ellipsis.textContent = '...';
                ellipsis.classList.add('ellipsis');
                paginationContainer.appendChild(ellipsis);
            }
        }

        const next = document.createElement('span');
        next.textContent = '>';
        next.classList.add('pages__page');
        if (currentPage === totalPages) next.classList.add('disabled');
        next.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                updateMovies();
            }
        });
        paginationContainer.appendChild(next);
    }

    // --- Обновление интерфейса ---
    function updateMovies() {
        const filtered = sortMovies(filterMovies());
        renderMovies(filtered);
        renderPagination(filtered.length);
        let images = document.querySelectorAll('.movie__img');
        images.forEach(img =>{
            img.onclick = displayImage;
        });
    }

    // --- События ---
    searchButton.addEventListener('click', () => {
        currentPage = 1;
        updateMovies();
    });

    [yearSelect, countrySelect, genreSelect, ratingSelect, newnessSelect].forEach(select => {
        select.addEventListener('change', () => {
            currentPage = 1;
            updateMovies();
        });
    });

    searchInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            currentPage = 1;
            updateMovies();
        }
    });

    // --- Сброс одной сортировки при выборе другой ---
    ratingSelect.addEventListener('change', () => {
        if (ratingSelect.value) {
            newnessSelect.value = ''; // сбрасываем сортировку по новизне
        }
        currentPage = 1;
        updateMovies();
    });

    newnessSelect.addEventListener('change', () => {
        if (newnessSelect.value) {
            ratingSelect.value = ''; // сбрасываем сортировку по рейтингу
        }
        currentPage = 1;
        updateMovies();
    });

    // --- Первый рендер ---
    updateMovies();
});
