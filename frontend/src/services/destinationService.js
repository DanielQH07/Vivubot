import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getDestinationInfo = async (placeName, type = "thành phố") => {
  try {
    const response = await axios.post(`${API_BASE_URL}/destination`, { placeName, type });
    return response.data;
  } catch (error) {
    console.error('Error fetching destination info:', error);
    throw error;
  }
};

export const extractDestinationFromText = async (placeName, type = "thành phố") => {
  try {
    const result = await getDestinationInfo(placeName, type);
    return result.data;
  } catch (error) {
    console.error('Error extracting destination:', error);
    return null;
  }
};

export const extractDestinationsFromPrompt = async (text) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/destination/multi`, { text });
    return response.data.data; // array of destinations
  } catch (error) {
    console.error('Error extracting destinations:', error);
    return [];
  }
}; 