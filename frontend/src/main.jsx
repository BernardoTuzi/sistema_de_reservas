import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom' // Importar o Router

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Envolver o App com o Router */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)