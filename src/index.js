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
const profileForm = popupTypeEdit.querySelector(".popup__form");
const popups = document.querySelectorAll(".popup");
const nameInput = document.querySelector(".popup__input_type_name");
const jobInput = document.querySelector(".popup__input_type_description");
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const newPlace = document.forms["new-place"];
const popupImg = document.querySelector(".popup_type_image");
const popupImage = popupImg.querySelector(".popup__image");
const popupCaption = popupImg.querySelector(".popup__caption");

function addCard(cardElement) {
  placesList.prepend(cardElement);
}

function handleCardImageClick(link, name) {
  popupImage.src = link;
  popupImage.alt = name;
  popupCaption.textContent = name;
  openPopup(popupImg);
}

// Создание начальных карточек
initialCards.forEach((element) => {
  const cardElement = createCard(
    cardTemplate,
    element,
    deleteCard,
    likeCard,
    handleCardImageClick
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
popups.forEach((popup) => {
  popup.addEventListener("click", (evt) => {
    if (
      evt.target === evt.currentTarget ||
      evt.target.classList.contains("popup__close")
    ) {
      closePopup(popup);
    }
  });
});

// Обновление профиля
profileForm.addEventListener("submit", (evt) => {
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
