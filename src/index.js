import { api } from './api.js';
import { Card } from './card.js';

import { PopupWithImage } from './popup-image.js';
import { Popup } from './popup.js';

const cardsContainer = document.querySelector('.cards');
const btnOpenPopup = document.querySelector('#add');

// кнопка логина
const btnOpenPopupLogin = document.querySelector("#login");

const formCatAdd = document.querySelector('#popup-form-add');
const formLogin = document.querySelector('#popup-form-login');

// куки
const isAuth = Cookies.get("email");

const MAX_LIVE_STORAGE = 10;

const popupAdd = new Popup('popup-add');
const popupImage = new PopupWithImage('popup-cat-image');

// окно авторизации
const popupLogin = new Popup("popup-login");

// сбор данных из формы, заполнение пустого объекта
function serializeForm(elements) {
    const formData = {};

    elements.forEach(input => {
        if (input.type === 'submit' || input.type === 'button') return;
        if (input.type === 'checkbox') {
            formData[input.name] = input.checked;
        }
        if (input.type !== 'checkbox') {
            formData[input.name] = input.value;
        }
    })

    return formData;
}

// создание карточки, метод создания и добавление на страницу
function createCat(dataCat) {
    const newElement = new Card(dataCat, "#card-template", handleClickCatImage);
    cardsContainer.prepend(newElement.getElement());
}

// "слушатель" формы добавления новой карточки
function handleFormAddCat(e) {
    e.preventDefault();
    const elementsFormCat = [...formCatAdd.elements];
    const formData = serializeForm(elementsFormCat);

    // добавление данных на сервер 50 мин. - задание 1
    api.addNewCat(formData)
        .then(function () {
            createCat(formData);
            updateLocalStorage(formData, { type: 'ADD_CAT' });
            popupAdd.close();
        })
        .catch(function (err) {
            console.log(err);
        })
}

function handleClickCatImage(dataSrc) {
    popupImage.open(dataSrc);
}

// метод обработки pop-up окна авторизации
function handleFormLogin(e) {
    e.preventDefault();
    const elementsFormLogin = [...formLogin.elements];
    const formData = serializeForm(elementsFormLogin);
  
    // вызов объекта куки
    Cookies.set("email", formData.email, { expires: 7 });
  
    btnOpenPopup.classList.remove('visually-hidden');
    btnOpenPopupLogin.classList.add('visually-hidden');
  
    // закрыть окно авторизации
    popupLogin.close()
  }

btnOpenPopup.addEventListener('click', (e) => {
    e.preventDefault();
    popupAdd.open();
});

btnOpenPopupLogin.addEventListener("click", (e) => {
    e.preventDefault();
    popupLogin.open();
  });
  
  // запрос о свежести данных  на сервере
  function setDataRefresh(minute, key) {
    // текущая дата
    const setTime = new Date(new Date().getTime() + minute * 60000)
    localStorage.setItem(key, setTime);
    return setTime;
  }
  
  // обновление local storage
  function updateLocalStorage(data, action) { // {type: 'ADD_CAT'} {type: 'ALL_CATS'}
    const oldStorage = JSON.parse(localStorage.getItem('cats'));
  
    switch (action.type) {
      case 'ADD_CAT':
        oldStorage.push(data);
        localStorage.setItem('cats', JSON.stringify(oldStorage));
        return;
      case 'ALL_CATS':
        setDataRefresh(MAX_LIVE_STORAGE, 'catsRefresh');
        localStorage.setItem('cats', JSON.stringify(data));
        return;
      case 'DELETE_CAT':
        const newStorage = oldStorage.filter(cat => cat.id !== data.id)
        localStorage.setItem('cats', JSON.stringify(newStorage));
        return;
      case 'EDIT_CAT':
        const updateStorage = oldStorage.map(cat => cat.id !== data.id ? cat : data)
        localStorage.setItem('cats', JSON.stringify(updateStorage));
        return;
      default:
        break;
    }
  }
  
  // проверка local storage - 2.15
  function checkLocalStorage() {
    const localData = JSON.parse(localStorage.getItem('cats')); //null
  
    const getTimeExpires = localStorage.getItem('catsRefresh'); //
  
    //проверка наличия данных и даты
    if (localData && localData.length && new Date() < new Date(getTimeExpires)) {
      localData.forEach((catData) => {
        createCat(catData);
      });
    } else {
  
      // запрос с сервера 40мин. задание - 1
      api.getAllCats()
        .then(dataCats => {
          dataCats.forEach((catData) => {
            createCat(catData);
          });
          updateLocalStorage(dataCats, { type: 'ALL_CATS' });
        })
        .catch(function (err) {
          console.log(err);
        })
    }
  }
  
  // обработчики событий
  formCatAdd.addEventListener("submit", handleFormAddCat);
  formLogin.addEventListener("submit", handleFormLogin);
  
  // условия для авторизации
  if (!isAuth) {
    popupLogin.open();
    btnOpenPopup.classList.add('visually-hidden');
  } else {
    btnOpenPopupLogin.classList.add('visually-hidden');
  }
  
  
  popupAdd.setEventListener();
  popupImage.setEventListener();
  
  // слушатель авторизации
  popupLogin.setEventListener();
  
  checkLocalStorage()
