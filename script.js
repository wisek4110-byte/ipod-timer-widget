// 1. 이미지 설정 (기본 강아지 사진 + URL 파라미터 지원)
const urlParams = new URLSearchParams(window.location.search);
const customImgUrl = urlParams.get('img');
const defaultDogImg = "dog.jpg";

const userPhoto = document.getElementById('user-photo');
userPhoto.src = customImgUrl ? decodeURIComponent(customImgUrl) : defaultDogImg;

// 2. 상태 변수
let currentState = 'IDLE'; 
let setMinutes = 10;
let totalSeconds = setMinutes * 60;
let timeRemaining = totalSeconds;
let timerInterval = null;

// 3. DOM 요소 선택
const screen = document.getElementById('screen');
const setupDisplay = document.getElementById('setup-display');
const setupTimeText = document.getElementById('setup-time-text');
const runningDisplay = document.getElementById('running-display');
const elapsedTimeText = document.getElementById('elapsed-time');
const totalTimeText = document.getElementById('total-time');
const progressBar = document.getElementById('progress-bar');
const completeText = document.getElementById('complete-text');
const photoWrapper = document.querySelector('.photo-wrapper');

// 4. 시간 포맷 함수 (MM:SS)
function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

// 5. 화면 업데이트 로직
function updateUI() {
    setupDisplay.style.display = (currentState === 'IDLE') ? 'flex' : 'none';
    runningDisplay.style.display = (currentState === 'RUNNING' || currentState === 'PAUSED') ? 'flex' : 'none';
    completeText.style.display = (currentState === 'COMPLETE') ? 'block' : 'none';
    photoWrapper.style.opacity = (currentState === 'COMPLETE') ? '0' : '1';
    screen.classList.toggle('flash', currentState === 'COMPLETE');

    if (currentState === 'IDLE') {
        setupTimeText.textContent = `${setMinutes}M`;
    } else {
        const elapsedSeconds = totalSeconds - timeRemaining;
        elapsedTimeText.textContent = formatTime(elapsedSeconds);
        totalTimeText.textContent = formatTime(totalSeconds);
        const percentage = totalSeconds > 0 ? (elapsedSeconds / totalSeconds) * 100 : 0;
        progressBar.style.width = `${percentage}%`;
    }
    runningDisplay.style.opacity = (currentState === 'PAUSED') ? '0.5' : '1';
}

// 6. 타이머 제어
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

// 7. 버튼 이벤트
function adjustTime(amount) {
    if (currentState !== 'IDLE') return;
    setMinutes = Math.max(1, Math.min(60, setMinutes + amount));
    totalSeconds = setMinutes * 60;
    timeRemaining = totalSeconds;
    updateUI();
}

document.getElementById('arrow-left').addEventListener('click', () => adjustTime(-5));
document.getElementById('arrow-right').addEventListener('click', () => adjustTime(5));
document.querySelector('.btn-prev').addEventListener('click', () => adjustTime(-5));
document.querySelector('.btn-next').addEventListener('click', () => adjustTime(5));

document.getElementById('btn-center').addEventListener('click', () => {
    if (currentState === 'IDLE') startTimer();
    else resetTimer();
});

document.getElementById('btn-play-pause').addEventListener('click', () => {
    if (currentState === 'RUNNING') pauseTimer();
    else if (currentState === 'PAUSED') startTimer();
});

// 초기화 실행
resetTimer();
