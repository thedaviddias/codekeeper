/**
 * Test file with missing JSDoc - should trigger violations
 */

// This function is missing JSDoc (should be detected)
function calculateTotal(price: number, tax: number): number {
  return price + (price * tax);
}

// This function is also missing JSDoc (should be detected)
const processData = (data: any[]) => {
  return data.filter(item => item !== null);
};

// This class is missing JSDoc (should be detected)
class UserManager {
  private users: string[] = [];
  
  addUser(user: string) {
    this.users.push(user);
  }
}

// This function has JSDoc (should NOT be detected)
/**
 * Properly documented function
 * @param value - The input value
 * @returns The processed result
 */
function wellDocumented(value: string): string {
  return value.toUpperCase();
}