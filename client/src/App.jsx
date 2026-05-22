import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AuthProvider from './pages/AuthProvider'
import axios from 'axios';
import { useEffect } from 'react';

export const ServerURL = 'http://localhost:8000'

function App() {

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await axios.get(ServerURL + "/api/user/current-user",
          { withCredentials: true }
        );
        console.log('Current user:', response.data);
      } catch(error) {
        console.error('Error fetching current user:', error);
      }
    };
    getCurrentUser();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthProvider />} />
    </Routes>
  )
}

export default App