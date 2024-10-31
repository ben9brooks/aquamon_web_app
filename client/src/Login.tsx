// Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import deez from '../public/images/underwater.png'
import { GlobalStyle } from './styles/GlobalStyle';

export function Login() {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Log the email and password to verify they are being captured
    console.log('Email:', email);
    console.log('Password:', password);

    try {
      const response = await fetch(`http://localhost:5001/login/${email}/${password}`)
      const data = await response.json()
      
      if (data.length > 0)
      {
        login();
        navigate('/main_window');
      } 
      else 
      {
        alert('Invalid credentials');
      }
    }
    catch 
    {
      alert('Invalid credentials');
    }
  }
/*     if (username === 'admin' && password === 'password') {
      login();
      navigate('/main_window');
    } else {
      alert('Invalid credentials');
    }
  }; */

  return (
    <>
    <GlobalStyle></GlobalStyle>
    <div className='bkg' style={{
      backgroundImage: `url(${deez})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      width: '100vw',
      height: '100vh',
    }}>
      <div className='header'>
        <div className='title'>
          <h1>
            <b>AquaMon Dashboard</b>
          </h1>
        </div>
      </div>
      <div>
        <form onSubmit={handleLogin} style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center', /* Center horizontally */
          alignItems: 'center',     /* Center vertically */
          height: '80vh',           // Adjust this to control the height, e.g., 80vh
          marginTop: '-10vh',
        }}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              marginBottom: '10px',   // Space between inputs
              padding: '8px',
              width: '300px'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              marginBottom: '10px',   // Space between inputs
              padding: '8px',
              width: '300px'
            }}
          />
          <button className='time-btn' type="submit">Login</button>
        </form>
      </div>
    </div>
    </>
  );
}