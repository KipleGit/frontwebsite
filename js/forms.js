// Проверка форм (обратная связь и оформление заказа)
const forms = document.querySelectorAll(".form");

// Возвращает текст ошибки или пустую строку, если поле заполнено верно
function getErrorText(field) {
  if (field.validity.valueMissing) {
    return field.type === "checkbox" ? "Подтвердите согласие, чтобы продолжить" : "Заполните это поле";
  }
  if (field.validity.typeMismatch) {
    return "Введите e-mail в формате name@example.ru";
  }
  if (field.validity.patternMismatch) {
    return "Введите телефон в формате +7 (900) 000-00-00";
  }
  if (field.validity.tooShort) {
    return "Слишком коротко: минимум " + field.minLength + " символов";
  }
  return "";
}

// Показывает или убирает ошибку под полем
function showError(field) {
  const message = getErrorText(field);
  const errorBox = document.getElementById(field.id + "-error");
  if (errorBox) {
    errorBox.textContent = message;
  }
  field.classList.toggle("form__input--invalid", message !== "");
  return message === "";
}

forms.forEach(function (form) {
  const fields = Array.from(form.querySelectorAll("input, textarea, select"));
  const success = form.querySelector(".form__success");
  const delivery = form.querySelector("#delivery");
  const address = form.querySelector("#address");

  // В заказе адрес нужен только для курьера и ПВЗ
  if (delivery && address) {
    delivery.addEventListener("change", function () {
      address.required = delivery.value !== "pickup";
      if (!address.required) {
        showError(address);
      }
    });
  }

  fields.forEach(function (field) {
    field.addEventListener("blur", function () {
      showError(field);
    });
    field.addEventListener("input", function () {
      if (field.classList.contains("form__input--invalid")) {
        showError(field);
      }
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    let allValid = true;

    fields.forEach(function (field) {
      if (!showError(field)) {
        allValid = false;
      }
    });

    if (allValid) {
      form.reset();
      success.hidden = false;
    } else {
      success.hidden = true;
      form.querySelector(".form__input--invalid").focus();
    }
  });
});
