// src/services/pokemonTCGService.js
const API_BASE_URL = 'https://api.pokemontcg.io/v2';

export const fetchSets = async (queryParams = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/sets?${queryParams}`, {
        method: 'GET',
        headers: {
            'X-Api-Key': import.meta.env.TCG_API_KEY
        },
    });

    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Daten');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('fetchCards error:', error);
    throw error;
  }
};

export const fetchCards = async (queryParams = '') => {
  try {
    const response = await fetch(`${API_BASE_URL}/cards${queryParams}`, {
        method: 'GET',
        headers: {
            'X-Api-Key': import.meta.env.TCG_API_KEY
        },
    });

    
    if (!response.ok) {
      throw new Error('Fehler beim Abrufen der Daten');
    }
    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error('fetchCards error:', error);
    throw error;
  }
};
