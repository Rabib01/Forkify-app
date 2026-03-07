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

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    // convert the markup coming from this._generateMarkup() into a DOM object that is living in the memory. Creates a virtualDom - lives on our memory instead of the page
    const newDom = document.createRange().createContextualFragment(newMarkup);
    // Array.from() converts the node list into a real array. Then we are basically use a forEach to compare that array
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // console.log(newElements);
    // console.log(curElements);

    // updates changed text
    // handy method that is available on all nodes isEqualNode. Compares the content of one to another node.
    // nodevalue = null if it is element and if it is text, then we get the content of the text node.
    // newEle.firstChild.nodeValue.trim() !== '' → Only to change the text elemetn of the node from 4-5 and not update the entire section for recipes
    // we will only have the text of updateServings from span class = "recipe__info-data recipe__info-data--people">5</span> and .trim() → trims white spaces
    newElements.forEach((newEle, i) => {
      const curEle = curElements[i];
      if (
        !newEle.isEqualNode(curEle) &&
        newEle.firstChild.nodeValue.trim() !== ''
      ) {
        curEle.textContent = newEle.textContent;
      }
      // updates changed attributes → data attribute of the HTML
      // Replacing all of the attributes of the current element by the attributes coming in from the neew elements.
      // This DOM updating alroithm is not a robust algorithm, but it is perfect for smaller applications like this -> Our Instructor → Jonas
      // updates changed attributes
      if (!newEle.isEqualNode(curEle)) {
        Array.from(newEle.attributes).forEach(attr => {
          curEle.setAttribute(attr.name, attr.value);
        });
      }
    });
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
  // consollingData() {
  //   console.log(_data);
  // }
}
