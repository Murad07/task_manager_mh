import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import useWindowSize from '../hooks/useWindowSize'

function UserDashboard({ setToken }) {
    const { width } = useWindowSize()
    const [tasks, setTasks] = useState([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [targetDate, setTargetDate] = useState(new Date().toISOString().slice(0, 10))
    const [editTaskId, setEditTaskId] = useState(null)
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    const [modal, setModal] = useState({
        isOpen: false,
        message: '',
        onConfirm: null,
        type: 'info', // 'info' or 'confirm'
    });

    useEffect(() => {
        if (!token) return navigate('/')
        fetchTasks()
    }, [token, navigate])

    const fetchTasks = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tasks`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setTasks(res.data)
        } catch (err) {
            console.error('Error loading tasks:', err)
        }
    }

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/tasks/${taskId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchTasks();
        } catch (err) {
            setModal({ isOpen: true, type: 'info', message: err.response?.data?.error || 'Error updating task status' });
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault()
        try {
            await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/api/tasks`,
                { title, description, target_date: targetDate },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setTitle('')
            setDescription('')
            setTargetDate(new Date().toISOString().slice(0, 10))
            fetchTasks()
        } catch (err) {
            setModal({ isOpen: true, type: 'info', message: err.response?.data?.error || 'Error adding task' });
        }
    }

    const handleEditClick = (task) => {
        setEditTaskId(task._id)
        setTitle(task.title)
        setDescription(task.description || '')
        setTargetDate(task.target_date ? new Date(task.target_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10))
    }

    const handleUpdateTask = async (e) => {
        e.preventDefault()
        try {
            await axios.put(
                `${import.meta.env.VITE_API_BASE_URL}/api/tasks/${editTaskId}`,
                { title, description, target_date: targetDate },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setTitle('')
            setDescription('')
            setTargetDate(new Date().toISOString().slice(0, 10))
            setEditTaskId(null)
            fetchTasks()
        } catch (err) {
            setModal({ isOpen: true, type: 'info', message: err.response?.data?.error || 'Error updating task' });
        }
    }

    const handleCancelEdit = () => {
        setEditTaskId(null)
        setTitle('')
        setDescription('')
        setTargetDate(new Date().toISOString().slice(0, 10))
    }

    const openDeleteConfirmation = (taskId) => {
        setModal({
            isOpen: true,
            type: 'confirm',
            message: 'Are you sure you want to delete this task?',
            onConfirm: () => handleDeleteTask(taskId),
        });
    };

    const handleDeleteTask = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            fetchTasks()
            closeModal();
        } catch (err) {
            setModal({ isOpen: true, type: 'info', message: err.response?.data?.error || 'Error deleting task' });
        }
    }

    const handleLogout = () => {
        localStorage.clear()
        setToken(null)
        navigate('/')
    }

    const closeModal = () => {
        setModal({ isOpen: false, message: '', onConfirm: null, type: 'info' });
    };

    return (
        <>
            {modal.isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>{modal.message}</p>
                        <div className="modal-actions">
                            {modal.type === 'confirm' ? (
                                <>
                                    <button onClick={() => {
                                        if (modal.onConfirm) modal.onConfirm();
                                    }}>Confirm</button>
                                    <button onClick={closeModal}>Cancel</button>
                                </>
                            ) : (
                                <button onClick={closeModal}>OK</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
            <div className="user-dashboard-layout">
                <div className="left-panel">

                    <div className="task-form-container dashboard-container">
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
                            <input
                                type="date"
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                                required
                            />
                            <button type="submit">{editTaskId ? 'Update Task' : 'Add Task'}</button>
                            {editTaskId && <button onClick={handleCancelEdit} type="button">Cancel</button>}
                        </form>
                    </div>
                </div>
                <div className="right-panel">
                    <h3>My Tasks</h3>
                    <div className="tasks-list">
                        {tasks.map((task) => (
                            <div key={task._id} className={`task-card status-border-${task.status.toLowerCase().replace(' ', '-')}`}>
                                <div className="task-card-content">
                                    <strong>{task.title}</strong>
                                    {task.description && <p>{task.description}</p>}
                                    {task.target_date && (
                                        <p className="task-date">
                                            Target: {new Date(task.target_date).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                <div className="task-card-actions">
                                    <div className="select-wrapper task-status-select">
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                            className={`status-${task.status.toLowerCase().replace(' ', '-')}`}>
                                            <option value="To Do">To Do</option>
                                            <option value="Ongoing">Ongoing</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                    <button onClick={() => handleEditClick(task)} className="icon-button" title="Edit Task">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                    </button>
                                    <button onClick={() => openDeleteConfirmation(task._id)} className="icon-button delete-button" title="Delete Task">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default UserDashboard