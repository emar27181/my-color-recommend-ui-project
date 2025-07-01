import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { HelpPage } from './pages/HelpPage.tsx'
import SwipeRecommender from './pages/SwipeRecommender.tsx'
import { ToastProvider } from './contexts/ToastContext'
import { TutorialProvider } from './contexts/TutorialContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <TutorialProvider>
        <Router>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/swipe" element={<SwipeRecommender />} />
          </Routes>
        </Router>
      </TutorialProvider>
    </ToastProvider>
  </StrictMode>,
)
