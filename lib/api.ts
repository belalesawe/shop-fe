import {
  User,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  TokenRefreshResponse,
  ChangePasswordRequest,
  ProfileUpdateRequest,
} from "@/types/auth";
import { Product, Category } from "@/types/product";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ──────────────────────────────────────────────────────────
// Token storage utilities (client-side only)
// ──────────────────────────────────────────────────────────

const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function storeTokens(accessToken: string, refreshToken: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ──────────────────────────────────────────────────────────
// API error class
// ──────────────────────────────────────────────────────────

export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.status = status;
    this.detail = detail;
    this.name = "ApiError";
  }
}

// ──────────────────────────────────────────────────────────
// Base fetch wrapper with auth interceptor
// ──────────────────────────────────────────────────────────

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth: boolean = false
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Attach access token for authenticated requests
  if (requiresAuth) {
    const token = getStoredAccessToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Handle 401 with token refresh
  if (response.status === 401 && requiresAuth) {
    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const newToken = await refreshAccessToken();
        isRefreshing = false;
        onTokenRefreshed(newToken);

        // Retry the original request with new token
        headers["Authorization"] = `Bearer ${newToken}`;
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
          ...options,
          headers,
        });

        if (!retryResponse.ok) {
          const errorData = await retryResponse.json().catch(() => ({}));
          throw new ApiError(
            retryResponse.status,
            errorData.detail || retryResponse.statusText
          );
        }
        return retryResponse.json();
      } catch {
        isRefreshing = false;
        clearTokens();
        throw new ApiError(401, "Session expired. Please log in again.");
      }
    } else {
      // Wait for the ongoing refresh to complete
      return new Promise<T>((resolve, reject) => {
        addRefreshSubscriber(async (newToken: string) => {
          try {
            headers["Authorization"] = `Bearer ${newToken}`;
            const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
              ...options,
              headers,
            });
            if (!retryResponse.ok) {
              const errorData = await retryResponse.json().catch(() => ({}));
              reject(
                new ApiError(
                  retryResponse.status,
                  errorData.detail || retryResponse.statusText
                )
              );
            } else {
              resolve(retryResponse.json());
            }
          } catch (err) {
            reject(err);
          }
        });
      });
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      errorData.detail || response.statusText
    );
  }

  // Handle empty responses (e.g., 204 No Content)
  const text = await response.text();
  if (!text) return {} as T;
  return JSON.parse(text);
}

// ──────────────────────────────────────────────────────────
// Auth API functions
// ──────────────────────────────────────────────────────────

export async function login(request: LoginRequest): Promise<TokenResponse> {
  const data = await fetchApi<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(request),
  });
  storeTokens(data.access_token, data.refresh_token);
  return data;
}

export async function register(
  request: RegisterRequest
): Promise<TokenResponse> {
  const data = await fetchApi<TokenResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(request),
  });
  storeTokens(data.access_token, data.refresh_token);
  return data;
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getStoredRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const data = await fetchApi<TokenRefreshResponse>("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  // Update stored access token
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, data.access_token);
  }
  return data.access_token;
}

export async function getProfile(): Promise<User> {
  return fetchApi<User>("/users/me", {}, true);
}

export async function updateProfile(
  updates: ProfileUpdateRequest
): Promise<User> {
  return fetchApi<User>(
    "/users/me",
    {
      method: "PUT",
      body: JSON.stringify(updates),
    },
    true
  );
}

export async function changePassword(
  request: ChangePasswordRequest
): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(
    "/auth/change-password",
    {
      method: "POST",
      body: JSON.stringify(request),
    },
    true
  );
}

export function logout(): void {
  clearTokens();
}

// ──────────────────────────────────────────────────────────
// Product & Category API functions
// ──────────────────────────────────────────────────────────

export async function fetchProducts(): Promise<Product[]> {
  return fetchApi<Product[]>("/products");
}

export async function fetchProduct(id: number): Promise<Product> {
  return fetchApi<Product>(`/products/${id}`);
}

export async function fetchCategories(): Promise<Category[]> {
  return fetchApi<Category[]>("/categories");
}
