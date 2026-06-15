import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import logo from '../../assets/image.png'

export default function Login() {
  const [panel, setPanel] = useState(null)
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/auth/login?email=${email}&password=${password}`
      )
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('role', res.data.role)
      localStorage.setItem('name', res.data.name)
      localStorage.setItem('user_id', res.data.user_id)

      if (res.data.role === 'superadmin') navigate('/superadmin')
      else if (res.data.role === 'teacher') navigate('/teacher')
      else navigate('/student')
    } catch {
      setError('Invalid email or password!')
    }
    setLoading(false)
  }

  const handleRegister = async () => {
    setLoading(true)
    setError('')
    try {
      await axios.post(
        `http://127.0.0.1:8000/auth/register?name=${name}&email=${email}&password=${password}&role=student&student_id=${studentId}`
      )
      setIsRegister(false)
      setError('')
      alert('Registration successful! Ab login karo.')
    } catch {
      setError('Registration failed! Email already exists.')
    }
    setLoading(false)
  }

  // Landing page — panel selection
  if (!panel) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center" style={{backgroundImage: `url(${logo})`}}>
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white/90 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">🎓</span>
          </div>
          <h1 className="text-4xl font-bold text-white">AI Assessment Platform</h1>
          <p className="text-indigo-200 mt-2">Career Point University</p>
        </div>

        <div className="flex gap-6">
          <div
            onClick={() => { setPanel('student'); setIsRegister(false) }}
            className="bg-white rounded-3xl p-8 w-52 text-center cursor-pointer hover:scale-105 transition-transform shadow-xl"
          >
            <div className="text-5xl mb-4">👨‍🎓</div>
            <h2 className="text-xl font-bold text-gray-800">Student</h2>
            <p className="text-gray-500 text-sm mt-1">Login or Register</p>
          </div>

          <div
            onClick={() => { setPanel('teacher'); setIsRegister(false) }}
            className="bg-white rounded-3xl p-8 w-52 text-center cursor-pointer hover:scale-105 transition-transform shadow-xl"
          >
            <div className="text-5xl mb-4">👨‍🏫</div>
            <h2 className="text-xl font-bold text-gray-800">Teacher</h2>
            <p className="text-gray-500 text-sm mt-1">Admin Panel</p>
          </div>
        </div>
      </div>
    )
  }

  // Login / Register form
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{backgroundImage: `url(${logo})`}}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10">
        <button onClick={() => setPanel(null)} className="text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1 text-sm">
          ← Back
        </button>

        <div className="text-center mb-8">
          <div className="text-4xl mb-2">{panel === 'student' ? '👨‍🎓' : '👨‍🏫'}</div>
          <h1 className="text-2xl font-bold text-gray-800">
            {panel === 'student' ? 'Student' : 'Teacher'} {isRegister ? 'Register' : 'Login'}
          </h1>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        {isRegister && (
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        )}

        {isRegister && (
          <div className="mb-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Student ID / Roll Number</label>
            <input
              type="text"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              placeholder="Enter your Student ID"
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        )}

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <button
          onClick={isRegister ? handleRegister : handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl font-bold text-white text-lg transition disabled:opacity-50"
          style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}
        >
          {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
        </button>

        {panel === 'student' && (
          <p className="text-center text-gray-500 text-sm mt-6">
            {isRegister ? 'Already have account?' : "Don't have account?"}
            <button onClick={() => { setIsRegister(!isRegister); setError('') }} className="text-indigo-600 font-semibold ml-1">
              {isRegister ? 'Login' : 'Register'}
            </button>
          </p>
        )}
      </div>
    </div>
  )
}