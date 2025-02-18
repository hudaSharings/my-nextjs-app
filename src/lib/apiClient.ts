import axios, { AxiosError } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL || "https://api.example.com";

// Create Axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Send logs to Next.js backend
const logToServer = async (level: "info" | "error" | "warn",message: string,  data?: any) => {
  try {
    await axios.post("/api/logs", {  level,message, data });
  } catch (err) {
    console.error("Failed to log:", err);
  }
};

// Request interceptor (Logs API requests)
apiClient.interceptors.request.use(
  (config) => {
    logToServer("info",`API Request: ${config.url}`,  config);
    return config;
  },
  (error) => {
    logToServer( "error", `Request Error: ${error.message}`,error);
    return Promise.reject(error);
  }
);

// Response interceptor (Logs API responses)
apiClient.interceptors.response.use(
  (response) => {
    logToServer("info",`API Response: ${response.config.url}`,  response.data);
    return response;
  },
  (error: AxiosError) => {
    logToServer("error",`Response Error: ${error.message}`,  error.response?.data);
    return Promise.reject(error);
  }
);

export default apiClient;
export { logToServer };
