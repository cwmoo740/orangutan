const state = {
    hover: false,
    audio: null
};

const audio = document.getElementById('audio');
audio.addEventListener('canplay', () => {
    if (state.hover) {
        audio.play();
    }
    state.audio = audio;
});

const intro = document.getElementById('intro');
const hoverItems = document.getElementsByClassName('hover-text');

function onOkOver() {
    intro.style.color = 'black';
    intro.classList.add('flag');

    Array.from(hoverItems).forEach(item => item.classList.remove('hide'));

    if (state.audio) {
        state.audio.play();
    }

    state.hover = true;
}

function onOkOut() {
    intro.style.color = '';
    intro.classList.remove('flag');

    Array.from(hoverItems).forEach(item => item.classList.add('hide'));

    if (state.audio) {
        state.audio.pause();
    }
    state.hover = false;
}

