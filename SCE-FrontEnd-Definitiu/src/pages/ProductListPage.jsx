import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAllProducts, getProductByName } from '../services/productService';
import ProductFilter from '../components/ProductFilter';
import Cart from '../components/Cart';
import Navbar from '../components/Navbar';
import '../styles/ProductListPage.css'; // Importa los estilos CSS
import { useNavigate } from "react-router-dom";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [brand, setBrand] = useState('');
  const [type, setType] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts({ brand, type, minPrice: priceRange[0], maxPrice: priceRange[1] });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };

    fetchProducts();
  }, [brand, type, priceRange]);

  const handleSearch = async () => {
    try {
      const response = await getProductByName(searchTerm);
      setProducts(response.data);
    } catch (error) {
      console.error('Error searching products', error);
    }
  };
  
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/api/auth/logout', {}, { withCredentials: true });
      // Aquí es podria afegir codi per netejar les dades de sessió emmagatzemades localment
  
      // Redirigir a la pàgina d'inici de sessió
      navigate("/login");
    } catch (error) {
      console.error('Error during logout', error);
    }
  };

  return (
    <div className="product-list-page">
    <div className="navbar">
      <Navbar />
      <button className="logout-button" onClick={handleLogout}>Logout</button>
    </div>
    <div className="main-content">
      <div className="filter-panel">
          <ProductFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            brand={brand}
            setBrand={setBrand}
            type={type}
            setType={setType}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            handleSearch={handleSearch}
          />
        </div>
        <div className="products-panel">
          <div className="products-container">
            {products.map((product) => (
              <Cart key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
