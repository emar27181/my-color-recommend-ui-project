import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import './i18n'
import App from './App.tsx'
import { HelpPage } from './pages/HelpPage.tsx'
import SwipeRecommender from './pages/SwipeRecommender.tsx'
import SnsAnalysisPage from './pages/SnsAnalysisPage.tsx'
import ExperimentIntroPage from './pages/ExperimentIntroPage.tsx'
import ExperimentPage from './pages/ExperimentPage.tsx'
import ExperimentCompletePage from './pages/ExperimentCompletePage.tsx'
import { ToastProvider } from './contexts/ToastContext'
import { TutorialProvider } from './contexts/TutorialContext'
import { Layout } from './components/Layout.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <TutorialProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout><App /></Layout>} />
            <Route path="/help" element={<Layout><HelpPage /></Layout>} />
            <Route path="/swipe" element={<Layout><SwipeRecommender /></Layout>} />
            <Route path="/sns-analysis" element={<Layout><SnsAnalysisPage /></Layout>} />
            <Route path="/experiment" element={<Layout><ExperimentIntroPage /></Layout>} />
            <Route path="/experiment/task" element={<Layout><ExperimentPage /></Layout>} />
            <Route path="/experiment/complete" element={<Layout><ExperimentCompletePage /></Layout>} />
          </Routes>
        </Router>
      </TutorialProvider>
    </ToastProvider>
  </StrictMode>,
)
