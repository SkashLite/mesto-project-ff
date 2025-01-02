import { delCard , addLike, delLike} from "./api.js";

export function createCard(
  cardTemplate,
  element,
  userID,
  cardID,
  deleteCard,
  likeCard,
  handleCardImageClick
) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeBtn = cardElement.querySelector(".card__like-button");
  const cardImg = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikeCounter = cardElement.querySelector(".card__like-counter");

  cardImg.src = element.link || "";
  cardImg.alt = element.name || "Изображение";
  cardTitle.textContent = element.name || "Без названия";

  cardLikeCounter.textContent = element.likes?.length || 0;

  const hasLiked = element.likes.some((like) => like._id === userID);

  if (userID === element.owner._id) {
    deleteButton.classList.add("visible");
  }

  cardImg.addEventListener("click", () =>
    handleCardImageClick(element.link, element.name)
  );

  deleteButton.addEventListener("click", () => {
    deleteCard(cardElement, cardID);
  });

  likeBtn.addEventListener("click", () => {
    
    likeCard(cardID, likeBtn, cardLikeCounter, userID);

  });

  if(hasLiked){
    likeBtn.classList.add("card__like-button_is-active")
  }else {
    likeBtn.classList.remove("card__like-button_is-active")
  }

  return cardElement;
}

export function likeCard(cardId, likeBtn, cardLikeCounter, userId) {
  let hasLiked = likeBtn.classList.contains("card__like-button_is-active");

  if (hasLiked) {
    delLike(cardId)
      .then((data) => {
        likeBtn.classList.remove("card__like-button_is-active");
        cardLikeCounter.textContent = data.likes.length;
      })
      .catch((err) => {
        console.error("Ошибка при удалении лайка:", err);
      });
  } else {
    addLike(cardId)
      .then((data) => {
        likeBtn.classList.add("card__like-button_is-active");
        cardLikeCounter.textContent = data.likes.length;
      })
      .catch((err) => {
        console.error("Ошибка при добавлении лайка:", err);
      });
  }
}

export function deleteCard(cardElement, cardId) {
  delCard(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => console.error(`Ошибка удаления карточки: ${err}`));
}
