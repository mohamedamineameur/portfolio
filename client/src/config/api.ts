import axios from "axios";
import { env } from "./env.js";

export const apiClient = axios.create({
  baseURL: env.API_URL,
  withCredentials: true,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Si on envoie un FormData (upload), il ne faut pas forcer "application/json".
    // Axios ajoutera automatiquement "multipart/form-data" avec le boundary requis.
    if (config.data instanceof FormData && config.headers) {
      // `config.headers` peut être un objet ou une structure AxiosHeaders selon la version.
      // On supprime les variantes de clé possibles.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const headers = config.headers as any;
      delete headers["Content-Type"];
      delete headers["content-type"];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - could redirect to login
    }
    return Promise.reject(error);
  }
);
