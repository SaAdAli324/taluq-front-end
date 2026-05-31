import { useState } from "react";



export const Loader = (initialLoadingState:boolean=false) => {
const [isLoading , setIsLoading] = useState<boolean>(initialLoadingState)

const startLoading = ()=> setIsLoading(true)
const stopLoading = ()=> setIsLoading(false)

return {isLoading , startLoading , stopLoading}
}

export const ModelLoader=(initialModelLoadingState:boolean=false)=>{
  const [isModelLoading , setModelLoading]=useState<boolean>(initialModelLoadingState)

  const startModelLoading=()=> setModelLoading(true)
  const stopModelLoading=()=> setModelLoading(false)

  return {isModelLoading , startModelLoading , stopModelLoading}
}
