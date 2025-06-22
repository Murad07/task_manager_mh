import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
    const [users, setUsers] = useState([])
    const [tasks, setTasks] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [roleInput, setRoleInput] = useState('user')

    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    useEffect(() => {
        if (!token) return navigate('/')

        const fetchData = async () => {
            try {
                if (role === 'admin') {
                    const res = await axios.get('http://localhost:5000/api/users', {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    setUsers(res.data)
                } else {
                    const res = await axios.get('http://localhost:5000/api/tasks', {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    setTasks(res.data)
                }
            } catch (err) {
                console.error('Error:', err.response?.data || err.message)
            }
        }

        fetchData()
    }, [token, role, navigate])

    const handleLogout = () => {
        localStorage.clear()
        navigate('/')
    }

    const handleAddUser = async (e) => {
        e.preventDefault()
        try {
            await axios.post(
                'http://localhost:5000/api/users',
                { name, email, password, role: roleInput },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            alert('User added')
            setName('')
            setEmail('')
            setPassword('')
            setRoleInput('user')
            // re-fetch users
            const res = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${token}` },
            })
            setUsers(res.data)
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to add user')
        }
    }

    return (
        <div className="dashboard-container">
            <h2>Welcome {role === 'admin' ? 'Admin' : 'User'}</h2>
            <button onClick={handleLogout}>Logout</button>

            {role === 'admin' && (
                <>
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
                            <li key={user._id}>{user.name} ({user.role})</li>
                        ))}
                    </ul>
                </>
            )}

            {role === 'user' && (
                <>
                    <h3>My Tasks</h3>
                    <ul>
                        {tasks.map((task) => (
                            <li key={task._id}>{task.title}</li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    )
}

export default Dashboard
