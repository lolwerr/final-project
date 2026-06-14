let currentList = [];
let selectedIndex = -1;

const input = document.getElementById("country");
const dropdown = document.getElementById("dropdown");
const grid = document.getElementById("grid");

function init() {
    renderGrid(Object.values(countries));
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
    `;
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