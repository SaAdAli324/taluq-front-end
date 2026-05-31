import NavBar from "../shared/NavBar.tsx"
import Contacts from "../features/chat/Contacts.tsx"
import ChatBox from "../features/chat/ChatBox.tsx"

import { useAppSelector } from '../app/hooks.ts'
import { socket } from '../utils/socket.ts'
import { useEffect, useState } from "react"
import Profile from "../features/profile/Profile.tsx"
import { useSearchParams } from "react-router-dom"
import { IoLogoGithub, IoLogoLinkedin } from "react-icons/io5"
import { useDispatch } from "react-redux"
import { setContact } from "../app/store/slices/chatSlice.ts"

const Home = () => {
  const user = useAppSelector((state) => state.protectRoutes.user)
  const contactInfo = useAppSelector((state) => state.contact.contactInfo)
  const [searchParams , setSearchParams] = useSearchParams()
  const dispatch = useDispatch()

  useEffect(() => {
    const chatParam = searchParams.get('chat');
    if (!chatParam && contactInfo !== null) {
      dispatch(setContact(null));
    }
  }, [searchParams, contactInfo, dispatch])




  useEffect(() => {
    if (user) {
      const token = localStorage.getItem("token")
      if (token) {
        socket.auth = { token }
      }
      socket.connect()
      return () => {
        socket.disconnect()
      }
    }
  }, [user])
  
  useEffect(() => {
    socket.emit("user_is_online", user?._id)
    return () => {
      socket.disconnect()
    }
  }, [socket])
  const openProfileId =  searchParams.get("profile")
 
  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-white dark:bg-[#0b0f19] text-black dark:text-white transition-colors duration-300">

      <div className=" flex-1 relative grid gap-2 grid-cols-12 min-h-0 h-full">
        <div className={` col-span-4  max-lg:col-span-5 
            transition-all duration-300 ease-in-out 
            border-slate-200 dark:border-slate-800 border-r    
            overflow-y-auto overflow-x-hidden
             ${(contactInfo !== null ? ' max-md:h-full max-md:z-0 max-md:opacity-0 max-md:pointer-events-none max-md:w-full' : 'max-md:opacity-100 max-md:pointer-events-auto max-md:w-full max-md:absolute z-10 ')}`}>
          <NavBar />
          <Contacts />
        </div>
        <div className={`col-span-8  max-lg:col-span-7
           ${contactInfo !== null ? 'max-md:absolute max-md:h-full max-md:z-0 max-md:opacity-100 max-md:pointer-events-auto max-md:w-full' : 'max-md:opacity-0 max-md:pointer-events-none max-md:w-full'}  
              flex flex-col pb-1 transition-all duration-500 ease-in-out h-full min-h-0 overflow-hidden`}>{contactInfo !== null ? <ChatBox /> :
            (<div className={`flex flex-col items-center gap-10 max-md:animate-fade-in my-auto mx-auto text-lg text-slate-500 dark:text-slate-400 transition-all duration-500 ease-in-out max-md:hidden`} >
              ~select chat to start conversation and send messages
              <p className="flex rounded-2xl bg-linear-50 from-taluq-green/20 via-emerald-500/5 to-taluq-green/40 bg-[length:200%_auto] animate-flow border border-slate-200 dark:border-slate-800 gap-2 w-sm h-52 justify-center items-center flex-col text-slate-800 dark:text-slate-200 transition-colors duration-300">
                <span className="font-bold">My Socials</span>
                <ul className=" w-full list-disc items-center text-slate-800 dark:text-slate-200 flex flex-col gap-2 ">
                   <li className="flex ">
                     <a className="flex justify-center items-center gap-1 hover:text-taluq-green transition-colors" href="https://github.com/SaAdAli324" target="_blank" rel="noopener noreferrer"><IoLogoGithub className="text-3xl text-orange-500"/>GitHub</a>
                </li>
                   <li className="flex ">
                     <a className="flex justify-center items-center gap-1 pl-5 hover:text-taluq-green transition-colors" href="https://www.linkedin.com/in/saad-ali-a37b253b3/" target="_blank" rel="noopener noreferrer"><IoLogoLinkedin className="text-3xl text-blue-400"/>LinkedIn</a>
                </li>
                
                </ul>
               
             
              </p>

              </div>)}
        </div>

      </div>
        {openProfileId !== null && <Profile  />}

    </div>
  )
}

export default Home
