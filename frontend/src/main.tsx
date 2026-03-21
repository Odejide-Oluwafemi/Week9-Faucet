import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RunnersProvider } from './context/RunnersContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RunnersProvider>
      <App />
    </RunnersProvider>
  </StrictMode>,
)
