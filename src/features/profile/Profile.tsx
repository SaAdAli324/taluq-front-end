import { useForm } from 'react-hook-form'
import { profileSchema, type ProfileSchema } from './profileForm.ts'
import { useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import api from '../../api.ts'
import { MdDarkMode, MdLightMode } from "react-icons/md"

import { logout, login } from '../../app/store/slices/authSlices.ts'
import { useDispatch } from 'react-redux'
import { IoClose } from 'react-icons/io5'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react'
import { useAppSelector } from '../../app/hooks.ts'
const Profile = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const userId = useAppSelector((state) => state.protectRoutes.user)
    const [user, setUser] = useState<any>(null)
    const dispatch = useDispatch()
    const [isDarkMode, setIsDarkMode] = useState(() => {
        return document.documentElement.classList.contains("dark")
    })
    const toggleTheme = () => {
        const nextTheme = !isDarkMode
        setIsDarkMode(nextTheme)
        if (nextTheme) {
            document.documentElement.classList.add("dark")
            localStorage.setItem("theme", "dark")
        } else {
            document.documentElement.classList.remove("dark")
            localStorage.setItem("theme", "light")
        }
    }
    const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProfileSchema>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || '',
            biography: user?.biography || 'yooo',
            profilePics: user?.profilePics || ''
        },
        values: {
            name: user?.name || '',
            biography: user?.biography || 'yooo',
            profilePics: user?.profilePics || ''
        }
    })
    const { ref: profilePicsRef, ...rest } = register("profilePics")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const onSubmit = async (data: ProfileSchema) => {
        try {

            const formData = new FormData()
            const fileList = data.profilePics as unknown as FileList
            if (fileList && fileList.length > 0) {
                formData.append("profilePics", fileList[0])
            }
            formData.append("name", data.name)
            formData.append("biography", data.biography)// formData.get("profilePics"))
            const response = await api.put('/api/get/profile/user/update', formData)
            reset(data)
            setUser(response.data.user)
            dispatch(login(response.data.user))
        } catch (error) {// error)
        }
    }

    useEffect(() => {
        const getProgileData = async () => {
            try {
                const userId = searchParams.get("profile")
                const response = await api.get(`/api/get/profile/user/${userId}`)// response.data.user)
                setUser(response.data.user)

            } catch (error) {// error)
            }
        }
        getProgileData()
    }, [searchParams])

    const logOut = async () => {
        try {
            const response = await api.post('/api/auth/logout')
            if (response) {
                dispatch(logout())
            }
        } catch (error) {// error)
        }
    }

    return (

        <div className='animate-fade-in inset-0 z-50 fixed flex flex-col items-center w-full bg-black/70 justify-center h-screen'>

            <div className='relative min-w-0 w-[90%] max-w-lg rounded-2xl flex flex-col gap-2 items-center justify-center bg-white dark:bg-[#1e293b] border dark:border-slate-800 transition-colors duration-300' >
                <div className='flex flex-col taluq-theme w-full items-center py-2 rounded-2xl'>
                    <div className="flex justify-between items-center w-full px-4">
                        <div className="flex items-center gap-3">
                            <span onClick={() => setSearchParams({})} className='text-2xl cursor-pointer'>
                                <IoClose className="text-xl text-white/90" />
                            </span>
                        </div>
                        {userId._id === searchParams.get("profile") && (
                            <button
                                onClick={toggleTheme}
                                className=" top-4 right-4 z-40 p-3 rounded-full bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 shadow-lg border border-slate-200 dark:border-slate-800 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
                                title="Toggle Theme"
                            >
                                {isDarkMode ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
                            </button>
                        )}
                    </div>
                    <div className='w-25 h-25  rounded-full overflow-hidden'>
                        <img src={user?.profilePic ? user.profilePic : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png"} alt="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" />
                    </div>

                    {userId._id === searchParams.get("profile") && (
                        <span className={`cursor-pointer ${isDarkMode ? 'text-white/80' : 'text-black/80'} font-medium`} onClick={() => { fileInputRef.current?.click() }}>change photo</span>
                    )}

                </div>
                <span className='text-gray-500 dark:text-gray-400 border-b dark:border-slate-800' >id:{user?._id}</span>

                <form onSubmit={handleSubmit(onSubmit)} className='relative min-w-0 w-full  px-2 py-4 rounded-2xl flex flex-col gap-2 items-center justify-center bg-white dark:bg-[#1e293b] border-0 transition-colors duration-300'>

                    <input type="file" accept="image/jpeg, image/png, image/jpg" {...rest} ref={(e) => { profilePicsRef(e); fileInputRef.current = e }
                    } className='hidden' />
                    <div className='w-full  space-y-1'>
                        <p className='text-taluq-green mx-auto'>username</p>
                        {userId._id === searchParams.get("profile") as string ? <>
                            <input {...register("name")} type="text" className='chat-input  dark:bg-[#0b0f19] dark:border-slate-800' />
                            {errors.name && <p className='text-red-500'>{errors.name.message}</p>}</> : <p className='text-black dark:text-white'>{user?.name}</p>}
                    </div>

                    <div className='w-full  space-y-1' >
                        <p className='text-taluq-green'>biography</p>
                        {userId._id === searchParams.get("profile") as string ? <> <input {...register("biography")} type="text" className='chat-input rounded-lg px-4 py-2 w-full border dark:bg-[#0b0f19] dark:border-slate-800' />
                            {errors.biography && <p className='text-red-500'>{errors.biography.message}</p>}</> : <p className='text-black dark:text-slate-300'>{user?.biography}</p>}
                    </div>
                    {userId._id === searchParams.get("profile") as string ? (
                        <div className='flex  w-full min-w-0 justify-around'>
                        <button
                            type='submit'
                            disabled={!isDirty}
                            className={` ${!isDirty ? "px-8 py-2 rounded-lg bg-gray-400 dark:bg-slate-700 text-gray-200 dark:text-slate-400 cursor-not-allowed" : "saveBtn"}`}
                        >
                            Save
                        </button>
                        <button className="logoutBtn" onClick={() => logOut()}>logout</button>

                    </div>) : ""}

                </form>
            </div>
        </div>
    )
}

export default Profile