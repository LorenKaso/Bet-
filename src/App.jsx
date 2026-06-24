import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Box from '@mui/material/Box'
import TopBar from './components/TopBar'
import HomePage from './pages/HomePage'
import NewPostPage from './pages/NewPostPage'
import SearchPage from './pages/SearchPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

function App() {
  const [userEmail, setUserEmail] = useState('')

  return (
    <Box>
      <TopBar userEmail={userEmail} onLogout={() => setUserEmail('')} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/new-post" element={<NewPostPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage onLogin={setUserEmail} />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Box>
  )
}

export default App
