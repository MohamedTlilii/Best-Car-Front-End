import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.scss';
import { StoreContext } from '../../services/StoreContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false); 

  const navigate = useNavigate();

  const context = useContext(StoreContext);

  

  const { isLoggedIn, setIsLoggedIn } = context;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });
      console.log('Login successful:', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isAdmin', response.data.isAdmin);
      localStorage.setItem('admin', JSON.stringify(response.data) );
      setIsLoggedIn(true); 
    } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const message = error.response.data.message;
      setError(message || 'Login failed. Please try again.');
    } else {
      setError('Login failed. Please try again.');
    }
    console.error('Error during login:', error);
  }
  };
  
  useEffect(() => {
    if (isLoggedIn) {
        navigate('/dashboard'); 

    }
  }, [isLoggedIn, navigate]);

  return (
    <div className='login-container'>
      <form className='login-form' onSubmit={handleSubmit}>
        <h2 className='login-title'>Login</h2>
        <div className='login-form-group'>
          <label className='login-form-label'>Email:</label>
          <input
            className='login-form-input'
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className='login-form-group'>
    <label className='login-form-label'>Password:</label>
    <div style={{ position: 'relative' }}>
      <input 
        className='login-form-input'
        type={showPassword ? "text" : "password"} 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
      />
      <span 
        onClick={() => setShowPassword(!showPassword)} 
        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }}
      >
        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
      </span>
    </div>
  </div>
        {error && <p className='login-error'>{error}</p>}
        <button className='login-button' type="submit" style={{width:"337px"}}>Login</button>
      </form>
    </div>
  );
}

export default Login;
