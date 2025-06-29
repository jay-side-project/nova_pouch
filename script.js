// NOVA POUCH 게임 인터랙션 스크립트
// 실제 기능은 추후 구현 예정

document.addEventListener('DOMContentLoaded', () => {
    // 토큰 데이터 로드
    let tokens = null;
    fetch('tokens.json')
        .then(res => res.json())
        .then(data => { tokens = data; });

    // 턴 수 관리
    let turnCount = 1;
    const turnCountSpan = document.getElementById('turn-count');
    function increaseTurn() {
        turnCount++;
        turnCountSpan.textContent = turnCount;
        resetTokenLabels();
    }
    function resetTurn() {
        turnCount = 1;
        turnCountSpan.textContent = turnCount;
    }

    // 안내 메시지 표시
    function showAlert(msg) {
        alert(msg);
    }

    // 턴 종료 버튼 클릭 시 턴 증가
    document.querySelector('.end-turn-btn').addEventListener('click', () => {
        increaseTurn();
    });

    // 파우치 클릭 시 토큰 표시 (pouch-label에 표시)
    document.querySelectorAll('.pouch-img').forEach(img => {
        img.addEventListener('click', () => {
            const type = img.dataset.pouch;
            // 노바 파우치(초록) 제한
            if (type === 'nova' && turnCount < 6) {
                showAlert('노바 파우치는 아직 사용할 수 없습니다.');
                return;
            }
            if (!tokens) return;
            const tokenList = tokens[type];
            if (!tokenList || tokenList.length === 0) return;
            const randomIdx = Math.floor(Math.random() * tokenList.length);
            const token = tokenList[randomIdx];
            document.getElementById('label-' + type).textContent = token;
        });
    });

    // 플레이어 관련 기능
    const maxPlayers = 5;
    let playerCount = 1;
    const playersSection = document.querySelector('.players');
    const addPlayerBtn = document.querySelector('.add-player');

    // 플레이어 이름 수정 기능
    playersSection.addEventListener('click', (e) => {
        if (e.target.classList.contains('editable') && !e.target.classList.contains('disabled')) {
            const nameDiv = e.target;
            const currentName = nameDiv.textContent;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentName;
            input.className = 'player-name-input';
            input.maxLength = 10;
            nameDiv.replaceWith(input);
            input.focus();
            input.select();
            input.addEventListener('blur', () => {
                const newName = input.value.trim() || currentName;
                const newDiv = document.createElement('div');
                newDiv.className = 'player-name editable';
                newDiv.id = nameDiv.id;
                newDiv.textContent = newName;
                input.replaceWith(newDiv);
            });
            input.addEventListener('keydown', (ev) => {
                if (ev.key === 'Enter') input.blur();
            });
        }
    });

    // 플레이어 추가 기능
    addPlayerBtn.addEventListener('click', () => {
        if (playerCount >= maxPlayers) return;
        playerCount++;
        const playerDiv = document.createElement('div');
        playerDiv.className = 'player';
        playerDiv.id = `player-${playerCount}`;
        // 이름
        const nameDiv = document.createElement('div');
        nameDiv.className = 'player-name editable';
        nameDiv.id = `player-name-${playerCount}`;
        nameDiv.textContent = `플레이어 ${playerCount}`;
        // 하트
        const heartsDiv = document.createElement('div');
        heartsDiv.className = 'hearts';
        for (let i = 0; i < 3; i++) {
            const heart = document.createElement('img');
            heart.src = 'heart.png';
            heart.alt = '생명력';
            heart.className = 'heart';
            heartsDiv.appendChild(heart);
        }
        playerDiv.appendChild(nameDiv);
        playerDiv.appendChild(heartsDiv);
        // +버튼 앞에 삽입
        playersSection.insertBefore(playerDiv, addPlayerBtn);
        if (playerCount === maxPlayers) {
            addPlayerBtn.style.display = 'none';
        }
    });

    // 재시작 버튼 클릭 이벤트
    document.querySelector('.restart-btn').addEventListener('click', () => {
        // 턴 초기화
        resetTurn();
        // 토큰 라벨 초기화
        resetTokenLabels();
        // 플레이어 1만 남기고 모두 삭제
        const players = playersSection.querySelectorAll('.player');
        players.forEach((player, idx) => {
            if (idx > 0) player.remove();
        });
        playerCount = 1;
        addPlayerBtn.style.display = '';
        // 플레이어1 이름/하트/상태 초기화
        const nameDiv = document.getElementById('player-name-1');
        nameDiv.textContent = '플레이어 1';
        nameDiv.classList.remove('disabled');
        nameDiv.classList.add('editable');
        nameDiv.style.color = '';
        const heartsDiv = document.querySelector('#player-1 .hearts');
        heartsDiv.innerHTML = '';
        for (let i = 0; i < 3; i++) {
            const heart = document.createElement('img');
            heart.src = 'heart.png';
            heart.alt = '생명력';
            heart.className = 'heart';
            heartsDiv.appendChild(heart);
        }
    });

    // 생명력(하트) 클릭 이벤트 (플레이어별)
    playersSection.addEventListener('click', (e) => {
        if (e.target.classList.contains('heart')) {
            const heart = e.target;
            const heartsDiv = heart.parentElement;
            const playerDiv = heartsDiv.closest('.player');
            // 마지막 하트 클릭 시
            if (heartsDiv.children.length === 1) {
                heart.remove();
                // 턴 증가
                increaseTurn();
                // 해당 플레이어 이름 비활성화
                const nameDiv = playerDiv.querySelector('.player-name');
                nameDiv.classList.add('disabled');
                nameDiv.classList.remove('editable');
                nameDiv.style.color = '#aaa';
                return;
            }
            // 하트 2개 이상일 때는 기존처럼 삭제 및 턴 증가
            heart.remove();
            increaseTurn();
        }
    });

    function resetTokenLabels() {
        document.getElementById('label-items').textContent = '물건 토큰';
        document.getElementById('label-attributes').textContent = '속성 토큰';
        document.getElementById('label-nova').textContent = '노바 토큰';
    }
}); 