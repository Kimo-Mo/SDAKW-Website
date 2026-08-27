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
  data: {
    user: PublicAdminUser
    token?: string
  }
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
 * HTTP-only session cookie and returns the public user with token.
 */
export async function login(credentials: LoginCredentials): Promise<PublicAdminUser> {
  const { data } = await apiClient.post<AuthSuccessEnvelope>("/auth/login", credentials)
  if (typeof window !== 'undefined' && data.data.token) {
    localStorage.setItem('auth_token', data.data.token)
  }
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
 * POST /auth/logout — ends the backend session (idempotent). Clears both
 * the client token fallback and the backend cookie.
 */
export async function logout(): Promise<LogoutResult> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
  }
  const { data } = await apiClient.post<LogoutResult>("/auth/logout")
  return data
}

export interface ChangePasswordPayload {
  currentPassword: string
  newPassword: string
}

export interface ChangePasswordResult {
  success: true
  message: string
  data?: {
    token?: string
  }
}

/**
 * PATCH /auth/change-password — changes the admin's password and rotates the
 * session cookie automatically on the backend.
 */
export async function changePassword(
  payload: ChangePasswordPayload
): Promise<ChangePasswordResult> {
  const { data } = await apiClient.patch<ChangePasswordResult>(
    "/auth/change-password",
    payload
  )
  if (typeof window !== 'undefined' && data.data?.token) {
    localStorage.setItem('auth_token', data.data.token)
  }
  return data
}