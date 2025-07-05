import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const storedCart = localStorage.getItem("cartItems");
        if (storedCart) {
            setCartItems(JSON.parse(storedCart));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (product, quantity=1) => {
        setCartItems((prevItems) =>{
            const existingItem = prevItems.find(item => item._id === product._id);
            if (existingItem) {
                return prevItems.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
                );
            } else {
                return [...prevItems, { ...product, quantity }];
            }
        })
    }

    const updateQuantity = (productid, newquantity) => {
        setCartItems((prevItems) => {
            return prevItems.map(item =>
                item._id === productid ? { ...item, quantity: newquantity} : item
            );
        });
    }

    const removeFromCart = (productId) => {
        setCartItems((prevItems) => prevItems.filter(item => item._id !== productId));
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);