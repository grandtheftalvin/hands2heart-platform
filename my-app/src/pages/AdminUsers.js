import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/users');
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete user');
      setUsers(users.filter(u => u.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="admin-users-bg">
      <nav className="navbar">
        <div className="navbar-container">
          <span className="navbar-logo">Hands2Heart</span>
          <span className="navbar-title" style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', letterSpacing: '1px' }}>User Management</span>
          <button
            onClick={() => navigate('/admin/profile')}
            className="navbar-link"
            style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}
          >
            Back to Profile
          </button>
        </div>
      </nav>
      <div style={{ padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxWidth: '1200px', margin: '2rem auto' }}>
        {loading ? (
          <p>Loading users...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.1rem', background: 'white', color: '#222', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <thead>
                <tr style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)', color: 'white' }}>
                  <th style={{ padding: '16px', border: '1px solid #eee', fontWeight: 700 }}>Name</th>
                  <th style={{ padding: '16px', border: '1px solid #eee', fontWeight: 700 }}>Email</th>
                  <th style={{ padding: '16px', border: '1px solid #eee', fontWeight: 700 }}>Role</th>
                  <th style={{ padding: '16px', border: '1px solid #eee', fontWeight: 700 }}>Verified</th>
                  <th style={{ padding: '16px', border: '1px solid #eee', fontWeight: 700 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.id} style={{ background: idx % 2 === 0 ? '#faf7f2' : '#fff' }}>
                    <td style={{ padding: '14px', border: '1px solid #eee' }}>{user.name || user.email || user.id}</td>
                    <td style={{ padding: '14px', border: '1px solid #eee' }}>{user.email}</td>
                    <td style={{ padding: '14px', border: '1px solid #eee' }}>{user.role}</td>
                    <td style={{ padding: '14px', border: '1px solid #eee' }}>{user.is_verified ? 'Yes' : 'No'}</td>
                    <td style={{ padding: '14px', border: '1px solid #eee' }}>
                      <button
                        onClick={() => handleDelete(user.id)}
                        style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 50%, #dc2626 100%)', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}

export default AdminUsers; 