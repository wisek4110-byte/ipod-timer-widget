// 상태 변수
let currentState = 'IDLE'; 
let setMinutes = 10;
let totalSeconds = setMinutes * 60;
let timeRemaining = totalSeconds;
let timerInterval = null;

// DOM 요소
const screen = document.getElementById('screen');
const setupDisplay = document.getElementById('setup-display');
const setupTimeText = document.getElementById('setup-time-text');
const runningDisplay = document.getElementById('running-display');
const elapsedTimeText = document.getElementById('elapsed-time');
const totalTimeText = document.getElementById('total-time');
const progressBar = document.getElementById('progress-bar');
const completeText = document.getElementById('complete-text');
const photoWrapper = document.querySelector('.photo-wrapper');

// 시간을 MM:SS 형식으로 변환하는 함수
function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

// 화면 UI 업데이트
function updateUI() {
    // 1. 상태에 따른 화면 전환
    setupDisplay.style.display = (currentState === 'IDLE') ? 'flex' : 'none';
    runningDisplay.style.display = (currentState === 'RUNNING' || currentState === 'PAUSED') ? 'flex' : 'none';
    
    // 완료 문구 및 애니메이션
    completeText.style.display = (currentState === 'COMPLETE') ? 'block' : 'none';
    photoWrapper.style.opacity = (currentState === 'COMPLETE') ? '0' : '1'; // 완료시 사진 숨김
    screen.classList.toggle('flash', currentState === 'COMPLETE');

    // 2. 대기 상태일 때
    if (currentState === 'IDLE') {
        setupTimeText.textContent = `${setMinutes}M`;
    } 
    // 3. 작동 또는 일시정지 상태일 때 (00:00 -- 10:00 형식)
    else {
        // 경과 시간 계산 (0부터 시작해서 증가)
        const elapsedSeconds = totalSeconds - timeRemaining;
        
        elapsedTimeText.textContent = formatTime(elapsedSeconds); // 왼쪽 (경과 시간)
        totalTimeText.textContent = formatTime(totalSeconds);     // 오른쪽 (전체 시간)

        // 프로그레스 바 계산 (0%에서 100%로 증가)
        if (totalSeconds > 0) {
            const percentage = (elapsedSeconds / totalSeconds) * 100;
            progressBar.style.width = `${percentage}%`;
        }
    }
    
    // 일시정지 시 화면 흐리게
    runningDisplay.style.opacity = (currentState === 'PAUSED') ? '0.5' : '1';
}

// --- 타이머 로직 ---
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
    setTimeout(resetTimer, 3000); // 3초 후 초기화
}

// --- 버튼 이벤트 ---
function adjustTime(amount) {
    if (currentState !== 'IDLE') return;
    setMinutes = Math.max(1, Math.min(60, setMinutes + amount));
    totalSeconds = setMinutes * 60;
    timeRemaining = totalSeconds;
    updateUI();
}

// 시간 조절 버튼 연결
document.getElementById('arrow-left').addEventListener('click', () => adjustTime(-5));
document.getElementById('arrow-right').addEventListener('click', () => adjustTime(5));
document.querySelector('.btn-prev').addEventListener('click', () => adjustTime(-5));
document.querySelector('.btn-next').addEventListener('click', () => adjustTime(5));

// 가운데 버튼 (시작 / 완전 초기화)
document.getElementById('btn-center').addEventListener('click', () => {
    if (currentState === 'IDLE') startTimer();
    else resetTimer();
});

// 일시정지 버튼 (▶|| 위치)
document.getElementById('btn-play-pause').addEventListener('click', () => {
    if (currentState === 'RUNNING') pauseTimer();
    else if (currentState === 'PAUSED') startTimer();
});

// 초기 실행
resetTimer();