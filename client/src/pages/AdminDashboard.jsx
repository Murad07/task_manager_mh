import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import useWindowSize from '../hooks/useWindowSize'
import './AdminDashboard.css'

function AdminDashboard({ setToken }) {
    const { width } = useWindowSize()
    const [users, setUsers] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [roleInput, setRoleInput] = useState('user')

    const [modal, setModal] = useState({
        isOpen: false,
        message: '',
        onConfirm: null,
        type: 'info', // 'info' or 'confirm'
    });

    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
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
                `${import.meta.env.VITE_API_BASE_URL}/api/users`,
                { name, email, password, role: roleInput },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setName('')
            setEmail('')
            setPassword('')
            setRoleInput('user')
            fetchUsers()
            setModal({ isOpen: true, type: 'info', message: 'User added successfully' });
        } catch (err) {
            setModal({ isOpen: true, type: 'info', message: err.response?.data?.error || 'Error adding user' });
        }
    }

    const openConfirmationModal = (userId, userName) => {
        setModal({
            isOpen: true,
            type: 'confirm',
            message: `Are you sure you want to delete ${userName}?`,
            onConfirm: () => handleDeleteUser(userId),
        });
    };

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchUsers();
            setModal({ isOpen: true, type: 'info', message: 'User deleted successfully' });
        } catch (err) {
            setModal({ isOpen: true, type: 'info', message: err.response?.data?.error || 'Error deleting user' });
        }
    };

    const handleLogout = () => {
        localStorage.clear()
        setToken(null) // ✅ logout the safe way
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
            <div className="admin-dashboard-container">
                <div className="left-panel">
                    <div className="card-style">
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
                            <div className="select-wrapper">
                                <select value={roleInput} onChange={(e) => setRoleInput(e.target.value)}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <button type="submit">Add User</button>
                        </form>
                    </div>
                </div>
                <div className="right-panel ">
                    <h3>All Users</h3>
                    <ul className="user-list">
                        {users.map((user) => (
                            <li key={user._id}>
                                <span className="user-info">{user.name}  -- {user.role}</span>
                                {!['admin@demo.com', 'user@demo.com'].includes(user.email) && (
                                    <button onClick={() => openConfirmationModal(user._id, user.name)} className="delete-user-button" title="Delete User">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default AdminDashboard
