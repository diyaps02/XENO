import React from "react"
const Login = () => {
  const handleGoogleLogin = () => {
    const googleAuthUrl = "http://localhost:3000/auth/google";
    window.location.href = googleAuthUrl;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome to Your App</h1>
        <button onClick={handleGoogleLogin} style={styles.googleBtn}>
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            style={styles.googleLogo}
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: 'linear-gradient(to right, #1e3c72, #2a5298)',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  card: {
    background: '#ffffff10',
    padding: '40px',
    borderRadius: '16px',
    textAlign: 'center',
    color: 'white',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
  },
  title: {
    fontSize: '28px',
    marginBottom: '20px'
  },
  googleBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    background: 'white',
    color: '#444',
    padding: '12px 20px',
    borderRadius: '6px',
    fontWeight: 'bold',
    textDecoration: 'none',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px'
  },
  googleLogo: {
    height: '20px',
    marginRight: '12px'
  }
};

export default Login;
