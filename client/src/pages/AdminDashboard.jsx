import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import useWindowSize from '../hooks/useWindowSize'

function AdminDashboard({ setToken }) {
    const { width } = useWindowSize()
    const [users, setUsers] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [roleInput, setRoleInput] = useState('user')

    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${token}` },
            })
            setUsers(res.data)
        } catch (err) {
            console.error('Failed to load users:', err)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleAddUser = async (e) => {
        e.preventDefault()
        try {
            await axios.post(
                'http://localhost:5000/api/users',
                { name, email, password, role: roleInput },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            alert('User added successfully')
            setName('')
            setEmail('')
            setPassword('')
            setRoleInput('user')
            fetchUsers()
        } catch (err) {
            alert(err.response?.data?.error || 'Error adding user')
        }
    }

    const handleLogout = () => {
        localStorage.clear()
        setToken(null) // ✅ logout the safe way
        navigate('/')
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Welcome Admin</h2>
                <button onClick={handleLogout} className="logout-button" title="Logout">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    {width < 768 && <span>Logout</span>}
                </button>
            </div>

            <h3>Add New User</h3>
            <form onSubmit={handleAddUser}>
                <input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <select value={roleInput} onChange={(e) => setRoleInput(e.target.value)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit">Add User</button>
            </form>

            <h3>All Users</h3>
            <ul>
                {users.map((user) => (
                    <li key={user._id}>
                        {user.name} ({user.role})
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default AdminDashboard