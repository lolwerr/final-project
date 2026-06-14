let currentTab = "all";
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentList = [];
let selectedIndex = -1;

const input = document.getElementById("country");
const dropdown = document.getElementById("dropdown");
const grid = document.getElementById("grid");

function init() {
    renderView();
}
init();

function showList() {
    const value = input.value.toLowerCase().trim();
    dropdown.innerHTML = "";
    selectedIndex = -1;

    if (!value) return;

    currentList = Object.keys(countries).filter(k =>
        countries[k].name.toLowerCase().includes(value) ||
        k.includes(value)
    );

    currentList.forEach((key, i) => {
        const div = document.createElement("div");
        div.className = "item";

        const regex = new RegExp(value, "gi");
        div.innerHTML = countries[key].name.replace(
            regex,
            m => `<span class="highlight">${m}</span>`
        );

        div.onclick = () => select(i);

        dropdown.appendChild(div);
    });
}

function handleKey(e) {
    const items = document.querySelectorAll(".item");

    if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex++;
        updateActive(items);
    }

    if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex--;
        updateActive(items);
    }

    if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex >= 0) select(selectedIndex);
        else searchCountry();
    }
}

function updateActive(items) {
    if (!items.length) return;

    if (selectedIndex < 0) selectedIndex = items.length - 1;
    if (selectedIndex >= items.length) selectedIndex = 0;

    items.forEach(i => i.classList.remove("active"));
    items[selectedIndex].classList.add("active");
}

function select(i) {
    const key = currentList[i];
    input.value = countries[key].name;

    dropdown.innerHTML = "";
    searchCountry();
    filterGrid();
}

function searchCountry() {
    const value = input.value.toLowerCase().trim();

    const country =
        Object.values(countries).find(c =>
            c.name.toLowerCase() === value
        );

    const result = document.getElementById("result");

    if (!country) {
        result.innerHTML = "";
        return;
    }

result.innerHTML = `
    <h2>${country.name}</h2>
    <img src="${country.флаг}" width="140">
    <p>Столица: ${country.столица}</p>
    <p class="small">${country.континент} • ${country.население}</p>

    <button onclick="toggleFavorite('${country.name}')">
        ⭐ Добавить в избранное
    </button>
`;
}

function toggleFavorite(name) {
    if (favorites.includes(name)) {
        favorites = favorites.filter(c => c !== name);
    } else {
        favorites.push(name);
    }

    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites();
    renderView();
}
function renderFavorites() {
    const box = document.getElementById("favorites");
    box.innerHTML = "";

    if (favorites.length === 0) {
        box.innerHTML = "<p class='small'>Нет избранных стран</p>";
        return;
    }

    favorites.forEach(name => {
        const country = Object.values(countries).find(c => c.name === name);
        if (!country) return;

        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <img src="${country.флаг}">
            <h4>${country.name}</h4>
            <div class="small">${country.континент}</div>
        `;

        div.onclick = () => {
            input.value = country.name;
            searchCountry();
        };

        box.appendChild(div);
    });
}

function setTab(tab) {
    currentTab = tab;

    document.getElementById("tab-all").classList.remove("active");
    document.getElementById("tab-fav").classList.remove("active");

    document.getElementById(`tab-${tab}`).classList.add("active");

    renderView();
}
function renderView() {
    if (currentTab === "all") {
        grid.style.display = "grid";
        renderGrid(Object.values(countries));
    }

    if (currentTab === "fav") {
        grid.style.display = "none";
        renderFavorites();
    }
}


function randomCountry() {
    const keys = Object.keys(countries);
    const key = keys[Math.floor(Math.random() * keys.length)];
    const c = countries[key];

    input.value = c.name;
    searchCountry();
    filterGrid();
}

function renderGrid(list) {
    grid.innerHTML = "";

    list.forEach(c => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <img src="${c.флаг}">
            <h4>${c.name}</h4>
            <div class="small">${c.континент}</div>
        `;

        card.onclick = () => {
            input.value = c.name;
            searchCountry();
        };

        grid.appendChild(card);
    });
}
function filterGrid() {
    const value = input.value.toLowerCase().trim();

    const filtered = Object.values(countries).filter(c =>
        c.name.toLowerCase().includes(value) ||
        c.континент.toLowerCase().includes(value)
    );

    renderGrid(filtered);
}

function showHelp() {
    alert(
`Как пользоваться:
- Начни вводить страну в поиск
- Используй стрелки ↑ ↓
- Enter — выбрать
- Клик по карточке — открыть страну`
    );
}
function toggleTheme() {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    document.getElementById("themeBtn").textContent =
        isDark ? "☀️" : "🌙";
}

function loadTheme() {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
        document.body.classList.add("dark");
        document.getElementById("themeBtn").textContent = "☀️";
    }
}

loadTheme();