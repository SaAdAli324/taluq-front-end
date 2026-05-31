
import { createPortal } from "react-dom"
import { AiOutlineLoading } from "react-icons/ai"
interface ConfirmModelProps {
  isOpen: boolean
  title: string
  message: string
  onConfirm: ()=>void
  onCancel: () => void
  loading?: boolean
}

const ConfirmModel = ({ isOpen, title, message, onConfirm, onCancel ,loading }: ConfirmModelProps) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-9999 bg-black/40 flex items-center justify-center animate-fade-in">
      <div className="bg-white dark:bg-[#1e293b] border dark:border-slate-800 p-4 rounded-lg max-w-xs w-[90%] min-w-0 transition-colors duration-300">
        <h2 className="text-lg font-medium text-black dark:text-white">{title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
        { loading?<div><AiOutlineLoading className="animate-spin text-lg text-slate-500 dark:text-slate-400" /></div> : <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 dark:bg-slate-800 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-slate-700 cursor-pointer rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 cursor-pointer hover:bg-transparent hover:text-red-500 hover:border-red-500 border-2 transition-all duration-300 ease-in-out text-white rounded-lg"
          >
            Confirm
          </button>
        </div>
}
      </div>
    </div>,
    document.body
  )
}

export default ConfirmModel
