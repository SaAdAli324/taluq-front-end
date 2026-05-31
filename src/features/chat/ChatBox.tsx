import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { useAppSelector } from "../../app/hooks.ts";
import { useSelector } from "react-redux";
import { AiOutlineLoading } from "react-icons/ai";
import ConfirmModel from "../../components/ui/ConfirmModel.tsx";
import UpdateModel from "../../components/ui/UpdataModel.tsx";
import TypingIndicator from "../../components/ui/TypingIndicator.tsx";
import { useSearchParams } from "react-router-dom";
import { ChatHooks } from "../../cutomHooks/ChatHooks.tsx";
import { socket } from "../../utils/socket.ts";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import ChatInputArea from "./ChatInputArea";

const ChatBox = () => {
  const isFirstLoad = useRef(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const previousScrollHeight = useRef<number>(0);
  const firstMessageId = useRef<string | null>(null);
  const lastMessageId = useRef<string | null>(null);
  const [, setSearchParams] = useSearchParams();
  const contactInfo = useAppSelector((state) => state.contact.contactInfo);
  const user = useSelector((state: any) => state.protectRoutes.user);

  const [openOptions, setOpenOptions] = useState<string | null>(null);
  const [openUpdateModel, setOpenUpdateModel] = useState<string | null>(null);
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);


  const chatBoxRef = useRef<HTMLDivElement>(null);
  const olderMessages = useRef<HTMLDivElement>(null);
  const {
    messages,
    isOnline,
    isTyping,
    sendMessage,
    sendFileMessage,
    patchResource,
    instantUpdate,
    handleSendSticker,
    isLoading,
    isModelLoading,
    openModel,
    closeModel,
    activeModel,
    isFetchingOlder,
    hasMore,
    loadMoreMessages, } = ChatHooks(contactInfo, user);

  const scrollToBottom = (isSmooth: boolean) => {
    chatBoxRef.current?.scrollIntoView({ behavior: isSmooth ? "smooth" : "auto" });
  };
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const firstEntry = entries[0]
      if (firstEntry.isIntersecting) {
        console.log("DIV HIT! hasMore:", hasMore, "| isFetchingOlder:", isFetchingOlder, isLoading);
      }
      if (firstEntry.isIntersecting && !isFetchingOlder && hasMore) {
        loadMoreMessages()
      }
    }
      , { threshold: 0.01 })

    const currentRef = olderMessages.current
    if (currentRef) {
      observer.observe(currentRef)
    }
    return () => {
      if (currentRef) observer.unobserve(currentRef)
    }
  }, [hasMore, isFetchingOlder, isLoading, loadMoreMessages])



  useLayoutEffect(() => {
    scrollToBottom(false)
    const container = scrollContainerRef.current;
    if (!container || messages.length === 0) return;
    const currentFirstMessageId = messages[0]._id;
    if (firstMessageId.current && firstMessageId.current !== currentFirstMessageId) {
      const heightDifference = container.scrollHeight - previousScrollHeight.current;
      container.scrollTop = heightDifference;
    }
    previousScrollHeight.current = container.scrollHeight;
    firstMessageId.current = currentFirstMessageId;

  }, [messages]);

  const typing = async (conversationId: string | null | undefined, userId: string | null | undefined, userTyping: boolean) => {
    socket.emit("typing", { conversationId, userId, userTyping });
  };

  return (
    <div className="animate-fade-in flex transition-all duration-700 ease-in-out h-full max-h-full flex-col px-1 pt-3 min-h-0">
      <ChatHeader contactInfo={contactInfo} isOnline={isOnline} setSearchParams={setSearchParams} />
      <div ref={scrollContainerRef} className="messageArea  [overflow-anchor:auto] px-1 flex flex-col flex-1 overflow-y-auto bg-slate-50/50 dark:bg-[#0b0f19] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-taluq-green min-h-0 gap-4 transition-colors duration-300">

{
  isLoading || messages.length===0? null : 
        <div className=" flex justify-center relative " ref={olderMessages}>{isFetchingOlder? <AiOutlineLoading className=" absolute top-0 animate-spin mx-auto my-auto text-xl" />:null}</div>

}
        {isLoading ? (
          <AiOutlineLoading className="animate-spin mx-auto my-auto text-xl " />
        ) : messages?.length > 0 ? (
          messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              isMe={message?.sender === user?._id}
              openOptions={openOptions}
              setOpenOptions={setOpenOptions}
              onEdit={(id: string, text: string) => { setOpenUpdateModel(id); setCurrentMessage(text); setOpenOptions(null); }}
              onDelete={(id: string) => { activeModel(id); setOpenOptions(null); }}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-full w-full text-slate-500 dark:text-slate-400">~ No messages yet send a message to start</div>
        )}

        <div className="">{isTyping && <TypingIndicator isTyping={isTyping} />}</div>
        <div className="[overflow-anchor:auto]" ref={chatBoxRef}></div>
      </div>

      {/* 3. Input Area */}
      <ChatInputArea
        contactInfo={contactInfo}
        sendMessage={sendMessage}
        typing={typing}
        handleSendSticker={handleSendSticker}
        sendFileMessage={sendFileMessage}
      />

      {/* Modals */}
      {openModel !== null && <ConfirmModel loading={Boolean(isModelLoading)} isOpen={openModel !== null} title="Delete" message={`Are you sure you want to delete this message?`} onConfirm={() => patchResource(openModel)} onCancel={() => closeModel()} />}
      {openUpdateModel !== null && <UpdateModel isOpen={openUpdateModel !== null} currentMessage={`${currentMessage}`} onConfirm={(newValue) => { instantUpdate(openUpdateModel, newValue); setOpenUpdateModel(null); }} onCancel={() => { setOpenUpdateModel(null) }} />}
    </div>
  );
};

export default ChatBox;