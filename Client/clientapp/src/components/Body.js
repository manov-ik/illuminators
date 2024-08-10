import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './Login'
import MainPage from './MainPage'
import Browse from './Browse'
import Suggessions from './Suggessions'
const Body = () => {
  
    const approuter=createBrowserRouter([
        {
            path:"/",
            element:<MainPage/>
        },
        {
            path:'/Login',
            element:<Login/>
        },
        {
            path:"/Browse",
            element:<Browse/>
        },
        {
             path:"/Knowmore",
             element:<Suggessions/>
        }
    ])
  return (
    <div>
      <RouterProvider router={approuter}/>
    </div>
  )
}

export default Body
