import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE } from './config';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: { query: '', results: [], resultsPerPage: RES_PER_PAGE, page: 1 },
};

export const loadRecipie = async function (id) {
  try {
    // 'https://forkify-api.jonas.io/api/v2/recipes/5ed6604591c37cdc054bc886'
    const data = await getJSON(`${API_URL}${id}`);
    // console.log(data);

    const { recipe } = data.data;

    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceURL: recipe.source_url,
      imageURL: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    // console.log(state.recipe);
    // console.log(data, response);
  } catch (error) {
    console.error(`${error} 😎😎`);
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
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
