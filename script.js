// 1. URL 파라미터에서 이미지 주소 읽기
const urlParams = new URLSearchParams(window.location.search);
const customImgUrl = urlParams.get('img'); // 링크 끝에 ?img=주소 가 있는지 확인

// 2. 상태 변수 설정
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
const userPhoto = document.getElementById('user-photo');

// 4. 이미지 설정 (파라미터가 없으면 기본 강아지 사진 사용)
const defaultDogImg = "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=400&auto=format&fit=crop";

if (customImgUrl) {
    userPhoto.src = decodeURIComponent(customImgUrl); // 사용자가 입력한 주소 적용
} else {
    userPhoto.src = defaultDogImg; // 기본 강아지 사진 적용
}

// 5. 시간을 MM:SS 형식으로 변환하는 함수
function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

// 6. 화면 UI 업데이트 함수
function updateUI() {
    // 상태에 따른 화면 전환
    setupDisplay.style.display = (currentState === 'IDLE') ? 'flex' : 'none';
    runningDisplay.style.display = (currentState === 'RUNNING' || currentState === 'PAUSED') ? 'flex' : 'none';
    
    // 완료 문구 처리
    completeText.style.display = (currentState === 'COMPLETE') ? 'block' : 'none';
    photoWrapper.style.opacity = (currentState === 'COMPLETE') ? '0' : '1';
    screen.classList.toggle('flash', currentState === 'COMPLETE');

    if (currentState === 'IDLE') {
        setupTimeText.textContent = `${setMinutes}M`;
    } else {
        const elapsedSeconds = totalSeconds - timeRemaining;
        elapsedTimeText.textContent = formatTime(elapsedSeconds);
        totalTimeText.textContent = formatTime(totalSeconds);

        if (totalSeconds > 0) {
            const percentage = (elapsedSeconds / totalSeconds) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    }
    
    runningDisplay.style.opacity = (currentState === 'PAUSED') ? '0.5' : '1';
}

// 7. 타이머 제어 함수
function startTimer() {
    currentState = 'RUNNING';
    updateUI();
    timerInterval = setInterval(() => {
        timeRemaining--;
        updateUI();
        if (timeRemaining <= 0) completeTimer();
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

function completeTimer() {
    clearInterval(timerInterval);
    currentState = 'COMPLETE';
    timeRemaining = 0;
    updateUI();
    setTimeout(resetTimer, 3000);
}

// 8. 버튼 이벤트 연결
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

// 초기 실행
resetTimer();
