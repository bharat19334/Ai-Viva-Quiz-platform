import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function TeacherResults() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const courseId = localStorage.getItem('courseId')

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/exam/course-results/${courseId}`)
      setSessions(res.data)
    } catch {
      console.log('Error fetching results')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate('/teacher')} className="text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1 text-sm">
          ← Back to Dashboard
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">Student Results</h2>
        <p className="text-gray-500 mb-6">Performance overview for your latest session</p>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}

        {!loading && sessions.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-400">Koi student ne abhi exam nahi diya!</p>
          </div>
        )}

        {sessions.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-6 mb-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                  {s.student_name?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{s.student_name}</h3>
                  <p className="text-sm text-gray-400">{s.student_email}</p>
                  <p className="text-sm text-gray-400">Type: {s.exam_type} • {new Date(s.started_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-indigo-600">{s.score}</p>
                <p className="text-xs text-gray-400 mb-1">Score</p>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${s.completed ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {s.completed ? 'Completed' : 'Incomplete'}
                </span>
              </div>
            </div>
            {s.face_flagged && <p className="text-red-500 text-xs mt-3">⚠️ Face not detected</p>}
            {s.voice_flagged && <p className="text-red-500 text-xs mt-1">⚠️ Voice mismatch</p>}
          </div>
        ))}
      </div>
    </div>
  )
}