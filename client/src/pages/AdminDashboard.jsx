import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function AdminDashboard({ setToken }) {
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
            <h2>Welcome Admin</h2>
            <button onClick={handleLogout}>Logout</button>

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
