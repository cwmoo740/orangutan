const state = {
    player: null,
    hover: false
};

function onOkOver() {
    const intro = document.getElementById('intro');
    intro.style.color = 'black';
    intro.classList.add('flag');

    const hoverItems = document.getElementsByClassName('hover-text');
    Array.from(hoverItems).forEach(item => item.classList.remove('hide'));

    state.hover = true;
    if (state.player && typeof state.player.playVideo === 'function') {
        state.player.playVideo();
    }
}

function onOkOut() {
    const intro = document.getElementById('intro');
    intro.style.color = '';
    intro.classList.remove('flag');

    const hoverItems = document.getElementsByClassName('hover-text');
    Array.from(hoverItems).forEach(item => item.classList.add('hide'));

    state.hover = false;
    if (state.player && typeof state.player.pauseVideo === 'function') {
        state.player.pauseVideo();
    }
}

function onYouTubeIframeAPIReady() {
    const video = 'aZcSCT34H84';

    new YT.Player('video', {
        videoId: video,
        playerVars: {
            autoplay: 0,
            controls: 1,
            disablekb: 1,
            enablejsapi: 1,
            fs: 0,
            playsinline: 1,
            loop: 1,
            playlist: video,
            rel: 0,
            origin: 'https://cwmoo740.github.io'
        },
        events: {
            onReady(event) {
                state.player = event.target;
                state.player.setVolume(0);
                state.player.seekTo(17);
                state.player.pauseVideo();
                state.player.setVolume(100);
                if (state.hover) {
                    state.player.playVideo();
                }
            }
        }
    });
}

