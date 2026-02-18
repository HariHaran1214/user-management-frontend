import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

function App() {
    const [users, setUsers] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const fetchUsers = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/users`)
            setUsers(res.data)
        } catch (err) {
            setError('Failed to fetch users.')
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const addUser = async (e) => {
        e.preventDefault()
        setError('')
        if (!name.trim() || !email.trim()) {
            setError('Name and email are required.')
            return
        }
        setLoading(true)
        try {
            await axios.post(`${API_URL}/api/users`, { name, email })
            setName('')
            setEmail('')
            await fetchUsers()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add user.')
        } finally {
            setLoading(false)
        }
    }

    const deleteUser = async (id) => {
        setError('')
        try {
            await axios.delete(`${API_URL}/api/users/${id}`)
            await fetchUsers()
        } catch (err) {
            setError('Failed to delete user.')
        }
    }

    return (
        <div className="container">
            <header>
                <h1>User Management</h1>
                <p className="subtitle">Manage your users with ease</p>
            </header>

            <section className="card">
                <h2>Add New User</h2>
                <form onSubmit={addUser} className="form">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Enter full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Adding...' : '+ Add User'}
                    </button>
                </form>
            </section>

            <section className="card">
                <h2>Users ({users.length})</h2>
                {users.length === 0 ? (
                    <p className="empty">No users yet. Add one above!</p>
                ) : (
                    <ul className="user-list">
                        {users.map((user) => (
                            <li key={user.id} className="user-item">
                                <div className="user-info">
                                    <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
                                    <div>
                                        <p className="user-name">{user.name}</p>
                                        <p className="user-email">{user.email}</p>
                                    </div>
                                </div>
                                <button
                                    className="btn-danger"
                                    onClick={() => deleteUser(user.id)}
                                    title="Delete user"
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    )
}

export default App
