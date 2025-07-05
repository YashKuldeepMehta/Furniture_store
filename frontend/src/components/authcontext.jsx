import { useContext,createContext, useState, useEffect, use } from "react";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AuthContext = createContext();

export const AuthProvider  = ({children}) =>{
    const[isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [showLoginModal, setShowLoginModal] = useState(false);    

    useEffect(() =>{
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    })

    const login = (token) =>{
        localStorage.setItem('token', token);
        setIsLoggedIn(true);
        toast.success("Login successful", { position: "top-center", autoClose: 1500 });

    }

    const logout = ()=>{
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        toast.success("You are logged out!!", { position: "top-center", autoClose: 1500 });
    }

    const signup = () =>{
        toast.success("Signup successful", { position: "top-center", autoClose: 1500 });
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout , signup, setShowLoginModal, showLoginModal }}>
            {children}
        </AuthContext.Provider>
        
    );
}

export const useAuth = () => useContext(AuthContext);