import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TagOptionsProvider } from './contexts/TagOptionsContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TagOptionsProvider>
      <App />
    </TagOptionsProvider>
  </StrictMode>,
)
