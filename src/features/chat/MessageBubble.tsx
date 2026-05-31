import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import { IoClose, IoCheckmarkOutline, IoDocumentTextOutline, IoDownloadOutline } from "react-icons/io5";
import { CiClock2 } from "react-icons/ci";
import { LiaCheckDoubleSolid } from "react-icons/lia";

const MessageBubble = ({ message, isMe, openOptions, setOpenOptions, onEdit, onDelete }: any) => {
  const isMedia = !message.deleted && ["image", "video", "file"].includes(message.type);
  const bubbleClass = isMe 
    ? (isMedia ? `deliveredMessagesSticker ${!message.deleted ? "" : "opacity-50"}` : `deliveredMessages ${!message.deleted ? "" : "opacity-50"}`) 
    : (isMedia ? `arrivedMessagesSticker ${!message.deleted ? "" : "opacity-50"}` : `arrivedMessages ${!message.deleted ? "" : "opacity-50"}`);

  const renderMessageContent = () => {
    if (message.deleted) {
      return "this message has been deleted";
    }

    switch (message.type) {
      case "image":
        return (
          <img 
            src={message.text} 
            alt="Sent Photo" 
            className="max-w-xs max-h-60 rounded-2xl object-cover border dark:border-slate-800 cursor-pointer shadow-md hover:opacity-90 transition-opacity" 
            onClick={() => window.open(message.text, '_blank')} 
          />
        );
      case "video":
        return (
          <video 
            src={message.text} 
            controls 
            className="max-w-xs max-h-60 rounded-2xl object-contain bg-black shadow-md" 
          />
        );
      case "file":
        let fileUrl = message.text;
        let fileName = "Document";
        try {
          const fileData = JSON.parse(message.text);
          fileUrl = fileData.url;
          fileName = fileData.name;
        } catch (e) {
          fileName = fileUrl.split("/").pop() || "Document";
        }
        return (
          <div className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md max-w-xs bg-white dark:bg-[#1e293b] text-slate-800 dark:text-slate-200">
            <div className="p-2 bg-taluq-green/10 text-taluq-green rounded-lg shrink-0">
              <IoDocumentTextOutline className="text-3xl" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-sm font-semibold truncate">{fileName}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Document</span>
            </div>
            {fileUrl !== "#" && (
              <a 
                href={fileUrl} 
                target="_blank" 
                rel="noreferrer" 
                download={fileName} 
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors shrink-0 text-slate-600 dark:text-slate-300"
              >
                <IoDownloadOutline className="text-lg" />
              </a>
            )}
          </div>
        );
      default:
        return message.text;
    }
  };

  return (
    <div className="flex flex-col h-fit">
      <span className="text-xs text-gray-500 dark:text-slate-400 w-fit self-center px-2 py-1 rounded-4xl bg-slate-200 dark:bg-slate-800 text-center transition-colors duration-300">
        {message?.createdAt ? message?.createdAt.toLocaleString().split("T")[0] : new Date().toLocaleDateString()}
      </span>

      <div className={`flex items-center gap-2 group ${isMe ? "ml-auto" : "mr-auto flex-row-reverse"}`}>
        {/* Options Menu */}
        {isMe && !message.deleted && (
          <div className="relative">
            <BsThreeDotsVertical 
              onClick={() => setOpenOptions(message._id)} 
              className="cursor-pointer text-slate-600 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200" 
            />
            <div className={`absolute z-10 gap-4 py-4 w-fit h-fit transition-all ease-in-out duration-200 -right-8 -bottom-18 bg-[#f1f5f9] dark:bg-[#1e293b] border dark:border-slate-800 rounded-sm text-black dark:text-white shadow-lg ${openOptions === message._id ? "visible opacity-100" : "invisible opacity-0"}`}>
              <IoClose className="cursor-pointer absolute top-0 right-0 text-slate-500 dark:text-slate-400" onClick={() => setOpenOptions(null)} />
              {!["image", "video", "file"].includes(message.type) && (
                <button onClick={() => onEdit(message._id, message.text)} className="hover:bg-slate-100 dark:hover:bg-slate-800 w-full flex items-center gap-1 px-2 text-black dark:text-white text-sm">
                  <MdEdit className="cursor-pointer text-base" /> edit
                </button>
              )}
              <button onClick={() => onDelete(message._id)} className="hover:bg-slate-100 dark:hover:bg-slate-800 w-full flex items-center gap-1 px-2 text-black dark:text-white text-sm">
                <MdDeleteOutline className="cursor-pointer text-base" /> delete
              </button>
            </div>
          </div>
        )}

        <span className="text-xs text-slate-500 dark:text-slate-400 opacity-0 group-hover:opacity-100 transition-all ease-in-out duration-200">
          {new Date(message?.createdAt).toLocaleString().split(" ")[1]}
        </span>
        
        {/* Tick Marks */}
        {isMe ? (message.issend || message.isEdited ? (message.isdelivered ? <LiaCheckDoubleSolid className={message.seen ? "text-blue-500" : ""} /> : <IoCheckmarkOutline />) : <CiClock2 className="animation-rotate" />) : null}

        {/* Message Content */}
        <div className="max-w-xs min-w-0 whitespace-pre-wrap wrap-break-word">
          <div className={bubbleClass}>
            {renderMessageContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;