

const TypingIndicator = ({isTyping}:any) => {
  return (
    <div className={`min-h-0 h-0 ${isTyping?"visible arrivedMessages  animate-fade-in transition-all duration-200 flex justify-center items-center":"opacity-0 arrivedMessages  animate-fade-out transition-all duration-200 invisible flex justify-center items-center"}`}>
      <div className='animate-bounce '>
         .
      </div>
      <div className='animate-bounce' style={{animationDelay:'100ms'}}>.</div>
      <div className='animate-bounce' style={{animationDelay:'200ms'}}>.</div>
    </div>
  )
}

export default TypingIndicator
