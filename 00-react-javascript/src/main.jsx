import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import'./style/global.css'
import RegisterPage from './page/register.jsx'
import UserPage from './page/user.jsx'
import HomePage from './page/home .jsx'
import LoginPage from './page/login.jsx'
import RoomPage from './page/room.jsx'
import BuildingPage from './page/building.jsx'
import MonthlyBillPage from './page/bill.jsx'
import DevicePage from './page/device.jsx'
//tu "https://reactrouter.com/6.30.1/start/tutorial" huong trang sang cac file 
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { AuthWrapper } from './component/context/auth.context.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index : true,
        element : <HomePage/> 
      },
      {
        path: "user",
        element: <UserPage />
      },
      {
        path: "room",
        element: <RoomPage />
      },
      {
        path: "building",
        element: <BuildingPage />
      },
      {
        path: "bill",
        element: <MonthlyBillPage />
      },
      {
        path: "device",
        element: <DevicePage />
      },
    ]
  },
  
  {
    path: "register",
    element: <RegisterPage />
  },
  {
    path: "login",
    element: <LoginPage />
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>   
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper> 
  </React.StrictMode>,
)
