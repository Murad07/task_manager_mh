import AdminDashboard from './AdminDashboard'
import UserDashboard from './UserDashboard'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

function Dashboard() {
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')
    const navigate = useNavigate()

    useEffect(() => {
        if (!token) navigate('/')
    }, [token, navigate])

    if (!token) return null

    return role === 'admin' ? <AdminDashboard /> : <UserDashboard />
}

export default Dashboard
