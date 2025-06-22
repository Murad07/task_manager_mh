import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    setToken(savedToken)
    setLoading(false)
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <Routes>
      <Route
        path="/"
        element={token ? <Navigate to="/dashboard" /> : <Login setToken={setToken} />}
      />
      <Route
        path="/dashboard"
        element={token ? <Dashboard setToken={setToken} /> : <Navigate to="/" />}
      />

    </Routes>
  )
}

export default App
