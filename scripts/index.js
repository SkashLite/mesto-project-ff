const cardTemplate = document.querySelector("#card-template").content;

const placesList = document.querySelector(".places__list");

function createCard(cardTemplate, element) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const deleteButton = cardElement.querySelector(".card__delete-button");
  cardElement.querySelector(".card__image").src = element.link;
  cardElement.querySelector(".card__title").textContent = element.name;
 
  deleteButton.addEventListener("click", function () {
    delCard(cardElement);
  });

  return cardElement;
}

function delCard (cardElement) { 
  cardElement.remove();
}

initialCards.forEach((element) => {
  const cardElement = createCard(cardTemplate, element);
  placesList.append(cardElement);
});
