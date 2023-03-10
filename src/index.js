const cardsContainer = document.querySelector('.cards');
const btnOpenPopup = document.querySelector('.btn');
const formCatAdd = document.querySelector('#popup-form-add');

const popupAdd = new Popup('popup-add');
const popupImage = new PopupWithImage('popup-cat-image');

// сбор данных из формы, заполнение пустого объекта
function serializeForm(elements) {
    const formData = {};

    elements.forEach(input => {
        if (input.type === 'submit' || input.type === 'button') return
        if (input.type === 'checkbox') {
            formData[input.name] = input.checked;
        }
        if (input.type !== 'checkbox') {
            formData[input.name] = input.value;
        }
    })

    return formData;
}

// "слушатель" формы добавления новой карточки
function handleFormAddCat(e) {
    e.preventDefault();
    const elementsFormCat = [...formCatAdd.elements];
    const formData = serializeForm(elementsFormCat);
    //  ¯\_(ツ)_/¯
    const newElement = new Card(formData, '#card-template', handleClickCatImage);
    cardsContainer.prepend(newElement.getElement());

    popupAdd.close();
}

function handleClickCatImage(dataSrc) {
    popupImage.open(dataSrc)
}

formCatAdd.addEventListener('submit', handleFormAddCat)

btnOpenPopup.addEventListener('click', (e) => {
    e.preventDefault();
    popupAdd.open()
})

// перебор карточек из основного массива и вывод на главную
cats.forEach(catData => {
    const newElement = new Card(catData, '#card-template', handleClickCatImage);
    cardsContainer.append(newElement.getElement());
});

popupAdd.setEventListener();
popupImage.setEventListener();

