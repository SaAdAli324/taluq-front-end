import { Navigate , Outlet } from "react-router-dom"
import { useAppSelector } from "../app/hooks"

export const ProtectRoutes = () => {
    const { isAuthenticated } = useAppSelector((state) => state.protectRoutes)
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}
