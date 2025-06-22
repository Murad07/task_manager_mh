import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
    const [data, setData] = useState([])
    const navigate = useNavigate()
    const token = localStorage.getItem('token')
    const role = localStorage.getItem('role')

    useEffect(() => {
        const fetchData = async () => {
            const url =
                role === 'admin'
                    ? 'http://localhost:5000/api/users'
                    : 'http://localhost:5000/api/tasks'
            try {
                const res = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                setData(res.data)
            } catch (err) {
                console.error('Error fetching data:', err)
            }
        }
        fetchData()
    }, [role, token])

    const handleLogout = () => {
        localStorage.clear()
        navigate('/')
    }

    return (
        <div className="dashboard-container">
            <h2>Welcome {role === 'admin' ? 'Admin' : 'User'}</h2>
            <button onClick={handleLogout}>Logout</button>
            <ul>
                {data.map((item, i) => (
                    <li key={i}>{item.name || item.title}</li>
                ))}
            </ul>
        </div>
    )
}

export default Dashboard
