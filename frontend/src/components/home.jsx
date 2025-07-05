import { useState } from "react";
import Navbar from "./navbar";
import "../styles/home.css";
import { Link, useNavigate } from "react-router-dom";
import CustomerReviews from "./customerreviews";

const Home = () => {
    const navigate = useNavigate();
    const categories = [
        { name: "Sofas", image: '/images/category_sofas.jpg' },
        { name: "Beds", image: '/images/category_beds.jpg'},
        { name: "Dining", image: '/images/category_dinings.jpg' },
        { name: "Chairs", image: '/images/category_chairs.webp' },
        { name: "Wadrobes", image: '/images/category_wardrobes.webp' },
    ];
    return (
        <>
            <Navbar />
            <div className="hero-section">
                <div className="hero-text">
                    <h1>Transform Your Home with Stylish Furniture</h1>
                    <p>Affordable luxury delivered to your doorstep.</p>
                    <button>Shop Now</button>
                </div>
            </div>

            <div className="categories">
                <h1>Our Categories</h1>
                <div className="category-list">
                    {categories.map((category, index) => (
                        <div key={index} className="category-item" onClick={() => navigate(`/category/${category.name.toLowerCase()}`)}>
                            <img src={category.image} alt={category.name} />
                            <h2>{category.name}</h2>

                        </div>
                    ))}
                </div>
            </div>

            <CustomerReviews />

            <footer className="site-footer">
                <div className="footer-container">
                    <div className="footer-section">
                        <h3>MyFurlenco</h3>
                        <p>Affordable luxury furniture delivered to your doorstep.</p>
                    </div>

                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/category/sofa">Shop</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    <div className="footer-section">
                        <h4>Contact</h4>
                        <p>Email: support@myfurlenco.com</p>
                        <p>Phone: +91 93217 88548</p>
                        <p>Location: Mumbai, India</p>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} MyFurlenco. All rights reserved.</p>
                </div>
            </footer>

        </>
    )
}


export default Home;