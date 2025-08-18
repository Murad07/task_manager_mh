import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import useWindowSize from '../hooks/useWindowSize'

function UserDashboard({ setToken }) {
    const { width } = useWindowSize()
    const [tasks, setTasks] = useState([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [editTaskId, setEditTaskId] = useState(null) // track editing task
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) return navigate('/')
        fetchTasks()
    }, [token, navigate])

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

    const handleAddTask = async (e) => {
        e.preventDefault()
        try {
            await axios.post(
                'http://localhost:5000/api/tasks',
                { title, description },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setTitle('')
            setDescription('')
            fetchTasks()
        } catch (err) {
            alert(err.response?.data?.error || 'Error adding task')
        }
    }

    const handleEditClick = (task) => {
        setEditTaskId(task._id)
        setTitle(task.title)
        setDescription(task.description || '')
    }

    const handleUpdateTask = async (e) => {
        e.preventDefault()
        try {
            await axios.put(
                `http://localhost:5000/api/tasks/${editTaskId}`,
                { title, description },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setTitle('')
            setDescription('')
            setEditTaskId(null)
            fetchTasks()
        } catch (err) {
            alert(err.response?.data?.error || 'Error updating task')
        }
    }

    const handleCancelEdit = () => {
        setEditTaskId(null)
        setTitle('')
        setDescription('')
    }

    const handleDeleteTask = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            fetchTasks()
        } catch (err) {
            alert(err.response?.data?.error || 'Error deleting task')
        }
    }

    const handleLogout = () => {
        localStorage.clear()
        setToken(null)
        navigate('/')
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Welcome User</h2>
                <button onClick={handleLogout} className="logout-button" title="Logout">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    {width < 768 && <span>Logout</span>}
                </button>
            </div>

            <h3>{editTaskId ? 'Edit Task' : 'Add New Task'}</h3>
            <form onSubmit={editTaskId ? handleUpdateTask : handleAddTask}>
                <input
                    placeholder="Task Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button type="submit">{editTaskId ? 'Update Task' : 'Add Task'}</button>
                {editTaskId && <button onClick={handleCancelEdit} type="button">Cancel</button>}
            </form>

            <h3>My Tasks</h3>
            <ul>
                {tasks.map((task) => (
                    <li key={task._id}>
                        <strong>{task.title}</strong>
                        {task.description && <p>{task.description}</p>}
                        <button onClick={() => handleEditClick(task)}>Edit</button>
                        <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default UserDashboard