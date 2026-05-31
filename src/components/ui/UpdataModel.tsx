
import { createPortal } from "react-dom"
import { IoClose, IoSendOutline } from "react-icons/io5"
import { useState } from "react"
import { AiOutlineLoading } from "react-icons/ai"
interface ConfirmModelProps {
  isOpen: boolean
  currentMessage:string
  onConfirm:(newMessage: string)=>void
  onCancel: () => void
}


const UpdateModel = ({ isOpen, currentMessage, onConfirm, onCancel }: ConfirmModelProps) => {
    const [loading] = useState(false)
    const [inputValue, setInputValue] = useState(currentMessage)
    const groupingError = inputValue.trim().length<1 ? "!border-red-500 text-red-500 outline-none focus:ring-red-500 focus:ring-offset-0 focus:ring-offset-red-500" : "border-taluq-green text-taluq-green focus:ring-taluq-green focus:border-transparent"
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 bg-black/40 flex items-center justify-center animate-fade-in">
   {   loading?<div><AiOutlineLoading className="animate-spin text-lg text-slate-500 dark:text-slate-400" /></div>:<div className={` bg-white dark:bg-[#1e293b] border dark:border-slate-800 p-4 flex flex-col gap-2 rounded-lg relative max-w-xs w-[90%] min-w-0 transition-colors duration-300`}>
      <IoClose onClick={onCancel} className="cursor-pointer absolute right-2 top-2 text-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"/>

        <h2 className={`${groupingError} font-semibold`}>update message</h2>
        <p className={` ${groupingError} text-sm deliveredMessages`}>{inputValue}</p>
      
       
        <div className="flex gap-2 mt-4 relative items-center justify-center">
          <input onKeyDown={(e)=>{
            if (e.key==="Enter") {
              if (inputValue.trim().length<1) {
                return
              }
              onConfirm(inputValue)
            }
          }} 
          onChange={(e) => setInputValue(e.target.value)}
          className={`chat-input ${groupingError}`} type="text" value={inputValue} />

          <IoSendOutline
               onClick={()=>onConfirm(inputValue)}
            className={`cursor-pointer  text-xl absolute right-2 ${groupingError}`}
          />
       
        </div>
      </div>}
    </div>,
    document.body
  )
}

export default UpdateModel
