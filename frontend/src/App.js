import logo from './logo.svg';
import './App.css'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home';
import CategoryProducts from './components/categories';
import { AuthProvider } from './components/authcontext';
import ProtectedRoutes from './components/protectedroutes';
import { ToastContainer } from 'react-toastify';
import Checkout from './components/checkout';


function App() {
  
  return (
    <div className="App">
      <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<div>About Page</div>} />
          <Route path="/contact" element={<ProtectedRoutes><div>Contact Page</div></ProtectedRoutes>} />
          <Route path="/category/:category" element={<ProtectedRoutes><CategoryProducts/></ProtectedRoutes>} />
          <Route path="/checkout" element={<ProtectedRoutes><Checkout/></ProtectedRoutes>}/>
        </Routes>
      </Router>
      <ToastContainer/>
      </AuthProvider>

    </div>
  );
}

export default App;
