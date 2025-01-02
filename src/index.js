import "./pages/index.css";
import { openPopup, closePopup } from "./components/modal";
import { createCard, likeCard, deleteCard } from "./components/card";
import { enableValidation, clearValidation } from "./components/validation.js";

import {
  getUser,
  getInitialCards,
  editUser,
  postCreateCard,
  editAvatar,
} from "./components/api.js";

let userID;
let cardID;

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
const profileImg = document.querySelector(".profile__image");
const popupAvatar = document.querySelector(".popup_avatar");
const editAvatarImg = popupAvatar.querySelector(".popup__form");
const avatarInput = popupAvatar.querySelector(".popup__input_type_url");

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidation(validationConfig);

function handleCardImageClick(link, name) {
  popupImage.src = link;
  popupImage.alt = name;
  popupCaption.textContent = name;
  openPopup(popupImg);
}

function addCard(cardElement) {
  placesList.prepend(cardElement);
}

// Открытие попапов
plusButton.addEventListener("click", () => {
  openPopup(popupNewCard);
});

profileEditBtn.addEventListener("click", () => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationConfig);
  openPopup(popupTypeEdit);
});

profileImg.addEventListener("click", () => {
  openPopup(popupAvatar);
});

// Закрытие попапов
popups.forEach((popup) => {
  popup.addEventListener("mousedown", (evt) => {
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
  const submitButton = evt.target.querySelector(validationConfig.submitButtonSelector);
  const name = nameInput.value;
  const about = jobInput.value;

  submitButton.textContent = "Сохранение...";

  editUser(name, about)
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closePopup(popupTypeEdit);
    })
    .catch((error) => {
      console.error("Ошибка при обновлении профиля:", error);
    })
    .finally(() => {
      submitButton.textContent = "Сохранить";
    });
});

//Обновление аватарки пользователя
editAvatarImg.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitButton = evt.target.querySelector(validationConfig.submitButtonSelector);
  const avatar = avatarInput.value.trim();
  submitButton.textContent = "Сохранение...";
  editAvatar(avatar)
    .then((data) => {
      profileImg.style.backgroundImage = `url(${data.avatar})`;
      closePopup(popupAvatar);
    })
    .catch(() => {
      alert("Ошибка при обновлении аватара. Попробуйте снова.");
    })
    .finally(() => {
      submitButton.textContent = "Сохранить";
    });
});

Promise.all([getUser(), getInitialCards()]).then(
  ([userData, cardsData]) => {
    userID = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImg.style.backgroundImage = `url(${userData.avatar})`

    cardsData.forEach((element) => {
      cardID = element._id;
      const cardElement = createCard(
        cardTemplate,
        element,
        userID,
        cardID,
        deleteCard,
        likeCard,
        handleCardImageClick
      );
      placesList.append(cardElement);
    });
  }).catch(() => {
    alert("Ошибка при загрузке данных");
  })


// Добавление новой карточки
newPlace.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const name = newPlace.elements["place-name"].value.trim();
  const link = newPlace.elements["link"].value.trim();
  const submitButton = evt.target.querySelector(validationConfig.submitButtonSelector);
  submitButton.textContent = "Сохранение...";
  postCreateCard(name, link)
    .then((data) => {
      if (!name || !link) return;

      const cardData = {
        name: data.name,
        link: data.link,
        likes: data.likes || [],
        _id: data._id,
        owner: data.owner,
      };

      const newCard = createCard(
        cardTemplate,
        cardData,
        userID,
        data._id,
        deleteCard,
        likeCard,
        handleCardImageClick
      );

      newPlace.reset();
      clearValidation(newPlace, validationConfig);
      addCard(newCard);
      closePopup(popupNewCard);
    })
    .catch((error) => {
      console.log("Ошибка при добавлении карточки:", error);
    }).finally(() => {
      submitButton.textContent = "Сохранить";
    });;
});
