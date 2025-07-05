import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';
import { TfiAlignJustify } from "react-icons/tfi";
import { FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from './authcontext'; 
import LoginModal from './loginmodal';
import Signupmodal from './signupmodal';
import CartDialog from './cartdialog';


const Navbar = () => {
  const [showcategorydropdown, setshowcategorydropdown] = useState(false);
  const [showlogindropdown, setshowlogindropdown] = useState(false);
  const categories = ["Table", "Chair", "Sofa", "Bed", "Wardrobe"];
  const { isLoggedIn,logout } = useAuth();
  const {showLoginModal, setShowLoginModal} = useAuth();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showcart,setShowCart] = useState(false)
  const navigate = useNavigate();

  const HandleCategoryClick = (cat) => {
    navigate(`/category/${cat.toLowerCase()}`);
    setshowcategorydropdown(false);
  };

  return (
    <>
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">MyFurlenco</a>
        <ul className="navbar-menu">
          <li className="navbar-item"><Link to="/" className='navbar-link'>Home</Link></li>
          <li className="navbar-item"><Link to="/about" className='navbar-link'>About</Link></li>

          <li
            className="navbar-item dropdown"
            onMouseEnter={() => setshowcategorydropdown(true)}
            onMouseLeave={() => setshowcategorydropdown(false)}
          >
            <span className="navbar-link">Categories</span>
            {showcategorydropdown && (
              <ul className="dropdown-menu">
                {categories.map((cat) => (
                  <li key={cat} onClick={() => HandleCategoryClick(cat)}>
                    {cat}
                  </li>
                ))}
              </ul>
            )}
          </li>

          <li className="navbar-item"><Link to="/contact" className="navbar-link">Contact</Link></li>          
          {!isLoggedIn ? (
  <li 
    className="navbar-item dropdown"
    onMouseEnter={() => setshowlogindropdown(true)}
    onMouseLeave={() => setshowlogindropdown(false)}
  >
    <ul className={`login-dropdown-menu ${showlogindropdown ? 'open' : ''}`}>
  <li onClick={() => setShowLoginModal(true)}>Login</li>
  <li onClick={() => setShowSignupModal(true)}>Sign Up</li>
</ul>
    <TfiAlignJustify />
  </li>
) : (
  <>
  <li className="cart-link" onClick={() => setShowCart(true)}><FaShoppingCart/></li>
  <li className="logout-link" onClick={logout}><FaSignOutAlt/></li>
  </>
)}
        </ul>
      </div>
    </nav>

    {showLoginModal && <LoginModal setShowLoginModal = {setShowLoginModal} />}
    {showSignupModal && <Signupmodal setShowSignupModal = {setShowSignupModal} setShowLoginModal={setShowLoginModal} />}
    {showcart && <CartDialog onClose={() => setShowCart(false)}/>}
    </>

    
  );
};

export default Navbar;
