let startTime;
let updatedTime;
let difference = 0;
let tInterval;
let running = false;
let lapCounter = 1;

const display = document.getElementById('display');
const lapsList = document.getElementById('laps');

const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const lapBtn = document.getElementById('lap');

startBtn.addEventListener('click', start);
pauseBtn.addEventListener('click', pause);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', lap);

document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case ' ': // Spacebar toggles start/pause
            event.preventDefault();
            if (running) {
                pause();
            } else {
                start();
            }
            break;
        case 'r': // 'r' resets
        case 'R':
            reset();
            break;
        case 'l': // 'l' records lap
        case 'L':
            lap();
            break;
    }
});

function updateButtonStates() {
    startBtn.disabled = running;
    pauseBtn.disabled = !running;
    resetBtn.disabled = difference === 0;
    lapBtn.disabled = !running;
}

function start() {
    if (!running) {
        startTime = new Date().getTime() - difference;
        tInterval = setInterval(updateTime, 100);
        running = true;
        updateButtonStates();
        startBtn.classList.add('active');
        pauseBtn.classList.remove('active');
    }
}

function pause() {
    if (running) {
        clearInterval(tInterval);
        difference = new Date().getTime() - startTime;
        running = false;
        updateButtonStates();
        startBtn.classList.remove('active');
        pauseBtn.classList.add('active');
    }
}

function reset() {
    clearInterval(tInterval);
    running = false;
    difference = 0;
    display.innerHTML = "00:00:00.00";
    lapsList.innerHTML = "";
    lapCounter = 1;
    updateButtonStates();
    startBtn.classList.remove('active');
    pauseBtn.classList.remove('active');
}

function lap() {
    if (running) {
        const lapTime = formatTime(difference);
        const lapItem = document.createElement('li');
        lapItem.innerHTML = `Lap ${lapCounter++}: ${lapTime}`;
        lapsList.appendChild(lapItem);
        lapItem.style.opacity = 0;
        setTimeout(() => {
            lapItem.style.opacity = 1;
        }, 10);
    }
}

function updateTime() {
    updatedTime = new Date().getTime();
    difference = updatedTime - startTime;
    display.innerHTML = formatTime(difference);
}

function formatTime(time) {
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    const centiseconds = Math.floor((time % 1000) / 10);
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(centiseconds)}`;
}

function pad(number) {
    return number < 10 ? '0' + number : number;
}

// Initialize button states on load
updateButtonStates();
