import { useState } from "react";


export const model = (initialModelState:string|null) =>{
const [openModel , setOpenModel] = useState<string|null>(initialModelState)

const closeModel=()=> setOpenModel(null)
const activeModel = (modelName:string)=> setOpenModel(modelName)

return{openModel , closeModel , activeModel}

}