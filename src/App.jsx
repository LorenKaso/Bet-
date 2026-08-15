import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Box from '@mui/material/Box'
import TopBar from './components/TopBar'
import HomePage from './pages/HomePage'
import NewPostPage from './pages/NewPostPage'
import SearchPage from './pages/SearchPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import ProfilePage from './pages/ProfilePage'
import EditProfilePage from './pages/EditProfilePage'

function App() {
  const [currentUser, setCurrentUser] = useState(null)
  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const response = await fetch(
          'http://localhost:8000/users/me',
          {
            credentials: 'include',
          }
        )

        if (!response.ok) {
          setCurrentUser(null)
          return
        }

        const data = await response.json()

        setCurrentUser(data.user)
      } catch (error) {
        console.error('Could not load current user:', error)
        setCurrentUser(null)
      }
    }

    loadCurrentUser()
  }, [])

  async function handleLogout() {
    try {
      const response = await fetch('http://localhost:8000/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        console.error('Logout failed')
        return
      }

      setCurrentUser(null)
    } catch (error) {
      console.error('Logout request failed:', error)
    }
  }

  return (
    <Box>
    <TopBar currentUser={currentUser} onLogout={handleLogout}/>        
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/new-post" element={<NewPostPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={<LoginPage onLogin={setCurrentUser} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile/:username" element={<ProfilePage currentUser={currentUser} />}/>
        <Route path="/edit-profile" element={<EditProfilePage setCurrentUser={setCurrentUser} />} />
      </Routes>
    </Box>
  )
}

export default App
