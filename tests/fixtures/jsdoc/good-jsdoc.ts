// Test fixture with proper JSDoc

export interface User {
  name: string
  age: number
}

/**
 * Calculates the age based on birth date
 * @param birthDate - The person's birth date
 * @returns The calculated age in years
 */
export function calculateAge(birthDate: Date): number {
  return new Date().getFullYear() - birthDate.getFullYear()
}

/**
 * Service for managing user data
 */
export class UserService {
  constructor(private apiUrl: string) {}
  
  /**
   * Retrieves a user by ID
   * @param id - The user ID
   * @returns Promise that resolves to user data
   */
  async getUser(id: string): Promise<User> {
    const response = await fetch(`${this.apiUrl}/users/${id}`)
    return response.json()
  }
}

/**
 * Hook for fetching user data
 * @param userId - The ID of the user to fetch
 * @returns User data and loading state
 */
export const useUserData = (userId: string) => {
  return { user: null, loading: true }
}