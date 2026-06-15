import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/auth/Login'
import TeacherDashboard from './pages/teacher/Dashboard'
import CreateCourse from './pages/teacher/CreateCourse'
import UploadPDF from './pages/teacher/UploadPDF'
import TeacherResults from './pages/teacher/Results'
import StudentDashboard from './pages/student/Dashboard'
import StudentResults from './pages/student/Results'
import SuperAdminDashboard from './pages/superadmin/Dashboard'
import ExamRoom from './pages/student/ExamRoom'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/teacher" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/teacher/create-course" element={<ProtectedRoute role="teacher"><CreateCourse /></ProtectedRoute>} />
        <Route path="/teacher/upload-pdf" element={<ProtectedRoute role="teacher"><UploadPDF /></ProtectedRoute>} />
        <Route path="/teacher/results" element={<ProtectedRoute role="teacher"><TeacherResults /></ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/exam" element={<ProtectedRoute role="student"><ExamRoom /></ProtectedRoute>} />
        <Route path="/student/results" element={<ProtectedRoute role="student"><StudentResults /></ProtectedRoute>} />
        <Route path="/superadmin" element={<ProtectedRoute role="superadmin"><SuperAdminDashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App