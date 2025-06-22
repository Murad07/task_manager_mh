import AdminDashboard from './AdminDashboard'
import UserDashboard from './UserDashboard'

function Dashboard({ setToken }) {
    const role = localStorage.getItem('role')
    return role === 'admin' ? <AdminDashboard setToken={setToken} /> : <UserDashboard setToken={setToken} />
}

export default Dashboard
