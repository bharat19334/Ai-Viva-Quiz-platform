import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function StudentDashboard() {
  const navigate = useNavigate()
  const name = localStorage.getItem('name')
  const [branch, setBranch] = useState('')
  const [courses, setCourses] = useState([])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  const fetchCourses = async (b) => {
    if (!b) return
    const res = await axios.get(`http://127.0.0.1:8000/courses/filter?branch=${b}`)
    setCourses(res.data)
  }

  const startExam = async (courseId) => {
    const studentId = localStorage.getItem('user_id')
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/exam/start?student_id=${studentId}&course_id=${courseId}&exam_type=quiz`
      )
      localStorage.setItem('sessionId', res.data.session_id)
      localStorage.setItem('courseId', courseId)
      navigate('/student/exam')
    } catch {
      alert('Exam start nahi hua!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white text-xl">🎓</div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">AI Assessment Platform</h1>
            <p className="text-xs text-gray-400">Student Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-700">{name}</p>
            <p className="text-xs text-gray-400">Student</p>
          </div>
          <button onClick={handleLogout} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition text-sm">
            Logout
          </button>
        </div>
      </nav>

      <div className="p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome, {name?.split(' ')[0]} 👋</h2>
        <p className="text-gray-500 mb-6">Select your branch to see available exams</p>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Branch / Course</label>
          <select
            value={branch}
            onChange={e => { setBranch(e.target.value); fetchCourses(e.target.value) }}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
          >
            <option value="">Select Branch</option>
            <optgroup label="B.Tech (Engineering)">
              <option value="CSE">CSE - Core</option>
              <option value="CSE-AIML">CSE - AI & ML</option>
              <option value="CSE-FSD">CSE - Full Stack Dev & Cloud</option>
              <option value="CSE-CYBER">CSE - Cyber Security & Cloud</option>
              <option value="ECE">ECE</option>
              <option value="ME">Mechanical Engineering</option>
              <option value="CE">Civil Engineering</option>
              <option value="EE">Electrical Engineering</option>
            </optgroup>
            <optgroup label="Computer Applications">
              <option value="BCA">BCA</option>
            </optgroup>
            <optgroup label="Management & Commerce">
              <option value="BBA">BBA</option>
              <option value="BCom">B.Com</option>
              <option value="MBA">MBA</option>
            </optgroup>
            <optgroup label="Pharmacy">
              <option value="BPharm">B.Pharma</option>
              <option value="DPharm">D.Pharma</option>
            </optgroup>
            <optgroup label="Agriculture">
              <option value="BSc-Agri">B.Sc. Agriculture</option>
            </optgroup>
            <optgroup label="Sciences">
              <option value="BSc-Physics">B.Sc. Physics</option>
              <option value="BSc-Chemistry">B.Sc. Chemistry</option>
              <option value="BSc-Maths">B.Sc. Mathematics</option>
              <option value="BSc-Biotech">B.Sc. Biotechnology</option>
            </optgroup>
            <optgroup label="Law & Arts">
              <option value="LLB">LLB</option>
              <option value="BA">BA</option>
            </optgroup>
          </select>
        </div>

        {branch && (
          <>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Available Exams</h3>
            {courses.length === 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-gray-400">Koi exam available nahi hai abhi is branch ke liye!</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {courses.map((c) => (
                <div key={c.id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6">
                  <h4 className="font-bold text-gray-800 mb-1">{c.name}</h4>
                  <p className="text-sm text-gray-400 mb-4">Branch: {c.branch}</p>
                  <button onClick={() => startExam(c.id)} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-2 rounded-xl font-semibold hover:opacity-90 transition text-sm">
                    Start Exam
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        <div onClick={() => navigate('/student/results')} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <div className="p-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-2xl mb-3">📊</div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">My Results</h3>
            <p className="text-gray-400 text-sm">View your past exam scores</p>
          </div>
        </div>
      </div>
    </div>
  )
}