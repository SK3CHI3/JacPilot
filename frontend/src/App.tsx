import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import Homepage from './pages/Homepage'
import Dashboard from './pages/Dashboard'
import LessonViewer from './pages/LessonViewer'
import QuizPage from './pages/QuizPage'
import CodeExercisePage from './pages/CodeExercisePage'
import SkillMapPage from './pages/SkillMapPage'
import './App.css'

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lessons/:id" element={<LessonViewer />} />
          <Route path="/quiz/:id" element={<QuizPage />} />
          <Route path="/code/:id" element={<CodeExercisePage />} />
          <Route path="/skills" element={<SkillMapPage />} />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App
