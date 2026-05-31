import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, setCheckingAuth } from '../app/store/slices/authSlices.ts'
import api from '../api.ts'

const AuthCheck = ({ children }: { children: React.ReactNode }) => {

  const dispatch = useDispatch()
  const isCheckingAuth = useSelector((state: any) => state.protectRoutes.isCheckingAuth)
  
  useEffect(() => {
    const authenticateUser = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get("token");
      if (tokenFromUrl) {
        localStorage.setItem("token", tokenFromUrl);
        urlParams.delete("token");
        const cleanSearch = urlParams.toString();
        const newUrl = window.location.pathname + (cleanSearch ? `?${cleanSearch}` : "");
        window.history.replaceState({}, document.title, newUrl);
      }

      try {
        const response = await api.get('api/get/profile', {
          withCredentials: true
        })
        dispatch(login(response.data.user))
        dispatch(setCheckingAuth(false))
      } catch (error) {
        dispatch(setCheckingAuth(false))
      }
    }
    authenticateUser()
  }, [dispatch])

    if (isCheckingAuth) {
    return <div className="flex items-center justify-center h-screen text-lg">
      <div className="taluq-loader-container">
        <div className="taluq-dot"></div>
        <div className="taluq-dot"></div>
        <div className="taluq-dot"></div>
      </div>
    </div>
  }


  return <>{children}</>
}

export default AuthCheck
