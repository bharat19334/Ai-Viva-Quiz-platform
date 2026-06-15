import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function SuperAdminDashboard() {
  const navigate = useNavigate()
  const name = localStorage.getItem('name')
  const [name2, setName2] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [teachers, setTeachers] = useState([])

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/auth/teachers`)
      setTeachers(res.data)
    } catch {
      console.log('Error fetching teachers')
    }
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  const addTeacher = async () => {
    if (!name2 || !email || !password) {
      setMsg('❌ Saare fields fill karo!')
      return
    }
    try {
      await axios.post(
        `http://127.0.0.1:8000/auth/register?name=${name2}&email=${email}&password=${password}&role=teacher`
      )
      setMsg('✅ Teacher added successfully!')
      setName2(''); setEmail(''); setPassword('')
      fetchTeachers()
    } catch {
      setMsg('❌ Error — email already exists!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-xl">🎓</div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">AI Assessment Platform</h1>
            <p className="text-xs text-gray-400">Super Admin Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-700">{name}</p>
            <p className="text-xs text-gray-400">Super Admin</p>
          </div>
          <button onClick={handleLogout} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition text-sm">
            Logout
          </button>
        </div>
      </nav>

      <div className="p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome, {name} 👋</h2>
        <p className="text-gray-500 mb-8">Manage teachers and platform settings</p>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Add New Teacher</h3>
          {msg && <p className="mb-4 text-sm font-medium">{msg}</p>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <input value={name2} onChange={e => setName2(e.target.value)} placeholder="Teacher Name" className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"/>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"/>
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"/>
          </div>
          <button onClick={addTeacher} className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition text-sm">
            Add Teacher
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">All Teachers ({teachers.length})</h3>
          {teachers.length === 0 && <p className="text-gray-400 text-sm">Koi teacher nahi hai abhi!</p>}
          {teachers.map((t, i) => (
            <div key={i} className="flex justify-between items-center border-b border-gray-100 py-4 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                  {t.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.email}</p>
                </div>
              </div>
              <span className="bg-purple-50 text-purple-600 text-xs px-3 py-1 rounded-full font-medium">Teacher</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}