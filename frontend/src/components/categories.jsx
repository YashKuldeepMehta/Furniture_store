import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/categories.css';
import Navbar from './navbar';
import { FaTimes } from 'react-icons/fa';

const CategoryProducts = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [minprice, setMinPrice] = useState(0);
    const [maxprice, setMaxPrice] = useState(100000);
    const [rating, setRating] = useState(0);
    const [searchterm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);


    const increaseQty = () => {
        setQuantity(prevQty => prevQty + 1);
    }

    const decreaseQty = () => {
        if (quantity > 1) {
            setQuantity(prevQty => prevQty - 1);
        }
    }

    useEffect(() => {
        let cancelled = false
        const fetchproducts = async () => {
            try {
                const result = await axios.post('https://furniture-store-backend-ucad.onrender.com/api/categorywiseproducts', { category }, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!cancelled) {
                    if (result.data.length > 0) {
                        setProducts(result.data);
                    }
                    else {
                        toast.error("No products found in this category.", { position: "top-center", autoClose: 1500 });
                    }
                }
            } catch (error) {
                if (!cancelled && error.response && error.response.data && error.response.data.error) {
                    toast.error(error.response.data.error, { position: "top-center", autoClose: 1500 });
                }
            }
        }
        fetchproducts();

        return () => {
            cancelled = true;
        }
    }, [category])

    const filteredproducts = products.filter(product => {
        return (product.price >= minprice && product.price <= maxprice && product.rating >= rating && product.name.toLowerCase().includes(searchterm.toLowerCase()));
    })

    const renderStars = (count) => {
        return [...Array(5)].map((_, i) => (
            <span key={i} className={i < count ? 'star filled' : 'star'}>★</span>
        ))
    }

    const HandleAddtoCart = async () => {
        const token = localStorage.getItem("token")
        try {
            const res = await axios.post("https://furniture-store-backend-ucad.onrender.com/api/addtocart", { productId: selectedProduct._id, quantity: quantity, name: selectedProduct.name, price: selectedProduct.price, image: selectedProduct.image }, { headers:{ Authorization : token, 'Content-Type':'application/json'}})

            if(res.status === 200){
                toast.success(res.data.message,{position: "top-center", autoClose: 1500})
                setSelectedProduct(null)
                setQuantity(1)
            }
        }
        catch (err) {
            if(err.response && err.response.data && err.response.data.error){
                toast.error(err.response.data.error,{position:"top-center", autoClose:1500})
            }
        }
    }

    return (
        <>
            <Navbar />
            <div className='category-page'>
                <div className='filter-sidebar'>
                    <h2>Filters</h2>
                    <aside>
                        <label>Min Price</label>
                        <input type="number" value={minprice} onChange={(e) => setMinPrice(e.target.value)} />

                        <label>Max Price</label>
                        <input type="number" value={maxprice} onChange={(e) => setMaxPrice(e.target.value)} />

                        <label>Ratings</label>
                        <select value={rating} onChange={(e) => setRating(e.target.value)}>
                            <option value="0">All</option>
                            <option value="1">1 Star & above</option>
                            <option value="2">2 Stars & above</option>
                            <option value="3">3 Stars & above</option>
                            <option value="4">4 Stars & above</option>
                            <option value="5">5 Stars</option>
                        </select>
                    </aside>
                </div>
                <section className="product-section">
                    <h2>Search Products</h2>

                    <input type="text" className='search-bar' placeholder='Search...' value={searchterm} onChange={(e) => setSearchTerm(e.target.value)} />

                    <div className={`product-list ${filteredproducts.length === 0 ? 'empty' : ''}`}>
                        {filteredproducts.length > 0 ? filteredproducts.map(p => (
                            <div key={p._id} className='product-item' onClick={() => setSelectedProduct(p)}>
                                <img src={`/images/${p.image}`} alt={p.name} />
                                <h3>{p.name}</h3>
                                <div className="stars">{renderStars(p.rating)}</div>
                                <p>Price: Rs.{p.price}</p>
                            </div>
                        )) : <p> No matching products found.</p>}
                    </div>
                </section>
            </div>

            {selectedProduct && (
                <div className='product-details-overlay' onClick={() => {
                    setSelectedProduct(null)
                    setQuantity(1)
                }}>
                    <div className='product-details-content' onClick={(e) => e.stopPropagation()}>
                        <span className='close' onClick={() => {
                            setSelectedProduct(null)
                            setQuantity(1)
                        }}><FaTimes /></span>
                        <img src={`/images/${selectedProduct.image}`} alt={selectedProduct.name} />
                        <h2>{selectedProduct.name}</h2>
                        <div className="stars">{renderStars(selectedProduct.rating)}</div>
                        <p className='price'>Price: Rs.{selectedProduct.price}</p>
                        <p>{selectedProduct.description}</p>
                        <div className="quantity-selector">
                            <button onClick={decreaseQty}>-</button>
                            <span>{quantity}</span>
                            <button onClick={increaseQty}>+</button>
                        </div>
                        <button className='add-to-cart-btn' onClick={()=> HandleAddtoCart()}>Add to Cart</button>
                    </div>
                </div>
            )}

        </>
    )
}

export default CategoryProducts;
