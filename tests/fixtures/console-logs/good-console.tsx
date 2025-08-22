// Good console usage examples (allowed patterns)
import React from 'react'

interface User {
  id: number
  name: string
}

export function GoodConsoleComponent({ user }: { user: User }) {
  const handleClick = () => {
    // Development-only logging (allowed)
    if (process.env.NODE_ENV === 'development') {
      console.log('Button clicked in development', user)
    }
    
    // Proper error logging (allowed)
    console.error('Critical error occurred')
    
    // ESLint disabled (allowed)
    console.log('This is intentional') // eslint-disable-line no-console
  }

  React.useEffect(() => {
    // Debug flag conditional (allowed)
    if (DEBUG) {
      console.log('Debug mode enabled')
    }
    
    // React Native development flag (allowed)
    if (__DEV__) {
      console.log('Development build')
    }
  }, [])

  /* eslint-disable no-console */
  const debugFunction = () => {
    console.log('Block disabled for console')
  }
  /* eslint-enable no-console */

  return (
    <div>
      <h1>{user.name}</h1>
      <button onClick={handleClick}>Click me</button>
    </div>
  )
}