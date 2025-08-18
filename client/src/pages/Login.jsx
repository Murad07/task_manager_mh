import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Login({ setToken }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(true)
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
            const res = await axios.post('http://localhost:5000/api/auth/login', {
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
    )
}

export default Login
