// --- ПРОВЕРКА АВТОРИЗАЦИИ ---
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser) {
    window.location.href = 'login.html';
}

// --- Состояние игры ---
let rubBalance = currentUser.rubBalance || 0;
let fish = currentUser.fish || 0;
let penguins = currentUser.penguins || 0;

// --- Магазин пингвинов ---
const shopItems = [
    { id: 'p1', name: '🐧 Обычный пингвин', cost: 50, fishPerSec: 1 },
    { id: 'p2', name: '🐧🐧 Быстрый пингвин', cost: 200, fishPerSec: 5 },
    { id: 'p3', name: '🐧🐧🐧 Императорский', cost: 1000, fishPerSec: 25 }
];

// --- Элементы ---
const rubDisplay = document.getElementById('rubBalance');
const penguinDisplay = document.getElementById('penguinCount');
const fishDisplay = document.getElementById('fishCount');
const shopContainer = document.getElementById('shopItems');
const collectBtn = document.getElementById('collectFishBtn');
const sellBtn = document.getElementById('sellFishBtn');

// --- Обновление интерфейса ---
function updateUI() {
    rubDisplay.textContent = Math.floor(rubBalance);
    fishDisplay.textContent = Math.floor(fish);
    penguinDisplay.textContent = penguins;
    renderShop();
    saveGame();
}

// --- Отрисовка магазина ---
function renderShop() {
    shopContainer.innerHTML = '';
    shopItems.forEach(item => {
        const canAfford = rubBalance >= item.cost;
        shopContainer.innerHTML += `
            <div class="shop-item">
                <div class="shop-item-info">
                    <h3>${item.name}</h3>
                    <p>Доход: +${item.fishPerSec} рыбы/сек</p>
                </div>
                <button class="buy-btn" onclick="buyPenguin('${item.id}')" ${!canAfford ? 'disabled' : ''}>
                    ${item.cost} ₽
                </button>
            </div>
        `;
    });
}

// --- Покупка пингвина ---
window.buyPenguin = function(id) {
    const item = shopItems.find(i => i.id === id);
    if (item && rubBalance >= item.cost) {
        rubBalance -= item.cost;
        penguins += 1;
        updateUI();
        alert(`Ты купил ${item.name}! Теперь он приносит рыбу.`);
    }
};

// --- Сбор рыбы по клику ---
collectBtn.addEventListener('click', () => {
    fish += 1;
    updateUI();
});

// --- Продажа рыбы ---
sellBtn.addEventListener('click', () => {
    if (fish <= 0) {
        alert('У тебя нет рыбы для продажи!');
        return;
    }
    const earned = Math.floor(fish * 0.5); // 1 рыба = 0.5 ₽
    rubBalance += earned;
    fish = 0;
    updateUI();
    alert(`Ты продал всю рыбу и заработал ${earned} ₽!`);
});

// --- Пассивный доход (каждую секунду) ---
setInterval(() => {
    if (penguins > 0) {
        // Каждый пингвин приносит рыбу в зависимости от типа
        // (упрощённо: 1 пингвин = 1 рыба/сек, но можно доработать)
        fish += penguins * 1;
        updateUI();
    }
}, 1000);

// --- Сохранение прогресса ---
function saveGame() {
    currentUser.rubBalance = rubBalance;
    currentUser.fish = fish;
    currentUser.penguins = penguins;
    
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const index = users.findIndex(u => u.email === currentUser.email);
    if (index !== -1) {
        users[index] = currentUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
}

// --- Выход ---
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
});

// --- Старт ---
updateUI();
