import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function CreateCourse() {
  const [sessionName, setSessionName] = useState('')
  const [branch, setBranch] = useState('')
  const [semester, setSemester] = useState('')
  const [subject, setSubject] = useState('')
  const [numQuestions, setNumQuestions] = useState(5)
  const [marksPerQuestion, setMarksPerQuestion] = useState(10)
  const [timeLimit, setTimeLimit] = useState(30)
  const [msg, setMsg] = useState('')
  const navigate = useNavigate()

  const handleCreate = async () => {
    const teacherId = localStorage.getItem('user_id')
    if (!sessionName || !branch || !semester || !subject) {
      setMsg('❌ Saare fields fill karo!')
      return
    }
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/courses/create?name=${sessionName}&branch=${branch}&teacher_id=${teacherId}&subject=${subject}&semester=${semester}`
      )
      localStorage.setItem('courseId', res.data.course_id)
      localStorage.setItem('numQuestions', numQuestions)
      localStorage.setItem('marksPerQuestion', marksPerQuestion)
      localStorage.setItem('timeLimit', timeLimit)
      localStorage.setItem('subject', subject)
      localStorage.setItem('semester', semester)
      setMsg(`✅ Session created! Now upload PDF.`)
      setTimeout(() => navigate('/teacher/upload-pdf'), 1000)
    } catch {
      setMsg('❌ Error creating session!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/teacher')} className="text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1 text-sm">
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
            <h2 className="text-2xl font-bold text-white">Create New Exam Session</h2>
            <p className="text-blue-100 text-sm mt-1">Setup quiz or viva for your students</p>
          </div>

          <div className="p-8">
            {msg && <p className="mb-4 text-sm font-medium">{msg}</p>}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Session Name *</label>
              <input value={sessionName} onChange={e => setSessionName(e.target.value)} placeholder="e.g. Midterm DSA Quiz" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Branch / Course *</label>
                <select value={branch} onChange={e => setBranch(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm">
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
                <select value={semester} onChange={e => setSemester(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm">
                  <option value="">Select Semester</option>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="e.g. Data Structures" className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">No. of Questions</label>
                <input type="number" value={numQuestions} min={1} max={20} onChange={e => setNumQuestions(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Question Marks</label>
                <input type="number" value={marksPerQuestion} min={1} onChange={e => setMarksPerQuestion(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Limit (min)</label>
                <input type="number" value={timeLimit} min={5} onChange={e => setTimeLimit(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"/>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => navigate('/teacher')} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 font-medium transition">Cancel</button>
              <button onClick={handleCreate} className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition">Create & Continue</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}