
import { useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
const NavBar = () => {
  const user = useSelector((state: any) => state.protectRoutes.user)
  console.log(user)
  const [, setSearchParams] = useSearchParams()
  console.log( "this is the user",user);


  return (
    <div className="taluq-theme shadow-xl flex py-2 transition-colors duration-300">
      <div className="  flex w-full  gap-2 px-2">

        <div className="flex w-full">
          <div className="flex items-center mx-auto justify-center"><h2 className="text-4xl text-taluq-green font-medium mx-auto tracking-wide py-4">Taluق</h2></div>
          <div className="flex items-center justify-center overflow-hidden ">
         
            <div onClick={() => {setSearchParams({profile:user._id})}} className="cursor-pointer min-w-12 min-h-12 max-w-12 max-h-12 rounded-4xl flex items-center justify-center overflow-hidden">
              {user?.profilePic && <img
              src={user?.profilePic ? user?.profilePic : "https://img.wattpad.com/8f19b412f2223afe4288ed0904120a48b7a38ce1/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f5650722d38464e2d744a515349673d3d2d3234323931353831302e313434336539633161633764383437652e6a7067?s=fit&w=720&h=720"}
                className="overflow-hidden"
                alt=""
              />}
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default NavBar
