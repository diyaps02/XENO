import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if(!companyName && !role) setShowForm(true);
    fetch('http://localhost:3000/users/profile', {
      method: 'GET',
      credentials: 'include',
    })
      .then(async (res) => {
        if (res.redirected || res.status === 401 || res.status === 403) {
          navigate('/login');
          return;
        }
        const text = await res.text();
        try {
          const data = JSON.parse(text);
          setUser(data);
          setShowForm(!data.companyName || !data.role);
          // setCompanyName(data.companyName || '');
          // setRole(data.role || '');
        } catch {
          setUser({ html: text });
        }
        setLoading(false);
        setShowForm(false);
      })
      .catch(() => {
        navigate('/Login');
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/logout', {
        method: 'GET',
        credentials: 'include',
      });
      navigate('/Login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName || !role) return;

    try {
      const res = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ companyName, role }),
      });

      const updatedUser = await res.json();
      setUser(updatedUser);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

//   if(companyName && role) setShowForm(false);

  return (
    <div style={{ textAlign: 'center', marginTop: '40px', position: 'relative' }}>
      <div style={{ filter: showForm ? 'blur(4px)' : 'none' }}>
        <h1>Hello, {user.displayName}</h1>
        <p>Email: {user.email}</p>
        <p>Company: {user.companyName}</p>
        <p>Role: {user.role}</p>
        <img src={user.avatar} width="100" alt="avatar" />
        <br /><br />
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      {showForm && (
        <div style={styles.overlay}>
          <form style={styles.modal} onSubmit={handleSubmit}>
            <h2>Complete Your Profile</h2>
            <input
              type="text"
              placeholder="Company Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="text"
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.submitBtn}>Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

const styles = {
  logoutBtn: {
    padding: '10px 20px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  overlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modal: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '10px',
    zIndex: 200,
    textAlign: 'center',
    width: '300px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
  },
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc'
  },
  submitBtn: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default Profile;