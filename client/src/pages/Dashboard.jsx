import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
    const [data, setData] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('user')

    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const roleUser = localStorage.getItem('role')

    const fetchData = async () => {
        const url =
            roleUser === 'admin'
                ? 'http://localhost:5000/api/users'
                : 'http://localhost:5000/api/tasks'

        const res = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        })

        setData(res.data)
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleLogout = () => {
        localStorage.clear()
        navigate('/')
    }

    const handleAddUser = async (e) => {
        e.preventDefault()
        try {
            await axios.post(
                'http://localhost:5000/api/users',
                { name, email, password, role },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            alert('User added successfully')
            setName('')
            setEmail('')
            setPassword('')
            setRole('user')
            fetchData()
        } catch (err) {
            alert(err.response?.data?.error || 'Error adding user')
        }
    }

    return (
        <div className="dashboard-container">
            <h2>Welcome {roleUser === 'admin' ? 'Admin' : 'User'}</h2>
            <button onClick={handleLogout}>Logout</button>

            {roleUser === 'admin' && (
                <div>
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
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        <button type="submit">Add User</button>
                    </form>
                </div>
            )}

            <h3>{roleUser === 'admin' ? 'All Users' : 'My Tasks'}</h3>
            <ul>
                {data.map((item, i) => (
                    <li key={i}>{item.name || item.title}</li>
                ))}
            </ul>
        </div>
    )
}

export default Dashboard
