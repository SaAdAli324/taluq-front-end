import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './app/store/Store.ts'
import LogIn from './features/auth/LogIn.tsx'
import SignUp from './features/auth/SignUp.tsx'
import VerifyEmail from './features/auth/VerifyEmail.tsx'
import ForgotPassword from './features/auth/ForgotPassword.tsx'
import ResetPassword from './features/auth/ResetPassword.tsx'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import AuthLayOut from './layout/AuthLayOut.tsx'
import Profile from './features/profile/Profile.tsx'
import { ProtectRoutes } from './protectedRoute/ProtectedRoute.tsx'
import Home from './pages/Home.tsx'
import AuthCheck from './components/AuthCheck.tsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayOut />,
    children: [
      { index: true, element: <Navigate to="/home" /> },
      { path: "/login", element: <LogIn /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/verify-email", element: <VerifyEmail /> },
      { path: "/forgot-password", element: <ForgotPassword /> },
      { path: "/reset-password", element: <ResetPassword /> },
    ]
  },
  {
    element: <ProtectRoutes />,
    children: [
      { path: "/home", element: <Home /> },
      {path:'/profile',element:<Profile/>}
    ]
  }
]);

createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <Provider store={store}>
      <AuthCheck>
        <RouterProvider router={router} />
      </AuthCheck>
    </Provider>
  </StrictMode>,
)
