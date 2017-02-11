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

console.log('what');