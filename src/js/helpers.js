import { TIMEOUT_SECONDS } from './config';

export const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// refactor getJSON and sendJSON because both of them are almost same and call it ajax as both of them are being done by doing an ajax Request

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SECONDS)]);
    if (!response.ok) throw new Error(`${data.message} : ${response.status}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`${error} 😎😎`);
    throw error;
  }
};

/**
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

// SendJSON: function to send data to api
export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SECONDS)]);

    const data = await response.json();
    if (!response.ok) throw new Error(`${data.message} : ${response.status}`);
    return data;
  } catch (error) {
    console.error(`${error} 😎😎`);
    throw error;
  }
};

 -----> Before refactoring*/

/**
 * REMEMBER: promise.race takes in an array of promises and returns the one that is resolved firstly
 */
