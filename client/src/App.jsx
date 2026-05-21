import { Routes,Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AuthProvider from './pages/AuthProvider'
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthProvider />} />
    </Routes>
  )
}

export default App