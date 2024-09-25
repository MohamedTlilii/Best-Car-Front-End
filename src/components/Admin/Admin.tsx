
import React, { useState, useEffect } from 'react';
import './Admin.scss';
import Spinner from '../Spiner/Spinner';
import { Card, Col, Toast, ToastContainer } from 'react-bootstrap';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<'success' | 'danger'>('success');

  const [loggedInUserRole, setLoggedInUserRole] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/users/getallusers', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setUsers(data);
        
        const loggedInUser = data.find((user: User) => user.id === 'logged-in-user-id'); // Replace with actual logic
        if (loggedInUser) {
          setLoggedInUserRole(loggedInUser.role);
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    console.log('Updating user:', userId, 'with new role:', newRole);
  
    try {
      const response = await fetch(`http://localhost:3000/users/updateuser/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
  
      if (!response.ok) {
        const responseBody = await response.text(); 
        console.error('API Error:', responseBody);
        throw new Error('Failed to update role');
      }
  
      setUsers(users.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ));
      setToastMessage('Role updated successfully!');
      setToastType('success');
      setShowToast(true);
  
    } catch (error) {
      if (error instanceof Error) {
        console.error('Update error:', error.message);
        setError(error.message);
        setToastMessage('Failed to update role.');
        setToastType('danger');

      } else {
        console.error('Unexpected error:', error);
        setError('An unexpected error occurred.');
        setToastMessage('An unexpected error occurred.');
        setToastType('danger');

      }
      setShowToast(true);
    }
  };
  

  return (
    <div className="admin-container">
      <h1>Admin Panel</h1>
      <p>Manage your dashboard settings and user roles here.</p>
      
      {loading ? <Spinner /> : (
        <>
          {error && <p style={{ color: 'red' }}>Error: {error}</p>}
          {!error && (
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4}>No data available</td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={
                            (loggedInUserRole === 'admin' && user.role === 'superadmin') || // Admin cannot change superadmin role
                            loggedInUserRole === 'user'
                          }
                        >
                          {loggedInUserRole === 'superadmin' && <option value="superadmin">SuperAdmin</option>}
                          <option value="admin">Admin</option>
                          <option value="superadmin">SuperAdmin</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </>
      )}

     {/* Toast Container */}
     <ToastContainer style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1050 }} className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} className={toastType === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}>
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
}

export default Admin;
