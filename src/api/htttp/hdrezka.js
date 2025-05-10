import axios from "axios";

// Создаем экземпляр axios с базовой конфигурацией
const apiClient = axios.create({
  baseURL: "http://192.168.0.15:8000/api/v1/rezka/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getPage = async (link) => {
  try {
    const response = await apiClient.get("get_page", {
      params: {
        link: link,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getWatchHistory = async () => {
  try {
    const response = await apiClient.get("get_watch_history", {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Функция для поиска
export const search = async (query) => {
  try {
    const response = await apiClient.get("search", {
      params: { title: query },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Функция для получения детальной информации о фильме по filmLink
export const getMovie = async (filmLink) => {
  try {
    const response = await apiClient.get("get_movie", {
      params: { link: filmLink },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSource = async (
  season_id,
  episode_id,
  movie_id,
  translator_id,
  action
) => {
  try {
    const response = await apiClient.get("get_source", {
      params: {
        film_id: movie_id,
        translator_id: translator_id,
        action: action,
        season_id: season_id,
        episode_id: episode_id,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
