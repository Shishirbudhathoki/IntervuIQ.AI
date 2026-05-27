import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AuthProvider from './pages/AuthProvider'
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUserData } from './redux/userSlice';
import InterviewPage from './pages/InterviewPage';

export const ServerURL = 'http://localhost:8000'

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await axios.get(ServerURL + "/api/user/current-user",
          { withCredentials: true }
        );
        console.log('Current user data:', response.data);
        dispatch(setUserData(response.data));
      } catch(error) {
        console.error('Error fetching current user:', error);
        dispatch(setUserData(null));
      }
    };
    getCurrentUser();
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthProvider />} />
      <Route path="/interview" element={<InterviewPage />} />
    </Routes>
  )
}

export default App