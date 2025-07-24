import logo from './logo.svg';
import './App.css'
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home';
import { AuthProvider } from './components/authcontext';
import ProtectedRoutes from './components/protectedroutes';
import { ToastContainer } from 'react-toastify';
import {lazy,Suspense} from 'react'

const CategoryProducts = lazy(()=>import('./components/categories'))
const Checkout = lazy(()=>import('./components/checkout'))

function App() {
  
  return (
    <div className="App">
      <AuthProvider>
      <Router>
        <Suspense>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<div>About Page</div>} />
          <Route path="/contact" element={<ProtectedRoutes><div>Contact Page</div></ProtectedRoutes>} />
          <Route path="/category/:category" element={<ProtectedRoutes><CategoryProducts/></ProtectedRoutes>} />
          <Route path="/checkout" element={<ProtectedRoutes><Checkout/></ProtectedRoutes>}/>
        </Routes>
        </Suspense>
      </Router>
      <ToastContainer/>
      </AuthProvider>

    </div>
  );
}

export default App;
