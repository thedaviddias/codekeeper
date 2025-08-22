// Test fixture with good import patterns

import React from 'react'
import { Button } from '@/components/Button'     // Good - uses alias
import { utils } from '@/utils/helpers'         // Good - uses alias
import { Config } from '@/lib/config'           // Good - uses alias
import { useAuth } from '@/hooks/useAuth'       // Good - uses alias

// Local imports are fine
import { validateForm } from './validation'
import { types } from './types'

export function GoodImports() {
  return <Button>Test</Button>
}