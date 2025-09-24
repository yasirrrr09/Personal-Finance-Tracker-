import axios from "axios";
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
} from "../utils/toast";
import { loaderControl } from "../utils/loaderControl"; // 👈 loader utility

const BASE_URL = "https://expensync-ex0w.onrender.com/api/v1";

// Axios instance
const API = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor → add access token + loader start
API.interceptors.request.use((config) => {
  console.log("📡 [REQUEST]", config.method?.toUpperCase(), config.url, {
    params: config.params,
    data: config.data,
    skipLoader: config.skipLoader,
  });

  if (!config.skipLoader) {
    loaderControl.setLoading(true); // 👈 loader ON only if not skipped
  }

  const token = localStorage.getItem("token");
  if (
    token &&
    !config.url.includes("/auth/login") &&
    !config.url.includes("/auth/signup")
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor → loader stop + handle expired access token
API.interceptors.response.use(
  (response) => {
    console.log("✅ [RESPONSE]", response.config.url, response.data);

    if (!response.config.skipLoader) {
      loaderControl.setLoading(false); // 👈 loader OFF only if not skipped
    }
    return response;
  },
  async (error) => {
    console.error("❌ [ERROR RESPONSE]", {
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });

    if (!error.config?.skipLoader) {
      loaderControl.setLoading(false); // 👈 loader OFF only if not skipped
    }

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token available");

        console.log("♻️ Refreshing access token...");

        // Get new access token
        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("token", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (err) {
        logoutUser();
        showInfoToast("Session expired. Please login again.");
        return Promise.reject(err);
      }
    }

    // Global error handling - only show toasts for certain types of errors
    const msg =
      error.response?.data?.msg ||
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";
    
    // Don't show error toasts for network errors or when backend is unavailable
    // Only show toasts for authentication errors and user action errors
    const shouldShowToast = 
      error.response?.status === 401 || // Authentication errors
      error.response?.status === 403 || // Authorization errors
      error.response?.status === 400 || // Bad request errors
      error.response?.status === 422 || // Validation errors
      (error.response?.status >= 500 && error.response?.status < 600); // Server errors
    
    if (shouldShowToast) {
      showErrorToast(msg);
    } else {
      // Just log network errors and other non-critical errors
      console.warn("API Error (no toast shown):", msg);
    }

    return Promise.reject(error);
  }
);

//
// ✅ Backend check
//
export const checkBackend = async () => {
  console.log("🚀 Calling: checkBackend");
  try {
    const res = await API.get("/");
    console.log("✅ Backend API is running");
    return res.data;
  } catch (err) {
    console.error("❌ Backend error:", err.message);
    throw err;
  }
};

//
// ✅ Auth
//
export const loginUser = async (formData) => {
  console.log("🚀 Calling: loginUser", formData);
  try {
    const res = await API.post("/auth/login", formData);

    localStorage.setItem("token", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);

    showSuccessToast("Login Successful!");
    return res.data;
  } catch (error) {
    showErrorToast("Login Failed");
    throw error;
  }
};

export const logoutUser = () => {
  console.log("🚀 Logging out user...");
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  showInfoToast("Logged out successfully.");
  window.location.href = "/login";
};

export const signupUser = async (formData) => {
  console.log("🚀 Calling: signupUser", formData);
  try {
    const res = await API.post("/auth/signup", formData);
    showSuccessToast("Signup Successful! Please login.");
    return res.data;
  } catch (error) {
    showErrorToast("Signup Failed");
    throw error;
  }
};

//
// ✅ Transactions
//
export const getTransactions = async (
  page = 1,
  limit = 10,
  search = "",
  filter = ""
) => {
  console.log(
    `🚀 Calling: getTransactions | page=${page}, limit=${limit}, search="${search}", filter="${filter}"`
  );
  try {
    const res = await API.get("/transactions", {
      params: { page, limit, search, filter },
    });
    return res.data;
  } catch (error) {
    console.warn("Failed to fetch transactions:", error);
    throw error;
  }
};

export const createTransaction = async (data) => {
  console.log("🚀 Calling: createTransaction", data);
  try {
    const res = await API.post("/transactions/create", data);
    showSuccessToast("Transaction added successfully!");
    return res.data;
  } catch (error) {
    showErrorToast("Failed to add transaction");
    throw error;
  }
};

export const deleteTransaction = async (id) => {
  console.log("🚀 Calling: deleteTransaction", id);
  try {
    const res = await API.delete(`/transactions/${id}`);
    showSuccessToast("Transaction deleted!");
    return res.data;
  } catch (error) {
    showErrorToast("Failed to delete transaction");
    throw error;
  }
};

//
// ✅ Budgets
//
export const fetchBudgets = async () => {
  console.log("🚀 Calling: fetchBudgets");
  try {
    const res = await API.get("/budgets");
    return res.data;
  } catch (error) {
    showErrorToast("Failed to fetch budgets");
    throw error;
  }
};

export const addBudget = async (budgetData) => {
  console.log("🚀 Calling: addBudget", budgetData);
  try {
    const res = await API.post("/budgets", budgetData);
    showSuccessToast("Budget added successfully!");
    return res.data;
  } catch (error) {
    showErrorToast("Failed to add budget");
    throw error;
  }
};

//
// ✅ Debts
//
export const fetchDebts = async () => {
  console.log("🚀 Calling: fetchDebts");
  try {
    const res = await API.get("/debts");
    return res.data;
  } catch (error) {
    console.warn("Failed to fetch debts:", error);
    throw error;
  }
};

export const addDebt = async (debtData) => {
  console.log("🚀 Calling: addDebt", debtData);
  try {
    const res = await API.post("/debts/create", debtData);
    showSuccessToast("Debt added successfully!");
    return res.data;
  } catch (error) {
    showErrorToast("Failed to add debt");
    throw error;
  }
};

export const deleteDebt = async (id) => {
  console.log("🚀 Calling: deleteDebt", id);
  try {
    const res = await API.delete(`/debts/${id}`);
    showSuccessToast("Debt deleted!");
    return res.data;
  } catch (error) {
    showErrorToast("Failed to delete debt");
    throw error;
  }
};

//
// ✅ Budget Summary
//
export const fetchBudgetSummary = async () => {
  console.log("🚀 Calling: fetchBudgetSummary");
  try {
    const res = await API.get("/summary");
    return res.data;
  } catch (error) {
    console.warn("Failed to fetch budget summary:", error);
    throw error;
  }
};

//
// ✅ Category Goals (skip loader)
//
export const fetchCategoryGoals = async () => {
  console.log("🚀 Calling: fetchCategoryGoals");
  try {
    const res = await API.get("/category-goals", { skipLoader: true });
    return res.data;
  } catch (error) {
    console.warn("Failed to fetch category goals:", error);
    throw error;
  }
};

export const setCategoryGoals = async (categoryGoals) => {
  console.log("🚀 Calling: setCategoryGoals", categoryGoals);
  try {
    const res = await API.post(
      "/category-goals/set",
      { categoryGoals },
      { skipLoader: true }
    );
    showSuccessToast("Category goals updated!");
    return res.data;
  } catch (error) {
    showErrorToast("Failed to set category goals");
    throw error;
  }
};

// Get budget tracking with alerts
export const getBudgetTracking = async () => {
  console.log("🚀 Calling: getBudgetTracking");
  try {
    const res = await API.get("/category-goals/tracking", { skipLoader: true });
    return res.data;
  } catch (error) {
    console.warn("Failed to fetch budget tracking:", error);
    throw error;
  }
};

// Get budget alerts
export const getBudgetAlerts = async (isRead = null) => {
  console.log("🚀 Calling: getBudgetAlerts", { isRead });
  try {
    const params = isRead !== null ? { isRead } : {};
    const res = await API.get("/category-goals/alerts", { 
      params,
      skipLoader: true 
    });
    return res.data;
  } catch (error) {
    console.warn("Failed to fetch budget alerts:", error);
    throw error;
  }
};

// Mark alert as read
export const markAlertAsRead = async (alertId) => {
  console.log("🚀 Calling: markAlertAsRead", alertId);
  try {
    const res = await API.put(`/category-goals/alerts/${alertId}/read`, {}, { skipLoader: true });
    return res.data;
  } catch (error) {
    showErrorToast("Failed to mark alert as read");
    throw error;
  }
};

//
// ✅ Smart Suggestions (Python API)
//
const PYTHON_API_URL = "http://localhost:5001";

export const getSmartSuggestions = async (transactions) => {
  console.log("🚀 Calling: getSmartSuggestions", { transactionCount: transactions?.length });
  try {
    const res = await fetch(`${PYTHON_API_URL}/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactions }),
    });
    
    if (!res.ok) {
      throw new Error(`Python API error: ${res.status}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn("Python API error:", error);
    throw error;
  }
};

export const getSuggestionsOnly = async (transactions) => {
  console.log("🚀 Calling: getSuggestionsOnly", { transactionCount: transactions?.length });
  try {
    const res = await fetch(`${PYTHON_API_URL}/suggestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactions }),
    });
    
    if (!res.ok) {
      throw new Error(`Python API error: ${res.status}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn("Python API error:", error);
    throw error;
  }
};

export const getInsightsOnly = async (transactions) => {
  console.log("🚀 Calling: getInsightsOnly", { transactionCount: transactions?.length });
  try {
    const res = await fetch(`${PYTHON_API_URL}/insights`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactions }),
    });
    
    if (!res.ok) {
      throw new Error(`Python API error: ${res.status}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn("Python API error:", error);
    throw error;
  }
};

export const getAISuggestions = async (transactions) => {
  console.log("🚀 Calling: getAISuggestions", { transactionCount: transactions?.length });
  try {
    const res = await fetch(`${PYTHON_API_URL}/ai-suggestions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ transactions }),
    });
    
    if (!res.ok) {
      throw new Error(`Python API error: ${res.status}`);
    }
    
    const data = await res.json();
    return data;
  } catch (error) {
    console.warn("Python API error:", error);
    throw error;
  }
};

//
// ✅ Reminders (skip loader)
//
export const fetchReminders = async () => {
  console.log("🚀 Calling: fetchReminders");
  try {
    const res = await API.get("/reminders", { skipLoader: true });
    return res.data;
  } catch (error) {
    showErrorToast("Failed to fetch reminders");
    throw error;
  }
};

export const addReminder = async (data) => {
  console.log("🚀 Calling: addReminder", data);
  try {
    const res = await API.post("/reminders/create", data, { skipLoader: true });
    showSuccessToast("Reminder added successfully!");
    return res.data;
  } catch (error) {
    showErrorToast("Failed to add reminder");
    throw error;
  }
};

export const deleteReminder = async (id) => {
  console.log("🚀 Calling: deleteReminder", id);
  try {
    const res = await API.delete(`/reminders/${id}`, { skipLoader: true });
    showSuccessToast("Reminder deleted!");
    return res.data;
  } catch (error) {
    showErrorToast(
      error.response?.data?.msg ||
        error.response?.data?.message ||
        "Failed to delete reminder"
    );
    throw error;
  }
};

export default API;
