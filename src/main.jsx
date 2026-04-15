import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SimulationProvider } from './context/SimulationContext.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SimulationProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SimulationProvider>
  </StrictMode>,
)
