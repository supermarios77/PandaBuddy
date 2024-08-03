import fetch from 'isomorphic-unfetch';

const API_URL = '/api/generate';

export const postRequest = async (prompt: string) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ body: prompt }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return null;
  }
};