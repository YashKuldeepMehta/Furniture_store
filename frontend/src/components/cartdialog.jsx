import { useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { FaTimes } from 'react-icons/fa'
import '../styles/cartdialog.css'
import useCart from './cartstore';
import { Link, useNavigate} from 'react-router-dom';

const CartDialog = ({ onClose }) => {
    const {cartItems,setCartItems} = useCart()
    const token = localStorage.getItem("token")
    const navigate  = useNavigate()

    useEffect(() => {
        let cancelled = false
        const fetchCartItems = async () => {
            try {
                const res = await axios.post("https://furniture-store-backend-ucad.onrender.com/api/fetchcart", {}, { headers: { Authorization: token, 'Content-Type': 'application/json' } })
                if (!cancelled) {
                    setCartItems(res.data.items)
                }
            }
            catch (err) {
                if (!cancelled && err.response && err.response.data && err.response.data.erro)
                    toast.error(err.response.data.error, { position: "top-center", autoClose: 1500 })
            }
        }

        fetchCartItems();
        return (() => {
            cancelled = true
        })
    }, [cartItems])


    const HandleQuantityUpdate = async (productId, quantity) => {
        try {
            const res = await axios.put("https://furniture-store-backend-ucad.onrender.com/api/updatecartquantity", { productId, quantity }, { headers: { Authorization: token, 'Content-Type': 'application/json' } })

            if (res.status === 200) {
                if(!toast.isActive("cart-update")){
                toast.success(res.data.message, { toastId:"cart-update",position: "top-center", autoClose: 1000 })
                }
                const updatedCart = await axios.post("https://furniture-store-backend-ucad.onrender.com/api/fetchcart", {},
                    { headers: { Authorization: token, 'Content-Type': 'application/json' } });
                if (updatedCart.status === 200) {
                    setCartItems(updatedCart.data.items);
                }
            }

        } catch (err) {
            console.error(err)
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(err.response.data.error, { position: "top-center", autoClose: 1000 })
            } else {
                toast.error("Unexpected error occured", { position: "top-center", autoClose: 1000 })
            }
        }
    }

    const RemoveItemFromCart = async (productId) => {
        try {
            const res = await axios.delete(`https://furniture-store-backend-ucad.onrender.com/api/removeitem/${productId}`,
                { headers: { Authorization: token, 'Content-Type': 'application/json' } })

            if (res.status === 200) {
                toast.success(res.data.message, { position: 'top-center', autoClose: 1000 })
                const updatedCart = await axios.post("https://furniture-store-backend-ucad.onrender.com/api/fetchcart", {},
                    { headers: { Authorization: token, 'Content-Type': 'application/json' } });
                if (updatedCart.status === 200) {
                    setCartItems(updatedCart.data.items);
                }
            }

        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                toast.error(err.response.data.error, { position: "top-center", autoClose: 1000 })
            }
        }
    }

    return (
        <div className='cart-dialog-overlay'>
            <div className='cart-dialog-content'>
                <div className='cart-header'>
                    <span className='close-btn' onClick={onClose}><FaTimes /></span>
                    <h2>Your Cart</h2>
                </div>
                {cartItems.length === 0 ? (
                    <p className='empty-cart'>Your cart is empty</p>
                ) : (
                    <>
                    <div className='cart-list'>
                        {cartItems.map(item => (
                            <div className='cart-item' key={item.productId}>
                                <img src={`/images/${item.image}`} alt={item.name} />
                                <h3>{item.name}</h3>

                                <div className="quantity-controls">
                                    <button onClick={() => {
                                        if (item.quantity > 1) {
                                             HandleQuantityUpdate(item.productId, item.quantity - 1)
                                        }
                                    }}>−</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={ () => HandleQuantityUpdate(item.productId, item.quantity + 1)}>+</button>
                                </div>

                                <p>Price: Rs.{item.price}</p>
                                <button className='remove-btn' onClick={() => RemoveItemFromCart(item.productId)}>Remove</button>
                            </div>
                        ))}
                    </div>
                    <button type='button' onClick={()=> {
                    onClose();
                    navigate("/checkout")}} >Checkout</button>
                    </>                   
                )}

            </div>
        </div>
    )
}

export default CartDialog
