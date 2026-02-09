'use strict';
import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  // render spinner and render error orsuccess messages
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    //adding the event listener to the common parent element which is this._parentElement
    // See all of hte lectures and understand how event listeneres work again
    // The same as the query selector but instead of looking down at the tree it looks up at the tree and looks for parent. We might actually clikck on the span element or the svg instead of clicking on the actual button itself
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      console.log(btn);
      if (!btn) return '';
      const goToPageNum = +btn.dataset.goto;
      handler(goToPageNum);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage,
    );

    // page 1 and there are other pages
    if (currentPage === 1 && numPages > 1) {
      return `
        <button data-goto="${currentPage + 1}" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
          </button>
      `;
    }

    // Last page
    if (currentPage === numPages && numPages > 1) {
      return `
         <button data-goto="${currentPage - 1}"  class="btn--inline pagination__btn--prev">
             <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
             </svg>
            <span>Page ${currentPage - 1}</span> 
        </button>     
      `;
    }

    // Middle pages
    if (currentPage < numPages) {
      return `
         <button data-goto="${currentPage - 1}"  class="btn--inline pagination__btn--prev">
             <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
             </svg>
            <span>Page ${currentPage - 1}</span>
          </button>  

        <button data-goto="${currentPage + 1}"  class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
          </button>      
      `;
    }

    // We are at Page 1 amd therre are no other pages
    return '';
  }
}

export default new PaginationView();
