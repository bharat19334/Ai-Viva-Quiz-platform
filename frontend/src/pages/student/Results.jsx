import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function StudentResults() {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const studentId = localStorage.getItem('user_id')

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/exam/results/${studentId}`)
      setSessions(res.data)
    } catch {
      console.log('Results fetch error')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate('/student')} className="text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1 text-sm">
          ← Back to Dashboard
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">My Results</h2>
        <p className="text-gray-500 mb-6">Your exam performance history</p>

        {loading && <p className="text-gray-400 text-sm">Loading...</p>}

        {!loading && sessions.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-400 mb-4">Koi exam nahi diya abhi tak!</p>
            <button onClick={() => navigate('/student')} className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-xl font-semibold">
              Give Exam
            </button>
          </div>
        )}

        {sessions.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-6 mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-gray-800">{s.course_name}</h3>
                <p className="text-sm text-gray-400">Branch: {s.branch}</p>
                <p className="text-sm text-gray-400">Type: {s.exam_type}</p>
                <p className="text-sm text-gray-400">Date: {new Date(s.started_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-emerald-600">{s.score}</p>
                <p className="text-xs text-gray-400 mb-1">Score</p>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${s.completed ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  {s.completed ? 'Completed' : 'Incomplete'}
                </span>
              </div>
            </div>
            {s.face_flagged && <p className="text-red-500 text-xs mt-3">⚠️ Face not detected during exam</p>}
            {s.voice_flagged && <p className="text-red-500 text-xs mt-1">⚠️ Voice mismatch detected</p>}
          </div>
        ))}
      </div>
    </div>
  )
}