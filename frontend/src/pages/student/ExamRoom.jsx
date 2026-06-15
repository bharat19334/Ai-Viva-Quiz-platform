import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function ExamRoom() {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [examDone, setExamDone] = useState(false)
  const [listening, setListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(true)
  const [timeLeft, setTimeLeft] = useState(parseInt(localStorage.getItem('timeLimit') || '30') * 60)
  const videoRef = useRef(null)
  const recognitionRef = useRef(null)
  const navigate = useNavigate()

  const courseId = localStorage.getItem('courseId')
  const sessionId = localStorage.getItem('sessionId')

  useEffect(() => {
    fetchQuestions()
    startCamera()
    setupVoice()
  }, [])

  useEffect(() => {
    if (examDone) return
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleAutoSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [examDone])

  const fetchQuestions = async () => {
    const res = await axios.get(`http://127.0.0.1:8000/exam/questions/${courseId}`)
    setQuestions(res.data)
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) videoRef.current.srcObject = stream
    } catch {
      console.log('Camera not available')
    }
  }

  const setupVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setVoiceSupported(false)
      return
    }
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-IN'
    recognition.continuous = true
    recognition.interimResults = true

    recognition.onresult = (e) => {
      let finalText = ''
      let interimText = ''
      for (let i = 0; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          finalText += e.results[i][0].transcript + ' '
        } else {
          interimText += e.results[i][0].transcript
        }
      }
      setAnswer(finalText + interimText)
    }

    recognition.onerror = () => setListening(false)
    recognition.onend = () => setListening(false)

    recognitionRef.current = recognition
  }

  const startVoice = () => {
    if (!voiceSupported) {
      alert('Voice input not supported in this browser. Please use Chrome/Edge or type your answer.')
      return
    }
    if (listening) {
      recognitionRef.current.stop()
      setListening(false)
    } else {
      setAnswer('')
      recognitionRef.current.start()
      setListening(true)
    }
  }

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const handleAutoSubmit = async () => {
    const totalScore = results.reduce((sum, r) => sum + r.score, 0)
    await axios.post(`http://127.0.0.1:8000/exam/complete/${sessionId}?final_score=${totalScore}`)
    setExamDone(true)
  }

  const submitAnswer = async () => {
    if (!answer.trim()) return
    setLoading(true)
    const res = await axios.post(
      `http://127.0.0.1:8000/exam/submit-answer?session_id=${sessionId}&question_id=${questions[currentIndex].id}&student_answer=${answer}`
    )
    const newResults = [...results, { question: questions[currentIndex].question_text, ...res.data }]
    setResults(newResults)
    setAnswer('')
    setLoading(false)
    if (currentIndex + 1 >= questions.length) {
      const totalScore = newResults.reduce((sum, r) => sum + r.score, 0)
      await axios.post(`http://127.0.0.1:8000/exam/complete/${sessionId}?final_score=${totalScore}`)
      setExamDone(true)
    } else {
      setCurrentIndex(currentIndex + 1)
    }
  }

  if (examDone) {
    const marksPerQ = parseInt(localStorage.getItem('marksPerQuestion') || '10')
    const totalScore = results.reduce((s, r) => s + r.score, 0)
    const totalMax = questions.length * 10
    const scaledScore = questions.length > 0 ? Math.round((totalScore / totalMax) * (questions.length * marksPerQ)) : 0
    const maxMarks = questions.length * marksPerQ
    const percentage = maxMarks > 0 ? Math.round((scaledScore / maxMarks) * 100) : 0

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden max-w-md w-full">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-center">
            <div className="text-5xl mb-2">🎉</div>
            <h2 className="text-2xl font-bold text-white">Exam Complete!</h2>
          </div>
          <div className="p-8 text-center">
            <p className="text-5xl font-bold text-gray-800 mb-1">{scaledScore}<span className="text-2xl text-gray-400">/{maxMarks}</span></p>
            <p className="text-gray-400 mb-1">Final Score</p>
            <div className="inline-block bg-emerald-50 text-emerald-600 text-sm font-semibold px-4 py-1 rounded-full mb-6">
              {percentage}%
            </div>
            <button onClick={() => navigate('/student')} className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!questions.length) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-400">Loading questions...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 flex justify-between items-center">
              <p className="text-white text-sm font-medium">Question {currentIndex + 1} of {questions.length}</p>
              <p className={`text-sm font-bold px-3 py-1 rounded-full ${timeLeft < 60 ? 'bg-red-500 text-white animate-pulse' : 'bg-white/20 text-white'}`}>
                ⏱️ {formatTime(timeLeft)}
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">{questions[currentIndex].question_text}</h3>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full border border-gray-200 rounded-xl px-4 py-3 h-32 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none text-sm"
              />
              <div className="flex gap-3 mt-4">
                <button onClick={startVoice} className={`px-4 py-3 rounded-xl font-semibold text-sm transition ${listening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  {listening ? '🎤 Listening...' : '🎤 Voice'}
                </button>
                <button onClick={submitAnswer} disabled={loading} className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 text-sm">
                  {loading ? 'Evaluating...' : 'Submit Answer'}
                </button>
              </div>
              {!voiceSupported && (
                <p className="text-xs text-amber-600 mt-2">⚠️ Voice input not supported. Please type your answer or use Chrome/Edge.</p>
              )}
            </div>
          </div>

          {results.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h4 className="font-bold text-gray-800 mb-3 text-sm">Previous Answers</h4>
              {results.map((r, i) => (
                <div key={i} className="border-b border-gray-100 pb-3 mb-3 last:border-0 last:mb-0 last:pb-0">
                  <p className="text-sm text-gray-600 mb-1">{r.question}</p>
                  <p className="text-sm font-semibold text-emerald-600">Score: {r.score}/10 — {r.feedback}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <h4 className="font-bold text-gray-800 mb-2 text-sm">Proctoring</h4>
            <video ref={videoRef} autoPlay muted className="w-full rounded-xl bg-gray-100" />
            <p className="text-xs text-gray-400 mt-2 text-center">Camera active — stay in frame</p>
          </div>
        </div>
      </div>
    </div>
  )
}