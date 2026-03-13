import * as model from './model.js';
import recipeView from './Views/recipeView.js';
import searchView from './Views/searchView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './Views/recipeView.js';
import resultsView from './Views/resultsView.js';
import paginationView from './Views/paginationView.js';
// import paginationView from './Views/paginationView.js';

// if (module.hot) {
//   module.hot.accept();
// }

console.log('hello');
console.log('hello');
console.log('hello');

const controlRecipes = async function () {
  //loading recipie

  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    // recipeView.renderSpinner();

    // results view to mark selected results
    resultsView.update(model.getSearchResultsPage());

    await model.loadRecipie(id);

    //rendering recipie
    recipeView.render(model.state.recipe);
    // console.log(model.state.recipe);
    // console.log(resultsView);
    // test
    // controlServings();
  } catch (error) {
    recipeView.renderError(); //error handling
  }
};

const controlSearchResults = async function () {
  try {
    //get search Query
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return;

    //Load Search Results
    await model.loadSearchResults(query);

    // Render Results
    resultsView.render(model.getSearchResultsPage());

    // Render the pagination on each page
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};
// controlSearchResults();

const controlPagination = function (goToPage) {
  // Render new Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // Render the pagination on each page
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update Recipe Servings inthe state
  model.updateRecipeServings(newServings);

  // Update teh Recipe view

  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
};

init();
