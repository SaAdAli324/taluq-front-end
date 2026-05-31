import { useState, useRef, useEffect } from "react";
import EmojiPicker from 'emoji-picker-react';
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoAttachOutline, IoImageOutline, IoVideocamOutline, IoDocumentOutline, IoSend } from "react-icons/io5";
import GiphyPicker from "./GiphyPicker.tsx";

const ChatInputArea = ({ contactInfo, sendMessage, typing, handleSendSticker, sendFileMessage }: any) => {
  const [text, setText] = useState<string>("");
  const [showStickers, setShowStickers] = useState(false);
  const [showGiphy, setShowGiphy] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowStickers(false);
        setShowGiphy(false);
        setShowAttachmentMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sendFileMessage(file);
    }
    e.target.value = "";
  };

  return (
    <div ref={wrapperRef} className="w-full">
      <div className="fixed w-fit h-fit bottom-20 right-2 z-50 gap-1 flex">
        {showStickers && (
          <EmojiPicker
            className="h-96! w-xs z-50 cursor-pointer"
            onEmojiClick={(emojiObject: any) => {
              const newText = text + emojiObject.emoji;
              setText(newText);
              if (inputRef.current) {
                 inputRef.current.textContent = newText;
                 const range = document.createRange();
                 const sel = window.getSelection();
                 range.selectNodeContents(inputRef.current);
                 range.collapse(false);
                 sel?.removeAllRanges();
                 sel?.addRange(range);
              }
            }}
          />
        )}
        {showGiphy && (
          <GiphyPicker onSendSticker={(url: string) => { handleSendSticker(url); setShowGiphy(false); }} />
        )}
      </div>

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={imageInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <input
        type="file"
        ref={videoInputRef}
        className="hidden"
        accept="video/*"
        onChange={handleFileChange}
      />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
        onChange={handleFileChange}
      />

      <div className="typeArea relative dark:border-slate-800 bg-white dark:bg-[#0b0f19] pb-2 px-2 transition-colors duration-300 flex items-center gap-1">
        {/* Attachment Options Dropdown */}
        {showAttachmentMenu && (
          <div className="absolute bottom-16 left-4 bg-white dark:bg-[#1e293b] border dark:border-slate-800 rounded-2xl shadow-xl p-2 flex flex-col gap-1 z-50 animate-fade-in text-sm min-w-[150px]">
            <button
              onClick={() => { imageInputRef.current?.click(); setShowAttachmentMenu(false); }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-200 transition-colors text-left font-medium cursor-pointer"
            >
              <IoImageOutline className="text-xl text-blue-500" />
              <span>Photo</span>
            </button>
            <button
              onClick={() => { videoInputRef.current?.click(); setShowAttachmentMenu(false); }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-200 transition-colors text-left font-medium cursor-pointer"
            >
              <IoVideocamOutline className="text-xl text-red-500" />
              <span>Video</span>
            </button>
            <button
              onClick={() => { fileInputRef.current?.click(); setShowAttachmentMenu(false); }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-200 transition-colors text-left font-medium cursor-pointer"
            >
              <IoDocumentOutline className="text-xl text-amber-500" />
              <span>Document</span>
            </button>
            <button
              onClick={() => { setShowGiphy(!showGiphy); setShowStickers(false); setShowAttachmentMenu(false); }}
              className="md:hidden flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-200 transition-colors text-left font-medium cursor-pointer"
            >
              <div className="text-[10px] bg-indigo-500 text-white font-bold px-1 py-0.5 rounded">GIF</div>
              <span>GIFs</span>
            </button>
            <button
              onClick={() => { setShowStickers(!showStickers); setShowGiphy(false); setShowAttachmentMenu(false); }}
              className="md:hidden flex items-center gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-200 transition-colors text-left font-medium cursor-pointer"
            >
              <RiEmojiStickerLine className="text-xl text-pink-500" />
              <span>Stickers</span>
            </button>
          </div>
        )}

        <button 
          className="text-slate-500 dark:text-slate-400 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer shrink-0"
          onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
        >
          <IoAttachOutline className="text-2xl" />
        </button>

        <div className="flex-1 relative">
          <div
            ref={inputRef}
            contentEditable={true}
            suppressContentEditableWarning={true}
            data-placeholder="Type a message..."
            className="chat-input pr-32 overflow-y-auto block w-full py-2.5 min-h-[44px] max-h-32 scrollbar-thin scrollbar-thumb-taluq-green focus:outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none break-words"
            onInput={(e) => {
              const val = e.currentTarget.textContent || "";
              setText(val);
              if (val.trim() !== "") {
                typing(contactInfo?.conversationId, contactInfo?._id, true);
              } else {
                typing(contactInfo?.conversationId, contactInfo?._id, false);
              }
            }}
            onPaste={(e) => {
              const items = e.clipboardData?.items;
              let hasImage = false;
              if (items) {
                for (let i = 0; i < items.length; i++) {
                  if (items[i].type.indexOf("image") !== -1) {
                    const file = items[i].getAsFile();
                    if (file) {
                      e.preventDefault();
                      hasImage = true;
                      sendFileMessage(file);
                    }
                  }
                }
              }
              if (hasImage) return;
              
              // Ensure plain text paste
              e.preventDefault();
              const pasteText = e.clipboardData?.getData("text/plain") || "";
              document.execCommand("insertText", false, pasteText);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const isMobile = window.innerWidth < 768;
                if (isMobile) return;
                
                if (!e.shiftKey) {
                  e.preventDefault();
                  const val = e.currentTarget.textContent || "";
                  if (val.trim() === "") return;
                  sendMessage(val);
                  typing(contactInfo?.conversationId, contactInfo?._id, false);
                  setShowStickers(false);
                  setText("");
                  e.currentTarget.textContent = "";
                }
              }
            }}
          />

          <div className="absolute bottom-2 right-2 w-fit z-10 gap-2 flex items-center">
            <button className="hidden md:block text-taluq-green cursor-pointer font-semibold text-sm hover:opacity-80" onClick={() => {setShowGiphy(!showGiphy); setShowStickers(false)}}>GIFs</button>
            <button className="hidden md:block text-taluq-green cursor-pointer hover:opacity-80" onClick={() => {setShowStickers(!showStickers); setShowGiphy(false)}}>
              <RiEmojiStickerLine className="text-2xl" />
            </button>
            <button 
              className="bg-taluq-green text-white rounded-full p-1.5 ml-1 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer shadow-sm"
              onClick={() => {
                if (text.trim() === "") return;
                sendMessage(text);
                typing(contactInfo?.conversationId, contactInfo?._id, false);
                setShowStickers(false);
                setText("");
                const textarea = document.querySelector('.chat-input') as HTMLTextAreaElement;
                if (textarea) textarea.style.height = 'auto';
                if (inputRef.current) inputRef.current.textContent = "";
              }}
            >
              <IoSend className="text-lg pl-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInputArea;