// ============================================================
//  🎲 対照実験用 乱数生成アプリ
//  外部通信ゼロ！Firebase完全不使用！
// ============================================================

// ------------------------------------------------------------
//  DOM参照
// ------------------------------------------------------------
const diceEls = [
    document.getElementById('dice1'),
    document.getElementById('dice2'),
    document.getElementById('dice3')
];
const rollBtn = document.getElementById('rollBtn');
const resultEl = document.getElementById('result');
const statusEl = document.getElementById('status');
const historyEl = document.getElementById('history');
const confettiContainer = document.getElementById('confetti');

// ------------------------------------------------------------
//  定数
// ------------------------------------------------------------
const DICE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
let history = [];

// ------------------------------------------------------------
//  サイコロを振る（メイン処理）
// ------------------------------------------------------------
function rollDice() {
    // ボタン無効化（連打防止）
    rollBtn.disabled = true;
    resultEl.className = 'result';
    resultEl.textContent = '🎲 振ってる...';
    statusEl.textContent = '🔄 乱数生成中...';

    // アニメーション
    diceEls.forEach(el => el.classList.add('rolling'));

    // 0.3秒後に結果表示
    setTimeout(() => {
        // 🎯 乱数生成（1〜6を3つ）
        const values = [
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1,
            Math.floor(Math.random() * 6) + 1
        ];

        // サイコロ表示更新
        diceEls.forEach((el, i) => {
            el.textContent = DICE_FACES[values[i] - 1];
            el.classList.remove('rolling');
            el.classList.remove('match');
        });

        // 🎯 判定：全部同じ？
        const allMatch = values[0] === values[1] && values[1] === values[2];

        if (allMatch) {
            // 🎉 勝利！
            resultEl.className = 'result win';
            resultEl.textContent = '🎉 いえーい！ ' + values.join('・') + ' で揃った！';
            diceEls.forEach(el => el.classList.add('match'));
            fireConfetti();
            statusEl.textContent = '🎊 おめでとう！完全一致！';
            history.push({ values, win: true });
        } else {
            // 😅 敗北
            resultEl.className = 'result lose';
            resultEl.textContent = '😅 ざんねん〜 ' + values.join('・') + ' でした';
            statusEl.textContent = '💪 次こそ！';
            history.push({ values, win: false });
        }

        // 履歴更新
        updateHistory();

        // ボタン再有効化
        rollBtn.disabled = false;

    }, 300);
}

// ------------------------------------------------------------
//  🎊 紙吹雪（クソ適当）
// ------------------------------------------------------------
function fireConfetti() {
    confettiContainer.innerHTML = '';
    const colors = ['#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff6bb5', '#a66bff'];
    const pieces = 60;

    for (let i = 0; i < pieces; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.top = '-10px';
        piece.style.width = (Math.random() * 8 + 4) + 'px';
        piece.style.height = (Math.random() * 8 + 4) + 'px';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        piece.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
        piece.style.animationDelay = (Math.random() * 1.5) + 's';
        confettiContainer.appendChild(piece);
    }

    setTimeout(() => {
        confettiContainer.innerHTML = '';
    }, 4000);
}

// ------------------------------------------------------------
//  📜 履歴表示
// ------------------------------------------------------------
function updateHistory() {
    const recent = history.slice(-10);
    if (recent.length === 0) {
        historyEl.innerHTML = '';
        return;
    }
    historyEl.innerHTML = recent.map(item => {
        const text = item.values.join('・');
        const cls = item.win ? 'win-text' : 'lose-text';
        const emoji = item.win ? '🎉' : '😅';
        return `<span class="${cls}">${emoji} ${text}</span>`;
    }).join('');
}

// ------------------------------------------------------------
//  🚀 イベント登録
// ------------------------------------------------------------
rollBtn.addEventListener('click', rollDice);

// スペースキーでも振れる
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !rollBtn.disabled) {
        e.preventDefault();
        rollDice();
    }
});

// ------------------------------------------------------------
//  📌 起動ログ
// ------------------------------------------------------------
console.log('🎲 対照実験アプリ起動！');
console.log('✅ 外部通信ゼロ / Firebase不使用');
console.log('📡 通信先:', window.location.origin);
statusEl.textContent = '✅ 準備完了（外部通信なし / ' + window.location.origin + ' のみ）';