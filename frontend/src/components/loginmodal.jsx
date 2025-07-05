import { useState } from "react";
import { useAuth } from "./authcontext";
import "../styles/loginmodal.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {FaTimes} from "react-icons/fa";

const LoginModal = ({setShowLoginModal}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const HandleSubmit = async(e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields",{position: "top-center", autoClose: 1500});
            return;
        }
        try {
            const result = await axios.post("http://localhost:5000/api/login", { email, password })
            if (result.status === 200) {
                login(result.data.token);
                setShowLoginModal(false);
                navigate("/");                               
            }
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(err.response.data.error, { position: "top-center", autoClose: 1500 });
            } else {
                toast.error("An error occurred. Please try again later.", { position: "top-center", autoClose: 1500 });
            }
        }
    }

  return (
  <>
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <button className="close-button" onClick={() => setShowLoginModal(false)}><FaTimes /></button>
        <p>Welcome back! Please login to your account.</p>
        <form onSubmit={HandleSubmit}>
          <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required/>
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required/>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>

  </>
);

}

export default LoginModal;
