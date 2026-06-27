import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config';
import { AJAX } from './helpers.js';

export const state = {
  recipe: {},
  search: { query: '', results: [], resultsPerPage: RES_PER_PAGE, page: 1 },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceURL: recipe.source_url,
    imageURL: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
    /*
    And opereator shortciruits 
    if recipe.key is falsy value in case it doesn't exist 
    nothing happens here. Destructurng does basically nothing 
    if the key does exist then thesecond art of the operator is returned 
    so it is the key object is returned. 
    spread that object to put the values at the end 
    same as if the values were out here : 
    key: recipe.key 
    so this is a nice trick to put it here and this is very handy trick sometimes
    After this we get the key and the bookmark is somehow magically becomes true
    I am such a bad developer
    */
  };
};

export const loadRecipie = async function (id) {
  try {
    // 'https://forkify-api.jonas.io/api/v2/recipes/5ed6604591c37cdc054bc886'
    const data = await AJAX(`${API_URL}${id}`);
    state.recipe = createRecipeObject(data);
    // console.log(data);

    // console.log(state.recipe);
    // console.log(data, response);
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    console.error(`${error} 😎😎`);
    throw error;
  }
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}`);
    // console.log(data);

    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        sourceURL: rec.source_url,
        imageURL: rec.image_url,
      };
    });
    // console.log(state.search.results);
    // reset te page to one whenever we are searching for a recipe on a different page
    state.search.page = 1;
  } catch (error) {
    console.error(`${error} 😎😎`);
    throw error;
  }
};

// loadSearchResults('pizza');

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateRecipeServings = function (newServings) {
  // reach into the state and then change the quantity in each ingredient
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });

  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  // Add bookamrk
  state.bookmarks.push(recipe);

  // mark current recipe as bookamrkes
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // DeleteBookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // mark current recipe as not bookamrked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

// console.log(state.bookmarks);

const clearBookmarks = function () {
  localStorage.removeItem('bookmarks');
};

export const uploadRecipe = async function (newRecipe) {
  //Take raw input data and transform to format that we get out fromapi
  // ingredients array that contains a bunch of objects. Our data has 6 ingredent properties, ingredients separated by comma, each of these ingredients must be converted to one string
  // make data in one array. We use a map. To convert new arrays based on existing data. Convert the object back into array uisng object.entries
  // we want to filter the array that has the first element as ingredient

  // console.log(Object.entries(newRecipe));

  // after this take the data ou2t of the string and then putinto object so we se .map

  // if the quantity does not exist we want it to be null or else we want a number quantity? : +quantity : null

  // we still get undefined if we just put a quantity on ingredient with just 6. It was done by desing for learning purposes and it creates undefined. Therefore our format should be quantity, unit, description in that exact order

  // after ther error is handled we will want to render the error message in the addRecipeView

  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArray = ing[1].replaceAll(' ', '').split(',');
        if (ingArray.length !== 3)
          throw new Error(
            'Wrong Ingredient format, please use the correct format',
          );
        const [quantity, unit, description] = ingArray;
        // return an object with this
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    // console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    // now the id of hte new recipe is the one for our API key

    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }

  // object should be in the same format that the api is ready to recipeView
};
