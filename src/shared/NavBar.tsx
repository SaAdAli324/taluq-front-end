import { useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import { useState } from "react"
import { IoMenu, IoClose } from "react-icons/io5"

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
            
            {/* Mobile Sidebar Slider */}
            <div 
              className={`md:hidden fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 backdrop-blur-sm ${showMenu ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
              onClick={() => setShowMenu(false)}
            />
            
            <div className={`md:hidden fixed top-0 right-0 h-full w-[75vw] max-w-sm bg-white dark:bg-[#0f172a] shadow-2xl z-50 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}>
              
              {/* Drawer Header Area */}
              <div className="w-full bg-slate-50 dark:bg-[#1e293b] p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-4 relative">
                <button onClick={() => setShowMenu(false)} className="absolute top-4 right-4 text-2xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                  <IoClose />
                </button>
                
                <div 
                  onClick={() => {setSearchParams({profile:user._id}); setShowMenu(false)}} 
                  className="flex flex-col items-start gap-3 cursor-pointer group w-fit"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-taluq-green shadow-sm group-hover:shadow-md transition-all shrink-0">
                    {user?.profilePic ? <img src={user?.profilePic} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full bg-slate-200 dark:bg-slate-700" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg text-slate-800 dark:text-white group-hover:text-taluq-green transition-colors">{user?.name || "My Profile"}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">View Settings</span>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="flex-1 p-4 flex flex-col gap-2">
                <button 
                  onClick={() => {setSearchParams({profile:user._id}); setShowMenu(false)}}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium transition-colors cursor-pointer"
                >
                  Profile & Settings
                </button>
              </div>
              
              {/* Footer Logo */}
              <div className="p-6 mt-auto border-t border-slate-100 dark:border-slate-800/50">
                <h2 className="text-2xl text-taluq-green font-medium tracking-wide">Taluق</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavBar
