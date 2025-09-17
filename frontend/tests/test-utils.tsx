import React from 'react'
import { render } from '@testing-library/react'
import { TagOptionsProvider } from '../src/contexts/TagOptionsContext'

export function renderWithProviders(ui: React.ReactElement) {
  return render(<TagOptionsProvider>{ui}</TagOptionsProvider>)
}

export * from '@testing-library/react'

