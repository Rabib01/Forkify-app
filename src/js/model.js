import { async } from 'regenerator-runtime';
import { API_URL } from './config';
import { getJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: { query: '', results: [] },
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

loadSearchResults('pizza');
