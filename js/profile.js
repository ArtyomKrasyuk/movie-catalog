'use strict'

function toggle(){
    document.querySelector('.profile_card__information').classList.toggle('hidden');
    document.querySelector('.profile_card__changes').classList.toggle('hidden');
}

document.querySelector('.profile_card__btn').onclick = toggle;
document.querySelector('.changes__cancel').onclick = toggle;

