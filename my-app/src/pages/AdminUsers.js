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
    <div style={{ padding: '2rem', background: '#fff', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxWidth: '1200px', margin: '2rem auto' }}>
      <button
        onClick={() => navigate('/admin/profile')}
        style={{ marginBottom: '1rem', background: '#f97316', color: 'white', border: 'none', borderRadius: '6px', padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}
      >
        Back to Profile
      </button>
      <h2 style={{ marginBottom: '1rem', color: '#f97316', fontSize: '2rem', fontWeight: 700 }}>User Management</h2>
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
              <tr style={{ background: '#f97316', color: 'white' }}>
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
                      style={{ background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 18px', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
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
  );
}

export default AdminUsers; 