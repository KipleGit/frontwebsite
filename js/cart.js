// Корзина: количество, удаление, итоговая сумма и промокод
const cartList = document.querySelector(".cart__list");

if (cartList) {
  const FREE_DELIVERY_FROM = 15000;
  const DELIVERY_PRICE = 300;
  const PROMO_CODE = "SOUND10";
  const promoForm = document.getElementById("promo-form");
  const promoInput = document.getElementById("promo-code");
  const promoMessage = document.getElementById("promo-message");
  let discountPercent = 0;

  function formatPrice(value) {
    return value.toLocaleString("ru-RU") + " ₽";
  }

  function plural(n) {
    const last = n % 10;
    const lastTwo = n % 100;
    if (last === 1 && lastTwo !== 11) {
      return "товар";
    }
    if (last >= 2 && last <= 4 && (lastTwo < 10 || lastTwo >= 20)) {
      return "товара";
    }
    return "товаров";
  }

  function recalculate() {
    const items = cartList.querySelectorAll(".cart-item");
    let goods = 0;
    let count = 0;

    items.forEach(function (item) {
      const qty = Number(item.querySelector(".qty__input").value);
      goods += Number(item.dataset.price) * qty;
      count += qty;
    });

    const discount = Math.round((goods * discountPercent) / 100);
    const delivery = goods === 0 || goods >= FREE_DELIVERY_FROM ? 0 : DELIVERY_PRICE;

    document.getElementById("cart-count").textContent = count + " " + plural(count);
    document.getElementById("summary-goods").textContent = formatPrice(goods);
    document.getElementById("summary-delivery").textContent = delivery === 0 ? "Бесплатно" : formatPrice(delivery);
    document.getElementById("summary-discount").textContent = "−" + formatPrice(discount);
    document.getElementById("summary-total").textContent = formatPrice(goods - discount + delivery);
    document.getElementById("discount-row").hidden = discount === 0;
    document.getElementById("cart-empty").hidden = items.length > 0;
    document.getElementById("cart-content").hidden = items.length === 0;
  }

  cartList.addEventListener("click", function (event) {
    const item = event.target.closest(".cart-item");
    if (!item) {
      return;
    }

    if (event.target.matches(".qty__button")) {
      const input = item.querySelector(".qty__input");
      const next = Number(input.value) + Number(event.target.dataset.step);
      input.value = Math.min(10, Math.max(1, next));
      recalculate();
    }

    if (event.target.matches(".cart-item__remove")) {
      item.remove();
      recalculate();
    }
  });

  promoForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (promoInput.value.trim().toUpperCase() === PROMO_CODE) {
      discountPercent = 10;
      promoMessage.textContent = "Промокод применён: скидка 10%";
      promoMessage.className = "promo__message promo__message--ok";
    } else {
      discountPercent = 0;
      promoMessage.textContent = "Такого промокода нет. Попробуйте SOUND10";
      promoMessage.className = "promo__message promo__message--error";
    }
    recalculate();
  });

  recalculate();
}
