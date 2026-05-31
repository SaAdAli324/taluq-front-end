import { useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import { useState } from "react"
import { IoMenu } from "react-icons/io5"

const NavBar = () => {
  const user = useSelector((state: any) => state.protectRoutes.user)
  const [, setSearchParams] = useSearchParams()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="taluq-theme shadow-xl flex py-2 transition-colors duration-300 relative z-20">
      <div className="flex w-full gap-2 px-2">
        <div className="flex w-full">
          <div className="flex items-center mx-auto justify-center">
            <h2 className="text-4xl text-taluq-green font-medium mx-auto tracking-wide py-4">Taluق</h2>
          </div>
          
          <div className="flex items-center justify-center relative">
            {/* Desktop Profile Pic */}
            <div onClick={() => {setSearchParams({profile:user._id})}} className="hidden md:flex cursor-pointer min-w-12 min-h-12 max-w-12 max-h-12 rounded-4xl items-center justify-center overflow-hidden">
              {user?.profilePic && <img
                src={user?.profilePic ? user?.profilePic : "https://img.wattpad.com/8f19b412f2223afe4288ed0904120a48b7a38ce1/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f5650722d38464e2d744a515349673d3d2d3234323931353831302e313434336539633161633764383437652e6a7067?s=fit&w=720&h=720"}
                className="overflow-hidden object-cover w-full h-full"
                alt=""
              />}
            </div>

            {/* Mobile Hamburger Menu */}
            <button className="md:hidden text-4xl text-taluq-green cursor-pointer p-2 hover:bg-slate-100/10 rounded-lg transition-colors" onClick={() => setShowMenu(!showMenu)}>
              <IoMenu />
            </button>
            
            {/* Mobile Dropdown / Slider */}
            {showMenu && (
              <div className="md:hidden absolute top-14 right-0 bg-white dark:bg-[#1e293b] border dark:border-slate-800 rounded-xl shadow-2xl p-5 flex flex-col items-center z-50 animate-in slide-in-from-top-2">
                 <div onClick={() => {setSearchParams({profile:user._id}); setShowMenu(false)}} className="cursor-pointer min-w-20 min-h-20 max-w-20 max-h-20 rounded-full flex items-center justify-center overflow-hidden border-2 border-taluq-green p-0.5 shadow-md">
                   {user?.profilePic && <img src={user?.profilePic} className="overflow-hidden rounded-full w-full h-full object-cover" alt="" />}
                 </div>
                 <span className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">My Profile</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavBar
