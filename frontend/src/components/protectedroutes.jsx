import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./authcontext";

const ProtectedRoutes = ({ children }) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const hasnotified = useRef(false);
    const { setShowLoginModal } = useAuth();

   useEffect(() =>{
        if (!token && !hasnotified.current) {
            hasnotified.current = true;
            toast.error("You need to be logged in to access this page", { position: "top-center", autoClose: 1500 });
            navigate("/");
            setShowLoginModal(true);
        }
   },[token,navigate])

   if (!token) return null
    return (
        <>
            {children}
        </>
    );
}
export default ProtectedRoutes;