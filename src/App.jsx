import React from 'react'
import { Route, Routes } from 'react-router-dom'
import RootLayout from './layout/RootLayout'
import Register from './page/Register'
import Login from './page/Login'
// import PillSplitter from './page/phil/PillSplitter'
// import WindowManager from './page/phil/WindowManager'
// import Ex from './page/phil/Ex'
// import Myphill from './page/phil/Myphill'
import Home from './page/Home'
import TodoDashbord from './page/TodoDashbord'
import TodoList from './page/TodoList'
import AddTodo from './page/AddTodo'
import TodoDetails from './page/TodoDetails'
import ProfilePage from './page/ProfilePage'
import ScrollToTop from './component/ScrollToTop'
import ErrorPage from './page/Error'
import Hero from './page/Hero'

const App = () => {
  return (
    <>
      <ScrollToTop/>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Hero/>}/>
          <Route path='/todo' element={<TodoDashbord/>}>
            <Route index element={<TodoList/>} />
            <Route path='add' element={<AddTodo/>} />
            <Route path='details/:id' element={<TodoDetails/>} />
          </Route>
          <Route path='/profile' element={<ProfilePage/>} />
          {/* <Route path=''/> */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />}/>
          {/* <Route path='/pill' element={<Myphill />} />
          <Route path='/phill' element={<PillSplitter/>} />
          <Route path='/ex' element={<Ex/>} />
          <Route path="/window" element={<WindowManager />} /> */}
         <Route path="*" element={<ErrorPage status={404} message="Page not found" />} />
        </Route>
      </Routes>
    </>
  )
}

export default App