// Test fixture - simple file that should pass complexity checks

import React from 'react'
import { Button } from '@/components/Button'

/**
 * Simple component with good complexity
 */
export function SimpleComponent() {
  const handleClick = () => {
    console.log('clicked')
  }

  return (
    <div>
      <h1>Simple Component</h1>
      <Button onClick={handleClick}>
        Click me
      </Button>
    </div>
  )
}

/**
 * Another simple function
 */
export function simpleFunction(value: string): string {
  return value.toUpperCase()
}