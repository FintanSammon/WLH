import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { collection, getDocs, query as firestoreQuery, where } from "firebase/firestore"; 
import { db } from '../firebase/firebaseConfig'; 
import './EcommercePage.css';

// Helper function to parse query parameters
function useQuery() {
    return new URLSearchParams(useLocation().search);
}

function EcommercePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const urlQuery = useQuery();
    const filter = urlQuery.get('category') || 'all';

    useEffect(() => {
        async function getProducts() {
            setLoading(true);
            try {
                let q;
                if (filter === 'all') {
                    q = collection(db, "Products");
                } else {
                    // Note the alias 'firestoreQuery' is used here
                    q = firestoreQuery(collection(db, "Products"), where("category", "==", filter));
                }

                const querySnapshot = await getDocs(q);
                setProducts(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        }

        getProducts();
    }, [filter, location]); // React to changes in filter and location

    return (
        <div className="ecommerce-container">
            <div className="content-wrapper">
                <h1>Shop Page</h1>

                <div className="filter-container">
                    <Link to="/shop?category=all">All</Link>
                    <Link to="/shop?category=cups">Cups</Link>
                    <Link to="/shop?category=posters">Posters</Link>
                    <Link to="/shop?category=tshirts">T-Shirts</Link>
                </div>

                {loading ? <p>Loading products...</p> : (
                    <div className="shop-container">
                        {products.map(product => (
                            <Link to={`/shop/${product.id}`} key={product.id} state={{ product }}>
                                <div className="product">
                                    <img src={product.image} alt={product.name} className="product-image"/>
                                    <p className="product-name">{product.name}</p>
                                    <p className="product-price">€{product.price}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EcommercePage;
