import "./pages/index.css";
import { initialCards } from "./components/cards";
import { openPopup, closePopup } from "./components/modal";
import { createCard, likeCard, deleteCard } from "./components/card";

const cardTemplate = document.querySelector("#card-template").content;
const placesList = document.querySelector(".places__list");
const plusButton = document.querySelector(".profile__add-button");
const popupNewCard = document.querySelector(".popup_type_new-card");
const popupTypeEdit = document.querySelector(".popup_type_edit");
const profileEditBtn = document.querySelector(".profile__edit-button");
const formElement = document.querySelector(".popup__form");
const nameInput = document.querySelector(".popup__input_type_name");
const jobInput = document.querySelector(".popup__input_type_description");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const newPlace = document.forms["new-place"];
const popupImg = document.querySelector(".popup_type_image");

function addCard(cardElement) {
  placesList.prepend(cardElement);
}

// Создание начальных карточек
initialCards.forEach((element) => {
  const cardElement = createCard(
    cardTemplate,
    element,
    deleteCard,
    likeCard,
    openPopup,
    popupImg
  );
  placesList.append(cardElement);
});

// Открытие попапов
plusButton.addEventListener("click", () => {
  openPopup(popupNewCard);
});

profileEditBtn.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  openPopup(popupTypeEdit);
});

// Закрытие попапов
document.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("popup__close")) {
    const popupElement = evt.target.closest(".popup");
    closePopup(popupElement);
  }
});

document.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("popup")) {
    closePopup(evt.target);
  }
});

// Обновление профиля
formElement.addEventListener("submit", (evt) => {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closePopup(popupTypeEdit);
});

// Добавление новой карточки
newPlace.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const name = newPlace.elements["place-name"].value.trim();
  const link = newPlace.elements["link"].value.trim();
  if (!name || !link) return;
  const cardData = { name, link };
  const newCard = createCard(
    cardTemplate,
    cardData,
    deleteCard,
    likeCard,
    openPopup,
    popupImg
  );
  initialCards.push(cardData);
  newPlace.reset();
  addCard(newCard);
  closePopup(popupNewCard);
});
