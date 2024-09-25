import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter,
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import App2 from './App2.jsx'
import './index.css'
import DashboardPage from './pages/DashboardPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';

const router=createBrowserRouter([{
  path:"/",
  element:<App2/>,
//   children:[{
//     path:'/login', 
//     element:<DashboardPage/>
//   },
// {
//   path:"/signup",
//   element:<h1>signup</h1>
// },
// {
//   path:"/login",
//   element:(<h1>login</h1>)
// },
// {
// path:'/verify-email',
// element:<h1>verify-email</h1>
// },
// {
//   path:"/forgot-password",
//   element:<h1>forgot-password</h1>
// },
// {
//   path:'reset-password/:token',
//   element:<h1 >reset-password</h1>
// }



// ]
},
{
      path:'/', 
      element:<DashboardPage/>
    },
  {
    path:"/signup",
    element:<SignUpPage/>
  },
  {
    path:"/login",
    element:(<h1>login</h1>)
  },
  {
  path:'/verify-email',
  element:<h1>verify-email</h1>
  },
  {
    path:"/forgot-password",
    element:<h1>forgot-password</h1>
  },
  {
    path:'reset-password/:token',
    element:<h1 >reset-password</h1>
  }

]
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <RouterProvider router={router} />
     */}
     <BrowserRouter>
     <App2/>
     </BrowserRouter>
  </StrictMode>,
)
