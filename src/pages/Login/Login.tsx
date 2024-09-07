import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.scss';
import { StoreContext } from '../../services/StoreContext';

function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
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
      setIsLoggedIn(true); // Update the context to indicate user is logged in
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Error during login:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      // const timer = setTimeout(() => {
        navigate('/dashboard'); 
      // }, 2000); 

      // return () => clearTimeout(timer); 
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
          <input 
            className='login-form-input'
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button className='login-button' type="submit">Login</button>
        {error && <p className='login-error'>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
