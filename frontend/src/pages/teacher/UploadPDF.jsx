import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function UploadPDF() {
  const [file, setFile] = useState(null)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const courseId = localStorage.getItem('courseId')
  const numQuestions = localStorage.getItem('numQuestions')
  const subject = localStorage.getItem('subject')
  const semester = localStorage.getItem('semester')
  const marksPerQuestion = localStorage.getItem('marksPerQuestion')
  const timeLimit = localStorage.getItem('timeLimit')

  const handleUpload = async () => {
    if (!file) return setMsg('❌ PDF select karo pehle!')
    if (!courseId) return setMsg('❌ Pehle exam session banao!')
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/quiz/upload-pdf/${courseId}?num_questions=${numQuestions}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      setMsg(`✅ ${res.data.message}`)
    } catch {
      setMsg('❌ Error uploading PDF!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/teacher')} className="text-gray-400 hover:text-gray-600 mb-4 flex items-center gap-1 text-sm">
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
            <h2 className="text-2xl font-bold text-white">Upload Study Material</h2>
            <p className="text-emerald-100 text-sm mt-1">AI will generate questions from your PDF</p>
          </div>

          <div className="p-8">
            <div className="bg-gray-50 rounded-xl p-5 mb-6 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400 text-xs">Subject</p>
                <p className="font-semibold text-gray-800">{subject || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Semester</p>
                <p className="font-semibold text-gray-800">{semester || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Questions</p>
                <p className="font-semibold text-gray-800">{numQuestions || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Question Marks</p>
                <p className="font-semibold text-gray-800">{marksPerQuestion || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Time Limit</p>
                <p className="font-semibold text-gray-800">{timeLimit || 'N/A'} min</p>
              </div>
            </div>

            {msg && <p className="mb-4 text-sm font-medium">{msg}</p>}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select PDF (Notes/Syllabus)</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-emerald-400 transition">
                <input type="file" accept=".pdf" onChange={e => setFile(e.target.files[0])} className="w-full text-sm"/>
                {file && <p className="text-emerald-600 text-sm mt-2 font-medium">📄 {file.name}</p>}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => navigate('/teacher')} className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 font-medium transition">Back</button>
              <button onClick={handleUpload} disabled={loading} className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50">
                {loading ? 'Generating...' : 'Upload & Generate'}
              </button>
            </div>

            {!courseId && (
              <p className="text-amber-600 text-xs mt-4 text-center">⚠️ Pehle "Create Exam Session" complete karo!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}