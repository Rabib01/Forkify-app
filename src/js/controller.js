/**
 * In themodelwe want to import everything,there are named exportsand default exports
 * the named exports are the ones in which weexplicitly gavethemaname
 * import * as model from 'model.js' → then we can have avvessto model.state and model.loadRecipe()
 *
 */
import * as model from './model.js';
import recipeView from './Views/displayRecipieView.js';
import searchView from './Views/searchView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import displayRecipieView from './Views/displayRecipieView.js';
// import View from './Views.js';

// console.log(icons);

// const recipeContainer = document.querySelector('.recipe');

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

console.log('hello');
console.log('hello');
console.log('hello');

const controlRecipes = async function () {
  //loading recipie

  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    await model.loadRecipie(id);

    //rendering recipie
    displayRecipieView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError(); //error handling
  }
};

const controlSearchResults = async function () {
  try {
    //get search Query
    const query = searchView.getQuery();
    if (!query) return;

    //Load Search Results
    await model.loadSearchResults(query);

    // Render Results
    console.log(model.state.search.results);
  } catch (error) {
    console.error(error);
  }
};
controlSearchResults();

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

init();
