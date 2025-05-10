// src/hooks/useMovieSource.js
import { getSource } from "../api/htttp/hdrezka";
import kodiWebSocket from "../api/ws/kodiWebSocket";

const useMovieSource = () => {
  const playMovieSource = async ({
    seasonId,
    episodeId,
    movieId,
    translatorId,
    action,
  }) => {
    try {
      const data = await getSource(
        seasonId,
        episodeId,
        movieId,
        translatorId,
        action
      );
      let sourcesArray = [];
      if (Array.isArray(data)) {
        sourcesArray = data;
      } else if (Array.isArray(data.source)) {
        sourcesArray = data.source;
      } else if (Array.isArray(data.sources)) {
        sourcesArray = data.sources;
      } else {
        console.error("Полученные данные не содержат массив источников:", data);
        return false;
      }

      const selectedTranslate = sourcesArray.find(
        (translate) => translate.translate_id === String(translatorId)
      );

      if (!selectedTranslate) {
        console.error(
          "Источник для выбранного переводчика не найден:",
          translatorId
        );
        return false;
      }

      if (
        selectedTranslate.source_links &&
        selectedTranslate.source_links.length > 0
      ) {
        const lastSource =
          selectedTranslate.source_links[
            selectedTranslate.source_links.length - 1
          ];
        if (lastSource && lastSource.url) {
          kodiWebSocket.openFile(lastSource.url);
          return true; // Успешно открыло видео
        } else {
          console.error("URL не найден в последнем источнике", lastSource);
          return false;
        }
      } else {
        console.error("Для выбранного переводчика нет доступных ссылок");
        return false;
      }
    } catch (error) {
      console.error("Ошибка при получении источника:", error);
      return false;
    }
  };

  return { playMovieSource };
};

export default useMovieSource;
