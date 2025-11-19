import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { UserProvider } from './contexts/UserContext'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import LessonsPage from './pages/LessonsPage'
import LessonViewer from './pages/LessonViewer'
import QuizIndexPage from './pages/QuizIndexPage'
import QuizPage from './pages/QuizPage'
import CodeIndexPage from './pages/CodeIndexPage'
import CodeExercisePage from './pages/CodeExercisePage'
import SkillMapPage from './pages/SkillMapPage'
import SettingsPage from './pages/SettingsPage'
import './App.css'

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/lessons" element={<LessonsPage />} />
          <Route path="/lessons/:id" element={<LessonViewer />} />
          <Route path="/quiz" element={<QuizIndexPage />} />
          <Route path="/quiz/:id" element={<QuizPage />} />
          <Route path="/code" element={<CodeIndexPage />} />
          <Route path="/code/:id" element={<CodeExercisePage />} />
          <Route path="/skills" element={<SkillMapPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App
