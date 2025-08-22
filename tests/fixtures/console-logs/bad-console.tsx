// Bad console usage examples
import React from 'react'

interface User {
  id: number
  name: string
}

export function BadConsoleComponent({ user }: { user: User }) {
  console.log('Component rendered')
  console.warn('This is a warning')
  
  const handleClick = () => {
    console.log('Button clicked', user)
    console.error('This should not be here')
    console.info('Information message')
    console.debug('Debug message')
    console.trace('Trace message')
  }

  React.useEffect(() => {
    console.log('Effect running')
  }, [])

  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={handleClick}>Click me</button>
    </div>
  )
}