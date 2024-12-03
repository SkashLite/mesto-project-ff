export function createCard(
  cardTemplate,
  element,
  deleteCard,
  likeCard,
  handleCardImageClick
) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeBtn = cardElement.querySelector(".card__like-button");
  const cardImg = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  cardImg.src = element.link;
  cardImg.alt = element.name;
  cardTitle.textContent = element.name;

  cardImg.addEventListener("click", () =>
    handleCardImageClick(element.link, element.name)
  );

  deleteButton.addEventListener("click", () => {
    deleteCard(cardElement);
  });

  likeBtn.addEventListener("click", () => {
    likeCard(likeBtn);
  });

  return cardElement;
}

export function likeCard(cardElement) {
  cardElement.classList.toggle("card__like-button_is-active");
}

export function deleteCard(cardElement) {
  cardElement.remove();
}
