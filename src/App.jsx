import { Routes, Route } from 'react-router-dom'
import Box from '@mui/material/Box'
import TopBar from './components/TopBar'
import HomePage from './pages/HomePage'
import NewPostPage from './pages/NewPostPage'
import SearchPage from './pages/SearchPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

function App() {
  return (
    <Box>
      <TopBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/new-post" element={<NewPostPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Box>
  )
}

export default App
