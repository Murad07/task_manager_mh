import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Login.css'

function Login({ setToken }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(true)
    const [showHint, setShowHint] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            navigate('/dashboard')
        } else {
            setLoading(false)
        }
    }, [navigate])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
                email,
                password,
            })
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('role', res.data.role)
            setToken(res.data.token) // ✅ Update App.jsx token state
            navigate('/dashboard')
        } catch (err) {
            alert(err.response?.data?.error || 'Login failed')
        }
    }

    if (loading) return null

    return (
        <div className="login-page-container">
            <button className="hint-button" onClick={() => setShowHint(true)}>
                Login Hint
            </button>

            {showHint && (
                <div className="modal-overlay" onClick={() => setShowHint(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h4>Login Credentials</h4>
                        <p><strong>Admin:</strong> admin@demo.com (pw: 123456)</p>
                        <p><strong>User:</strong> user@demo.com (pw: 123456)</p>
                        <button onClick={() => setShowHint(false)}>Close</button>
                    </div>
                </div>
            )}

            <div className="login-page-wrapper">
                <div className="login-container">
                    <h2 style={{ textAlign: 'center' }}>Welcome To Task Manager</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
