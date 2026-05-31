import { Outlet } from "react-router-dom";



const AuthLayOut = () => {
  return (
      <div className='inset-0 z-0 flex items-center  justify-center h-screen bg-[url("public/bg/taluq.png")] bg-cover bg-center '>
   <Outlet />
    </div>
  )
}

export default AuthLayOut
