import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login, setCheckingAuth } from '../app/store/slices/authSlices.ts'
import api from '../api.ts'

const AuthCheck = ({ children }: { children: React.ReactNode }) => {

  const dispatch = useDispatch()
  const isCheckingAuth = useSelector((state: any) => state.protectRoutes.isCheckingAuth)
  
  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const response = await api.get('api/get/profile', {
          withCredentials: true
        })
        console.log(response)
        dispatch(login(response.data.user))
        dispatch(setCheckingAuth(false))
      } catch (error) {
        dispatch(setCheckingAuth(false))
        console.log("this is  the authentication  error", error);
        
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
