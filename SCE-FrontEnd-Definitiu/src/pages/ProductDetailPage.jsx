import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/productService';
import { addToCart } from '../services/cartService'; // Importa el servicio del carrito
import '../styles/ProductDetailPage.css'; // Importa los estilos CSS
import { Button, IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Navbar from '../components/Navbar'; // Importa el component Navbar
import axios from 'axios';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook para la navegación
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details', error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, quantity); // Añade al carrito utilizando el servicio
      alert('Product added to cart!');
      navigate('/cart'); // Redirigir al carrito
    } catch (error) {
      console.error('Error adding product to cart', error);
      alert('Failed to add product to cart');
    }
  };

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

  if (!product) {
    return <div>Carregant...</div>;
  }

  return (
    <div>
      <Navbar />
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <div className="product-detail-container">
        
        <h1>{product.name}</h1>
        <img src={`/images/${product.image}`} alt={product.name} /> {/* Ajustar la ruta de la imagen */}
        <p>{product.description}</p>
        <p>Preu: €{product.price}</p>
        <p className={product.stock > 0 ? 'stock-available' : 'stock-unavailable'}>
          {product.stock > 0 ? 'Stock available' : 'Stock unavailable'}
        </p>
        {product.stock > 0 && (
          <Box display="flex" alignItems="center" mt={2}>
            <IconButton onClick={() => setQuantity(Math.max(quantity - 1, 1))}>
              <RemoveIcon />
            </IconButton>
            <span>{quantity}</span>
            <IconButton onClick={() => setQuantity(Math.min(quantity + 1, product.stock))}>
              <AddIcon />
            </IconButton>
          </Box>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          Afegeix al carrito
        </Button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
