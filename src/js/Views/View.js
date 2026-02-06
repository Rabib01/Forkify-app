import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  render(data) {
    //guard clause to render error by checking for whether the data is an array or empty
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    // everything else
    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  // parameternameandthe function name should not be confused. AddHandleRender is the publisher and controlRecipes is the subscriber why is the parameter not called a subsctriber? Anyway namewhateveryoufuckingwant

  renderError(message = this._errorMessage) {
    const markup = `
        <div class="error">
          <div>
          <svg>
          <use href="${icons}#icon-alert-triangle"></use>
          </svg>
          </div>
          <p>${message}.</p>
          </div>
                `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSuccess(message = this._message) {
    const markup = `
        <div class="message">
        <div>
        <svg>
        <use href="${icons}#icon-smile"></use>
        </svg>
        </div>
                <p>${message}. Please try again!</p>
                </div>
                `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
        </div>
              `;
    //adding the htmltohtedom as achildof theparentelement
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
