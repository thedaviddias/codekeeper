// Test fixture with as cast violations

interface User {
  name: string
  age: number
}

export function BadComponent() {
  // These should trigger violations
  const data = fetch('/api/user') as any
  const user = data as User
  const element = document.getElementById('test') as HTMLElement
  const config = process.env as any
  
  // This should be allowed (const assertion)
  const colors = ['red', 'blue'] as const
  
  return (
    <div>
      <span>{user.name}</span>
      <span>{(user.age as any).toString()}</span>
    </div>
  )
}