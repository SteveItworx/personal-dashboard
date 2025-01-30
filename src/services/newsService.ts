import axios from "axios";

const API_KEY = "4044b8a3758e4abfb9a69ec4e01c994c"; 
const BASE_URL = "https://newsapi.org/v2/top-headlines";

// Fetch news by category
export const fetchNews = async (category: string) => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        category,
        country: "us", // Fetch news for the US (change as needed)
        apiKey: API_KEY,
      },
    });
    return response.data.articles;
  } catch (error) {
    console.error("Error fetching news:", error);
    throw error;
  }
};
