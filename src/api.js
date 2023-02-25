const config = {
  baseUrl: "https://cats.petiteweb.dev/api/single/nvmbrfrst",
  headers: {
    "content-type": "application/json"
  }
}

class Api {
  #getResponse(res) {
    return res.ok ? res.json() : Promise.reject();
  }

  #baseUrl;
  #headers;

  constructor(config) {
    (this.#baseUrl = config.baseUrl), (this.#headers = config.headers);
  }


  // GET https://cats.petiteweb.dev/api/single/nvmbrfrst/show - отобразить всех котов
  getAllCats() {
    return fetch(`${this.#baseUrl}/show`).then(this.#getResponse);
  }

  // GET https://cats.petiteweb.dev/api/single/nvmbrfrst/show/:id  - отобразить конкретного кота
  getCatById(idCat) {
    return fetch(`${this.#baseUrl}/show/${idCat}`).then(this.#getResponse);
  }

  // GET https://cats.petiteweb.dev/api/single/nvmbrfrst/ids - отобразить все возможные айди котов
  getIdsCats() {
    return fetch(`${this.#baseUrl}/ids`).then(this.#getResponse);
  }

  // POST https://cats.petiteweb.dev/api/single/nvmbrfrst/add - добавить кота
  addNewCat(data) {
    return fetch(`${this.#baseUrl}/add`, {
      method: 'POST',
      headers: this.#headers,
      body: JSON.stringify(data)
    }).then(this.#getResponse);
  }

  // PUT https://cats.petiteweb.dev/api/single/nvmbrfrst/update/:id - изменить информацию о коте
  updateCatById(idCat, data) {
    return fetch(`${this.#baseUrl}/update/${idCat}`, {
      method: "PUT",
      headers: this.#headers,
      body: JSON.stringify(data)
    }).then(this.#getResponse);
  }

  // DELETE  https://cats.petiteweb.dev/api/single/:user/delete/:id - удалить кота из базы данных
  deleteCatById(idCat) {
    return fetch(`${this.#baseUrl}/delete/${idCat}`, {
      method: "DELETE"
    }).then(this.#getResponse);
  }
}

const api = new Api(config);
