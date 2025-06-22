import { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
    const [data, setData] = useState([]);
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    useEffect(() => {
        const fetchData = async () => {
            const url = role === 'admin' ? 'http://localhost:5000/api/users' : 'http://localhost:5000/api/tasks';
            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setData(res.data);
        };
        fetchData();
    }, [token, role]);

    return (
        <div>
            <h2>{role === 'admin' ? 'All Users' : 'My Tasks'}</h2>
            <ul>
                {data.map((item, index) => (
                    <li key={index}>{item.name || item.title}</li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;