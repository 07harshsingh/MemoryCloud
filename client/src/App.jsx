import { useState } from 'react'
// import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './middleware/ProtectedRoute'
import CreateFolder from './pages/CreateFolder'
import Folder from './pages/Folder'

function App() {

  return (
    <>
     <Routes>
      <Route path='/' element={<Login/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/register' element={<Register/>}></Route>
      <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}></Route>
      <Route path='/create-folder' element={<ProtectedRoute><CreateFolder/></ProtectedRoute>}></Route>
      <Route path='/folder/:id' element={<ProtectedRoute><Folder/></ProtectedRoute>}></Route>
     </Routes>
    </>
  )
}
export default App
