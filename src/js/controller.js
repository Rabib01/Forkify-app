import * as model from './model.js';
import recipeView from './Views/recipeView.js';
import searchView from './Views/searchView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './Views/recipeView.js';
import resultsView from './Views/resultsView.js';

if (module.hot) {
  module.hot.accept();
}

console.log('hello');
console.log('hello');
console.log('hello');

const controlRecipes = async function () {
  //loading recipie

  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    // recipeView.renderSpinner();

    await model.loadRecipie(id);

    //rendering recipie
    recipeView.render(model.state.recipe);
    // console.log(model.state.recipe);
    // console.log(resultsView);
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
    resultsView.render(model.state.search.results);
  } catch (error) {
    console.error(error);
  }
};
// controlSearchResults();

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

init();
