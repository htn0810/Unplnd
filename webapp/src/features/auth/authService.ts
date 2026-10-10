import type { SignInValues, SignUpValues } from './authSchema'

export type AuthSession = {
  userId: string
  username: string
}

const MOCK_DELAY_MS = 900

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Mock auth until user-service exists. Never stores or logs credentials.
 * Replace with POST /api/v1/users/auth/... via services/apiClient.
 */
export const authService = {
  signIn: async ({ username }: SignInValues): Promise<AuthSession> => {
    await wait(MOCK_DELAY_MS)
    return { userId: 'user_1', username }
  },
  signUp: async ({ username }: SignUpValues): Promise<AuthSession> => {
    await wait(MOCK_DELAY_MS)
    return { userId: 'user_new', username }
  },
}
