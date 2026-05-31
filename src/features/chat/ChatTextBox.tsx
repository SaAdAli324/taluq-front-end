import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { RiEmojiStickerLine } from "react-icons/ri";

interface ChatInputProps {
  contactInfo: any;
  sendMessage: (message: string) => void;
  typing: (conversationId: string, userId: string, isTyping: boolean) => void;
}

const ChatInput = ({ contactInfo, sendMessage, typing }: ChatInputProps) => {

  const [text, setText] = useState("");
  const [showStickers, setShowStickers] = useState(false);

  return (
    <div className="typeArea relative dark:border-slate-800 bg-white dark:bg-[#0b0f19] p-2 transition-colors duration-300">

      {showStickers && (
        <div className="absolute bottom-20 left-5 z-50 shadow-xl">
          <EmojiPicker
            className="relative"
            onEmojiClick={(emojiObject: any) => {
              setText(prev => prev + emojiObject.emoji);
            }}
          />
        </div>
      )}


      <button onClick={() => setShowStickers(!showStickers)}>
        <RiEmojiStickerLine className="absolute text-2xl cursor-pointer" />
      </button>

      <input
        type="text"
        placeholder="Type a message"
        className="chat-input"
        value={text}
        onChange={(e) => {
          setText(e.target.value);

          if (e.target.value.trim() !== "") {
            typing(contactInfo?.conversationId, contactInfo?._id, true);
          } else {
            typing(contactInfo?.conversationId, contactInfo?._id, false);
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            if (text.trim() === "") return;

            sendMessage(text);
            typing(contactInfo?.conversationId, contactInfo?._id, false);
            setShowStickers(false);
            setText("");
          }
        }}
      />
    </div>
  );
};

export default ChatInput;