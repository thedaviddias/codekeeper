// Test fixture - legitimate entry point (should NOT be detected)

import { createApp } from './app'
import { config } from './config'

export function main() {
  const app = createApp(config)
  app.start()
}

// This is a legitimate package entry point, not a barrel file