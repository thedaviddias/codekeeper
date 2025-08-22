/**
 * Test file with unsafe TypeScript as casts
 * This should trigger violations
 */

interface User {
  id: number;
  name: string;
}

// Bad: Unsafe as casts (should be detected)
const user1 = data as User;
const user2 = response as any;
const user3 = value as unknown;
const user4 = items as Array<string>;
const result = (getValue() as MyType);

// Good: Should not trigger violations  
const constants = ['a', 'b', 'c'] as const;
const literalType = 'success' as const;

export default function TestComponent() {
  // More bad as casts
  const parsed = JSON.parse(json) as ParsedData;
  
  return <div>Test</div>;
}