import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
axios.defaults.baseURL = 'http://localhost:5001';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/login', {
        username,
        password,
      });

      if (response.data.message) {
        // Login successful, navigate to the dashboard
        navigate('/dashboard');
      } else {
        // Handle login error
        alert('Invalid username or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again later.');
    }
  };

  const handleGoogleSignin = async () => {
    try {
      // Implement Google sign-in logic here
      const response = await axios.post('/api/google-signin', {
        // Pass any necessary data from the Google sign-in response
      });

      if (response.data.message) {
        // Google sign-in successful, navigate to the dashboard
        navigate('/dashboard');
      } else {
        // Handle Google sign-in error
        alert('Google sign-in failed. Please try again.');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert('An error occurred during Google sign-in. Please try again later.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Welcome back</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
            <button
              className="bg-white hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleGoogleSignin}
            >
              Sign in with Google
            </button>
          </div>
        </form>
        <div className="mt-4 text-center">
          Don't have an account? <Link to="/signup" className="text-blue-500 hover:text-blue-700">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;