import { apiClient } from "@/lib/api/client"

/** Credentials collected by the login form; never persisted or logged. */
export interface LoginCredentials {
  email: string
  password: string
}

/** The only user representation the frontend may hold: no token, roles,
 *  permissions, or cookie data. */
export interface PublicAdminUser {
  id: string
  name: string
  email: string
}

export interface AuthSuccessEnvelope {
  success: true
  data: { user: PublicAdminUser }
}

export interface AuthErrorEnvelope {
  success: false
  message: string
}

export type AuthEnvelope = AuthSuccessEnvelope | AuthErrorEnvelope

export interface LogoutResult {
  success: true
  message: string
}

/**
 * POST /auth/login — validates credentials on the backend, which sets the
 * HTTP-only session cookie. Returns only the public user.
 */
export async function login(credentials: LoginCredentials): Promise<PublicAdminUser> {
  const { data } = await apiClient.post<AuthSuccessEnvelope>("/auth/login", credentials)
  return data.data.user
}

/**
 * GET /auth/me — verifies the backend session and returns the public user.
 * This is the authoritative session check before any protected render.
 */
export async function getCurrentAdmin(): Promise<PublicAdminUser> {
  const { data } = await apiClient.get<AuthSuccessEnvelope>("/auth/me")
  return data.data.user
}

/**
 * POST /auth/logout — ends the backend session (idempotent). Returns only
 * the backend success result; the cookie is cleared by the backend.
 */
export async function logout(): Promise<LogoutResult> {
  const { data } = await apiClient.post<LogoutResult>("/auth/logout")
  return data
}