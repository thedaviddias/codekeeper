// Test fixture with no as cast violations

interface User {
  name: string
  age: number
}

export function GoodComponent() {
  // These are fine - proper type checking
  const data: User = await fetch('/api/user').then(res => res.json())
  const element = document.getElementById('test')
  
  // Const assertions are allowed
  const colors = ['red', 'blue'] as const
  const config = { theme: 'dark' } as const
  
  return (
    <div>
      <span>{data.name}</span>
      <span>{data.age}</span>
    </div>
  )
}