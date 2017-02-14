let clicked = false;

function onOkOver() {
    const intro = document.getElementById('intro');
    intro.style.color = 'black';
    intro.classList.add('flag');
}

function onOkOut() {
    const intro = document.getElementById('intro');
    intro.style.color = '';
    intro.classList.remove('flag');
}

function onOkClick() {
    clicked = true;
    document.getElementById('intro').classList.add('hide');
    document.getElementById('demo').classList.remove('hide');
}


