// Каталог наушников: фильтры, сортировка и поиск
const list = document.querySelector(".product-list");

if (list) {
  const form = document.querySelector(".filters");
  const sortSelect = document.getElementById("sort");
  const foundCount = document.getElementById("found-count");
  const emptyMessage = document.getElementById("empty-message");
  const cards = Array.from(list.querySelectorAll(".product-card"));
  const params = new URLSearchParams(window.location.search);
  const query = (params.get("q") || "").toLowerCase().trim();
  const brandFromLink = params.get("brand");

  // Если пришли по ссылке бренда с главной, сразу отмечаем его в фильтре
  if (brandFromLink) {
    const brandBox = form.querySelector('input[name="brand"][value="' + brandFromLink + '"]');
    if (brandBox) {
      brandBox.checked = true;
    }
  }

  // Показываем в строке поиска то, что искал пользователь
  const searchInput = document.querySelector(".search__input");
  if (searchInput && query) {
    searchInput.value = query;
  }

  // Фильтрация карточек
  function applyFilters() {
    const minPrice = Number(form.elements.priceMin.value) || 0;
    const maxPrice = Number(form.elements.priceMax.value) || Infinity;
    const brands = Array.from(form.querySelectorAll('input[name="brand"]:checked')).map(function (item) {
      return item.value;
    });
    const connection = form.elements.connection ? form.elements.connection.value : "any";
    let found = 0;

    cards.forEach(function (card) {
      const price = Number(card.dataset.price);
      const isWireless = card.dataset.wireless === "yes";
      let visible = price >= minPrice && price <= maxPrice;

      if (brands.length > 0 && !brands.includes(card.dataset.brand)) {
        visible = false;
      }
      if (connection === "wired" && isWireless) {
        visible = false;
      }
      if (connection === "wireless" && !isWireless) {
        visible = false;
      }
      if (query && !card.dataset.name.toLowerCase().includes(query)) {
        visible = false;
      }

      card.hidden = !visible;
      if (visible) {
        found += 1;
      }
    });

    foundCount.textContent = "Найдено: " + found;
    emptyMessage.hidden = found > 0;
  }

  // Сортировка карточек
  function sortCards() {
    const mode = sortSelect.value;
    // после действий пользователя анимацию появления отключаем, чтобы карточки не мигали
    list.classList.add("product-list--static");
    const sorted = cards.slice().sort(function (a, b) {
      if (mode === "price-asc") {
        return a.dataset.price - b.dataset.price;
      }
      if (mode === "price-desc") {
        return b.dataset.price - a.dataset.price;
      }
      if (mode === "year-desc") {
        return b.dataset.year - a.dataset.year;
      }
      return b.dataset.popularity - a.dataset.popularity;
    });
    sorted.forEach(function (card) {
      list.appendChild(card);
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    list.classList.add("product-list--static");
    applyFilters();
  });

  form.addEventListener("reset", function () {
    // после сброса форма очищается не сразу, поэтому ждём
    list.classList.add("product-list--static");
    setTimeout(applyFilters, 0);
  });

  sortSelect.addEventListener("change", sortCards);

  // Карточки в HTML уже стоят по популярности, поэтому при загрузке их не переставляем
  applyFilters();
}
