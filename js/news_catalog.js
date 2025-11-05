'use strict'

document.addEventListener('DOMContentLoaded', () => {
    const sortSelect = document.querySelector('.sort');
    const newsContainer = document.querySelector('.news_section');
    const paginationContainer = document.querySelector('.movie_section__pages');

    // --- Массив новостей ---
    const news = [
        {
            title: '10 вопросов звезде. Роман Маякин — о «Виноделах», любимых сериалах и лучших актерах',
            subtitle: 'Актёр Роман Маякин рассказал о своей новой работе и будущем российского кино.',
            img: 'img/news.jpg',
            link: 'news_page.html',
            date: '2025-09-28T18:32:00'
        },
        {
            title: 'Дочь Робина Уильямса пожаловалась на ролики с актером, созданные ИИ',
            subtitle: 'Зельда Уильямс призвала поклонников не присылать ролики, созданные искусственным интеллектом.',
            img: 'img/robin.jpg',
            link: 'no_page.html',
            date: '2025-10-07T15:22:00'
        },
        {
            title: 'Брендан Фрейзер и Рэйчел Вайс вновь снимутся вместе в перезапуске «Мумии»',
            subtitle: 'Культовая приключенческая франшиза «Мумия» готовится к возрождению. 56-летний Брендан Фрейзер и 55-летняя Рэйчел Вайс ведут переговоры о возвращении к своим ролям.',
            img: 'img/mummy.webp',
            link: 'no_page.html',
            date: '2025-10-12T10:15:00'
        },
        {
            title: 'Вуди Харрельсон исключил возвращение к роли в «Настоящем детективе»',
            subtitle: 'Американский актер Вуди Харрельсон исключил возможность возвращения к роли в сериале «Настоящий детектив» вместе с Мэттью Макконахи. Об этом он заявил в интервью передаче Today телекомпании NBC.',
            img: 'img/actor.jpg',
            link: 'no_page.html',
            date: '2025-10-02T11:05:00'
        }
    ];

    const NEWS_PER_PAGE = 3;
    let currentPage = 1;

    // --- Сортировка ---
    function sortNews(newsList) {
        const sortOrder = sortSelect.value;
        return newsList.sort((a, b) => {
            if (sortOrder === 'new') {
                return new Date(b.date) - new Date(a.date); // Сначала новые
            } else {
                return new Date(a.date) - new Date(b.date); // Сначала старые
            }
        });
    }

    // --- Рендер карточек новостей ---
    function renderNews(newsList) {
        const start = (currentPage - 1) * NEWS_PER_PAGE;
        const end = start + NEWS_PER_PAGE;
        const visibleNews = newsList.slice(start, end);

        // Удаляем старые карточки (кроме пагинации)
        const oldCards = newsContainer.querySelectorAll('.news_section__card');
        oldCards.forEach(c => c.remove());

        visibleNews.forEach(item => {
            const div = document.createElement('div');
            div.classList.add('news_section__card');
            const dateObj = new Date(item.date);
            const formattedDate = dateObj.toLocaleString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            div.innerHTML = `
                <img src="${item.img}" alt="Фото новости" class="card__img"/>
                <div class="card__description">
                    <div class="card__text">
                        <h2 class="card__title"><a href="${item.link}">${item.title}</a></h2>
                        <p class="card__subtitle">${item.subtitle}</p>
                    </div>
                    <p class="card__time">${formattedDate}</p>
                </div>
            `;
            paginationContainer.before(div);
        });
    }

    // --- Пагинация с троеточиями ---
    function renderPagination(totalItems) {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(totalItems / NEWS_PER_PAGE);
        if (totalPages <= 1) return;

        const prev = document.createElement('span');
        prev.textContent = '<';
        prev.classList.add('pages__page');
        if (currentPage === 1) prev.classList.add('disabled');
        prev.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updateNews();
            }
        });
        paginationContainer.appendChild(prev);

        const maxVisible = 2;
        for (let i = 1; i <= totalPages; i++) {
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
                    updateNews();
                });
                paginationContainer.appendChild(page);
            } else if (
                i === currentPage - maxVisible - 1 ||
                i === currentPage + maxVisible + 1
            ) {
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
                updateNews();
            }
        });
        paginationContainer.appendChild(next);
    }

    // --- Основное обновление ---
    function updateNews() {
        const sorted = sortNews([...news]);
        renderNews(sorted);
        renderPagination(sorted.length);
    }

    // --- События ---
    sortSelect.addEventListener('change', () => {
        currentPage = 1;
        updateNews();
    });

    // --- Первичный рендер ---
    updateNews();
});
