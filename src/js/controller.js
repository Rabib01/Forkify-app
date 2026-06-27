import * as model from './model.js';
import searchView from './Views/searchView.js';
import { MODAL_ClOSE_SEC } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './Views/recipeView.js';
import resultsView from './Views/resultsView.js';
import paginationView from './Views/paginationView.js';
import bookmarksView from './Views/bookmarksView.js';
import addRecipeView from './Views/addRecipeView.js';
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
    bookmarksView.update(model.state.bookmarks);

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
  // 1) Add / Remove a bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) Update Recipe View
  recipeView.update(model.state.recipe);

  // 3) Render Booksmarsk
  bookmarksView.update(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  // console.log(newRecipe);
  // upload Recipe data
  try {
    // we are not awaiting hte pronise and so we cannot see the renderError HTML in case of bad format and so we need to make this function an async function and await for thepromise to occur

    // Render spinner for newly uploaded recipes to show the use that something is happening
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    // turning it backto our own format for recipes
    console.log(model.state.recipe);

    /** Render the new recipe */
    recipeView.render(model.state.recipe);

    //display a success message
    addRecipeView.renderMessage();

    // after displaying success message we also want to render the bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change the id of the url by using the history api. PushState() changes url without reloading page. state, title:, url:`#${model.state.recipe.id}`
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // automatically going backto the last page using hte history api using using the back and forward button
    // window.history.back();

    //close form window - not immediately but after sometime to display a nice successful message
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_ClOSE_SEC * 1000);
  } catch (error) {
    console.error('💥', error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
