import { TIMEOUT_SECONDS } from './config';

export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const response = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]);
    if (!response.ok) throw new Error(`${data.message} : ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`${error} 😎😎`);
    throw error;
  }
};

/**
 * REMEMBER: promise.race takes in an array of promises and returns the one that is resolved firstly
 */
