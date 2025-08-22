// Test fixture with missing JSDoc violations

export interface User {
  name: string
  age: number
}

// Missing JSDoc - should trigger violation
export function calculateAge(birthDate: Date): number {
  return new Date().getFullYear() - birthDate.getFullYear()
}

// Missing JSDoc - should trigger violation  
export class UserService {
  constructor(private apiUrl: string) {}
  
  async getUser(id: string): Promise<User> {
    const response = await fetch(`${this.apiUrl}/users/${id}`)
    return response.json()
  }
}

// Missing JSDoc - should trigger violation
export const useUserData = (userId: string) => {
  return { user: null, loading: true }
}