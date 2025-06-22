import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function UserDashboard() {
    const [tasks, setTasks] = useState([])
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) return navigate('/')

        const fetchTasks = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/tasks', {
                    headers: { Authorization: `Bearer ${token}` },
                })
                setTasks(res.data)
            } catch (err) {
                console.error('Error loading tasks:', err)
            }
        }

        fetchTasks()
    }, [token, navigate])

    const handleLogout = () => {
        localStorage.clear()
        navigate('/')
    }

    return (
        <div className="dashboard-container">
            <h2>Welcome User</h2>
            <button onClick={handleLogout}>Logout</button>

            <h3>My Tasks</h3>
            <ul>
                {tasks.map((task) => (
                    <li key={task._id}>{task.title}</li>
                ))}
            </ul>
        </div>
    )
}

export default UserDashboard
