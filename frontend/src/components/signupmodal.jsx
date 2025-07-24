import {useState} from 'react';
import "../styles/signupmodal.css";
import axios from 'axios';
import {toast, ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { FaTimes } from 'react-icons/fa';
import {useAuth} from './authcontext';


const Signupmodal = ({setShowSignupModal, setShowLoginModal})=>{
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const {signup} = useAuth();

    const HandleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email || !password || !confirmPassword || !phone) {
            toast.error("Please fill in all fields", { position: "top-center", autoClose: 1500 });
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match", { position: "top-center", autoClose: 1500 });
            return;
        }

        try{
            const result = await axios.post("https://furniture-store-backend-ucad.onrender.com/api/signup", {name,email,password,phone});
            if(result.status === 200){
                setShowSignupModal(false);
                setShowLoginModal(true);               
            }
        }catch(err){
            if(err.response && err.response.data && err.response.data.error){
                toast.error(err.response.data.error, { position: "top-center", autoClose: 1500 });
            }else{
                toast.error("An error occurred. Please try again later.", { position: "top-center", autoClose: 1500 });
            }
        }
    }
    return (
        <>
        <div className="signup-container">
            <div className="signup-box">
                <h2>Signup</h2>
                <button className="close-button" onClick={() => setShowSignupModal(false)}><FaTimes /></button>
                <p>Create a new account!!</p>
                <form onSubmit={HandleSubmit}>
                    <input type="text" placeholder="Name" onChange={(e) => setName(e.target.value)} required />
                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} required />
                    <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
                    <input type="password" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} required />
                    <input type="tel" placeholder="Phone Number" onChange={(e) => setPhone(e.target.value)} required />
                    <button type="submit">Sign Up</button>
                </form>
            </div>
        </div>
        </>
    )
}

export default Signupmodal;
