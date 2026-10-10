import { useMutation } from '@tanstack/react-query'
import { authService } from './authService'

export function useSignIn() {
  return useMutation({ mutationFn: authService.signIn })
}

export function useSignUp() {
  return useMutation({ mutationFn: authService.signUp })
}
