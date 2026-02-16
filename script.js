const urlParams = new URLSearchParams(window.location.search);
const customImgUrl = urlParams.get('img');
const defaultDogImg = "dog.jpg"; 

const userPhoto = document.getElementById('user-photo');
userPhoto.src = customImgUrl ? decodeURIComponent(customImgUrl) : defaultDogImg;

let currentState = 'IDLE'; 
let setMinutes = 10;
let totalSeconds = setMinutes * 60;
let timeRemaining = totalSeconds;
let timerInterval = null;

const setupTimeText = document.getElementById('setup-time-text');
const runningDisplay = document.getElementById('running-display');
const setupDisplay = document.getElementById('setup-display');
const elapsedTimeText = document.getElementById('elapsed-time');
const totalTimeText = document.getElementById('total-time');
const progressBar = document.getElementById('progress-bar');
const completeText = document.getElementById('complete-text');

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function updateUI() {
    setupDisplay.style.display = (currentState === 'IDLE') ? 'flex' : 'none';
    runningDisplay.style.display = (currentState === 'RUNNING' || currentState === 'PAUSED') ? 'flex' : 'none';
    completeText.style.display = (currentState === 'COMPLETE') ? 'block' : 'none';
    document.getElementById('screen').classList.toggle('flash', currentState === 'COMPLETE');

    if (currentState === 'IDLE') {
        setupTimeText.textContent = setMinutes + "M";
    } else {
        const elapsedSeconds = totalSeconds - timeRemaining;
        elapsedTimeText.textContent = formatTime(elapsedSeconds);
        totalTimeText.textContent = formatTime(totalSeconds);
        const percentage = totalSeconds > 0 ? (elapsedSeconds / totalSeconds) * 100 : 0;
        progressBar.style.width = `${percentage}%`;
    }
    runningDisplay.style.opacity = (currentState === 'PAUSED') ? '0.5' : '1';
}

// 시간 조절 로직 수정: 1, 5, 10, 15...60
function adjustTime(direction) {
    if (currentState !== 'IDLE') return;

    if (direction > 0) { // 시간 증가
        if (setMinutes === 1) setMinutes = 5;
        else if (setMinutes < 60) setMinutes += 5;
    } else { // 시간 감소
        if (setMinutes === 5) setMinutes = 1;
        else if (setMinutes > 5) setMinutes -= 5;
    }

    totalSeconds = setMinutes * 60;
    timeRemaining = totalSeconds;
    updateUI();
}

document.getElementById('arrow-left').addEventListener('click', () => adjustTime(-1));
document.getElementById('arrow-right').addEventListener('click', () => adjustTime(1));
document.querySelector('.btn-prev').addEventListener('click', () => adjustTime(-1));
document.querySelector('.btn-next').addEventListener('click', () => adjustTime(1));

document.getElementById('btn-center').addEventListener('click', () => {
    if (currentState === 'IDLE') startTimer();
    else resetTimer();
});
document.getElementById('btn-play-pause').addEventListener('click', () => {
    if (currentState === 'RUNNING') pauseTimer();
    else if (currentState === 'PAUSED') startTimer();
});

function startTimer() {
    currentState = 'RUNNING';
    updateUI();
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateUI();
        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            currentState = 'COMPLETE';
            updateUI();
            setTimeout(resetTimer, 3000);
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    currentState = 'PAUSED';
    updateUI();
}

function resetTimer() {
    clearInterval(timerInterval);
    currentState = 'IDLE';
    totalSeconds = setMinutes * 60;
    timeRemaining = totalSeconds;
    updateUI();
}

resetTimer();
