import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import useCart from './cartstore'
import Navbar from './navbar'
import "../styles/checkout.css"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Checkout = () => {
    const { cartItems,clearCart } = useCart()
    const navigate = useNavigate()
    const [formdata, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            pincode: ''
        },
        paymentMethod: '',
        card: {
            cardName: '',
            cardNumber: '',
            cvv: ''
        },
        upi: {
            upiId: ''
        }
    })
    const [totalamount, setTotalAmount] = useState(0)
    const [showpaymentdialog, setShowPaymentDialog] = useState(false)

    useEffect(() => {
        setTotalAmount(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0))
    }, [cartItems])

   const HandleValueChange = (e) =>{
    const {name, value}  = e.target
    
    if(name in formdata.address){
        setFormData((prev) => ({
            ...prev,
            address:{
                ...prev.address,
                [name] : value
            }
        }))
    }else if(name in formdata.card){
        setFormData((prev)=> ({
            ...prev,
            card:{
                ...prev.card,
                [name]: value
            }
        }))
    }else if(name in formdata.upi){
        setFormData((prev)=> ({
            ...prev,
            upi:{
                ...prev.upi,
                [name]:value
            }
        }))
    }else{
        setFormData((prev)=>({
            ...prev,
            [name]:value
        }))
    }
   }


    const PlaceOrder = async () => {
        const token = localStorage.getItem("token")
        const payload = {
            name : formdata.name,
            email : formdata.email,
            phone : formdata.phone,
            address : formdata.address,
            paymentMethod : formdata.paymentMethod,
            paymentDetails : formdata.paymentMethod === "card" ? formdata.card : formdata.paymentMethod === "upi" ? formdata.upi : {},
            cartItems : cartItems,
            totalamount : totalamount
        }
        console.log(payload)

        try{
            const res = await axios.post("http://localhost:5000/api/placeholder",payload,{ headers: { Authorization: token, 'Content-Type': 'application/json' } })

            if(res.status === 200){
                toast.success(res.data.message,{position:"top-center", autoClose:1500})
                setShowPaymentDialog(false)
                clearCart()
                navigate("/")
                
            }
        }catch(err){
            if(err.response && err.response.data && err.response.data.error){
                toast.error(err.response.data.error,{position:"top-center",autoClose:1500})
            }
        }
    }

    const HandleSubmit = async (e) =>{
        e.preventDefault();
        if(formdata.paymentMethod === "cod"){
            await PlaceOrder()
        }
        else{
        setShowPaymentDialog(true);
    }
}

    return (
        <>
            <Navbar />
            <div className='checkout-container'>
                <h1>Checkout</h1>
                <form className='checkout-form' onSubmit={HandleSubmit}>
                    <div className='checkout-left'>
                        <div className='section'>
                            <h2>Personal Details</h2>
                            <input type="text" name="name" placeholder='Enter name' onChange={HandleValueChange} required />
                            <input type="email" name="email" placeholder='Enter email' onChange={HandleValueChange} required />
                            <input type="tel" name="phone" placeholder='Enter phone number' onChange={HandleValueChange} required />
                        </div>

                        <div className='section'>
                            <h2>Address</h2>
                            <input type="text" name="line1" placeholder='Enter Address line 1' onChange={HandleValueChange} required />
                            <input type="text" name="line2" placeholder='Enter Address line 2' onChange={HandleValueChange} required />
                            <input type="text" name="city" placeholder='Enter City' onChange={HandleValueChange} required />
                            <input type="text" name="state" placeholder='Enter State' onChange={HandleValueChange} required />
                            <input type="text" name="pincode" placeholder='Enter Pincode' onChange={HandleValueChange} required />
                        </div>
                    </div>

                    <div className='checkout-right'>
                        <h2>Order Summary</h2>
                        <div className="order-summary">
                            {cartItems?.map(item => (
                                <div className="summary-item" key={item.productId}>
                                    <img src={`/images/${item.image}`} alt={item.name} className="summary-img" />
                                    <div className="summary-details">
                                        <span className="summary-name">{item.name} (x{item.quantity})</span>
                                        <span className="summary-price">₹{item.price * item.quantity}</span>
                                    </div>
                                </div>
                            ))}
                            <div className="summary-total">
                                <strong>Total:</strong>
                                <strong>₹{totalamount}</strong>
                            </div>
                        </div>

                        <div className='payment-options'>
                            <label>
                                <input type="radio" name="paymentMethod" value="cod" checked={formdata.paymentMethod === 'cod'} onChange={HandleValueChange} />Cash on Delivery
                            </label>
                            <label>
                                <input type="radio" name="paymentMethod" value="card" checked={formdata.paymentMethod === 'card'} onChange={HandleValueChange}/>Card
                            </label>
                            <label>
                                <input type="radio" name="paymentMethod" value="upi" checked={formdata.paymentMethod === 'upi'} onChange={HandleValueChange} />UPI
                            </label>
                        </div>
                    </div>

                   {showpaymentdialog && (
                    <div className='payment-dialog-overlay' onClick={() => setShowPaymentDialog(false)}>
                        <div className='payment-dialog-content' onClick={(e) => e.stopPropagation()}>
                            <h3>{formdata.paymentMethod === "card" ? "Enter Card Details" : "Enter UPI Id"}</h3>

                            {formdata.paymentMethod === "card" && (
                                <>
                                <input type="text" name="cardName" placeholder='Enter Card Holder Name' onChange={HandleValueChange} required/>
                                <input type="text" name="cardNumber" placeholder='Enter Card Number' onChange={HandleValueChange} required/>
                                <input type="password" name="cvv" placeholder='Enter CVV' onChange={HandleValueChange} maxLength={3} required/>
                                </>
                            )}

                            {formdata.paymentMethod === "upi" && (
                                <>
                                <input type="text" name="upiId" placeholder='Enter UPI Id' onChange={HandleValueChange} required />
                                </>
                            )}
                            <button type="button" onClick={PlaceOrder}>Pay</button>
                        </div>
                    </div>
                   )}

                    <div style={{width:'100%'}}>
                   <button type="submit" className='checkout-button'>Proceed</button>
                   </div>
                </form>
            </div>
        </>
    )
}

export default Checkout