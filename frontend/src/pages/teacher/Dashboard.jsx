import { useNavigate } from 'react-router-dom'

export default function TeacherDashboard() {
  const navigate = useNavigate()
  const name = localStorage.getItem('name')

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  const cards = [
    { title: 'Create Exam Session', desc: 'Setup new quiz or viva session', icon: '📝', color: 'from-blue-500 to-indigo-600', path: '/teacher/create-course' },
    { title: 'Upload Study Material', desc: 'Generate AI questions from PDF', icon: '📄', color: 'from-emerald-500 to-teal-600', path: '/teacher/upload-pdf' },
    { title: 'View Results', desc: 'Check student performance', icon: '📊', color: 'from-purple-500 to-pink-600', path: '/teacher/results' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xl">🎓</div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">AI Assessment Platform</h1>
            <p className="text-xs text-gray-400">Teacher Portal</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-700">{name}</p>
            <p className="text-xs text-gray-400">Teacher</p>
          </div>
          <button onClick={handleLogout} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition text-sm">
            Logout
          </button>
        </div>
      </nav>

      <div className="p-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome back, {name?.split(' ')[0]} 👋</h2>
        <p className="text-gray-500 mb-8">Manage your exam sessions and track student progress</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <div
              key={i}
              onClick={() => navigate(c.path)}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
            >
              <div className={`h-2 bg-gradient-to-r ${c.color}`}></div>
              <div className="p-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {c.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{c.title}</h3>
                <p className="text-gray-400 text-sm">{c.desc}</p>
                <div className="mt-4 text-sm font-semibold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                  Open <span>→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}