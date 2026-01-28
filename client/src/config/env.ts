export const env = {
  API_URL: '',
  NODE_ENV: import.meta.env.MODE || "development",
} as const;
