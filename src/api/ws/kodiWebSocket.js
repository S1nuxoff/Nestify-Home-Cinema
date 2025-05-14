import config from "../../core/config";

class Emitter {
  constructor() {
    this.handlers = {};
  }
  on(eventName, callback) {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(callback);
  }
  off(eventName, callback) {
    if (!this.handlers[eventName]) return;
    this.handlers[eventName] = this.handlers[eventName].filter(
      (cb) => cb !== callback
    );
  }
  emit(eventName, data) {
    if (!this.handlers[eventName]) return;
    this.handlers[eventName].forEach((cb) => cb(data));
  }
}

const emitter = new Emitter();
const KODI_WS_URL = config.kodi_url;

const kodiWebSocket = {
  ws: null,
  isConnected: false,
  playerId: null,

  init() {
    if (this.ws) {
      console.warn("[kodiWebSocket] Already initialized!");
      return;
    }
    this.ws = new WebSocket(KODI_WS_URL);

    this.ws.onopen = () => {
      console.log("[Kodi WS] Connected!");
      this.isConnected = true;
      this.reconnectAttempts = 0; // сбрасываем счетчик попыток
      this.requestActivePlayer();
      this.requestVolume();
      emitter.emit("connected", true);
    };

    this.ws.onclose = () => {
      console.log("[Kodi WS] Disconnected.");
      this.isConnected = false;
      emitter.emit("connected", false);
      this.ws = null;
      // Вычисляем задержку с экспоненциальным backoff (например, 5 * 2^attempt секунд)
      const delay = 5000 * Math.pow(2, this.reconnectAttempts);
      this.reconnectAttempts = this.reconnectAttempts + 1;
      console.log(
        `[Kodi WS] Attempting to reconnect in ${delay / 1000} seconds...`
      );
      setTimeout(() => {
        this.init();
      }, delay);
    };

    this.ws.onerror = (err) => {
      console.error("[Kodi WS] Error:", err);
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.id) {
          this.handleResponse(data);
        } else if (data.method) {
          this.handleNotification(data);
        }
      } catch (err) {
        console.error("Failed to parse Kodi response:", err);
      }
    };
  },
  handleResponse(data) {
    // Обработка ответа для запроса активного плеера (id=101)
    if (data.id === 101 && data.result) {
      if (data.result.length > 0) {
        this.playerId = data.result[0].playerid;
      } else {
        this.playerId = null;
      }
      emitter.emit("playerIdChange", this.playerId);
    }
    // Обработка ответа для запроса свойств плеера (id=102)
    else if (data.id === 102 && data.result) {
      emitter.emit("playerProperties", data.result);
    }
    // Обработка ответа для запроса громкости (id=230)
    else if (data.id === 230 && data.result) {
      emitter.emit("applicationProperties", data.result);
    }
    // Другие ответы...
    if (data.id === 500 && data.result) {
      emitter.emit("moviesList", data.result.movies || []);
    }
    if (data.id === 501 && data.result) {
      emitter.emit("directoryList", data.result.files || []);
    }
  },

  handleNotification(data) {
    console.log("[Kodi Notification]", data.method, data.params);
    if (data.method === "Player.OnStop") {
      this.playerId = null;
      emitter.emit("playerIdChange", this.playerId);

      // Отправка HTTP-запроса при остановке плеера
      fetch(`${config.backend_url}/api/v1/session/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: "player_stopped" }),
      })
        .then((response) => {
          if (!response.ok) {
            console.error(
              "Failed to notify session removal:",
              response.statusText
            );
          } else {
            console.log("Session removal notified successfully.");
          }
        })
        .catch((error) => {
          console.error("Error notifying session removal:", error);
        });
    }
    if (data.method === "Player.OnPlay") {
      // При получении события запуска воспроизведения запрашиваем активный плеер
      console.log("Player.OnPlay event received, requesting active player...");
      this.requestActivePlayer();
    }
    emitter.emit("notification", data);
  },

  sendJsonRpc(method, params = {}, requestId = 1) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn("[kodiWebSocket] WebSocket not connected.");
      return;
    }
    const message = {
      jsonrpc: "2.0",
      id: requestId,
      method,
      params,
    };
    this.ws.send(JSON.stringify(message));
  },

  requestActivePlayer() {
    this.sendJsonRpc("Player.GetActivePlayers", {}, 101);
  },

  requestPlayerProperties(playerId) {
    const params = {
      playerid: playerId,
      properties: ["time", "totaltime", "speed", "percentage", "position"],
    };
    this.sendJsonRpc("Player.GetProperties", params, 102);
  },

  // Новый метод для получения громкости
  requestVolume() {
    this.sendJsonRpc(
      "Application.GetProperties",
      { properties: ["volume"] },
      230
    );
  },

  playPause() {
    if (this.playerId !== null) {
      this.sendJsonRpc("Player.PlayPause", { playerid: this.playerId }, 200);
    }
  },

  seek(seconds) {
    if (this.playerId !== null) {
      this.sendJsonRpc(
        "Player.Seek",
        { playerid: this.playerId, value: { seconds } },
        201
      );
    }
  },

  seekAbsolute(hours, minutes, seconds) {
    if (this.playerId !== null) {
      this.sendJsonRpc(
        "Player.Seek",
        {
          playerid: this.playerId,
          value: { time: { hours, minutes, seconds } },
        },
        202
      );
    }
  },

  getMovies() {
    this.sendJsonRpc(
      "VideoLibrary.GetMovies",
      {
        properties: ["title", "year", "thumbnail", "file", "runtime"],
      },
      500
    );
  },

  getDirectory(path) {
    this.sendJsonRpc(
      "Files.GetDirectory",
      {
        directory: path,
        media: "video",
      },
      501
    );
  },

  openFile(url) {
    this.sendJsonRpc(
      "Player.Open",
      {
        item: { file: url },
      },
      300
    );
  },

  stop() {
    if (this.playerId !== null) {
      this.sendJsonRpc("Player.Stop", { playerid: this.playerId }, 210);
    }
  },

  setVolume(volume) {
    // Передаём значение громкости (0-100)
    this.sendJsonRpc("Application.SetVolume", { volume }, 220);
  },

  on(eventName, cb) {
    emitter.on(eventName, cb);
  },
  off(eventName, cb) {
    emitter.off(eventName, cb);
  },
};

export default kodiWebSocket;
