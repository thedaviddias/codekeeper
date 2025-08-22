// Test fixture with relative import violations

import React from 'react'
import { Button } from '../../../components/Button'  // Too deep
import { utils } from '../../utils/helpers'           // Should use @/utils
import { Config } from '../../../lib/config'          // Should use @/lib
import { useAuth } from '../../hooks/useAuth'         // Should use @/hooks

// These should be fine
import { validateForm } from './validation'
import { types } from './types'

export function BadImports() {
  return <Button>Test</Button>
}