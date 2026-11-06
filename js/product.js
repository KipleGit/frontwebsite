// Карточка товара: кнопки «−» и «+» у количества
const qtyBlock = document.querySelector(".product .qty");

if (qtyBlock) {
  const input = qtyBlock.querySelector(".qty__input");

  qtyBlock.addEventListener("click", function (event) {
    if (event.target.matches(".qty__button")) {
      const next = Number(input.value) + Number(event.target.dataset.step);
      input.value = Math.min(10, Math.max(1, next));
    }
  });
}
