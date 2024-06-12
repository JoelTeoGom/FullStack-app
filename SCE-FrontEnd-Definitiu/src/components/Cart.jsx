import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/ProductListPage.css'; // Importa los estilos CSS

const Cart = ({ product }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Card className="product-card" onClick={handleCardClick} sx={{ cursor: 'pointer' }}>
      <div className="image-container">
        <CardMedia
          component="img"
          image={`/images/${product.image}`} // Construir la ruta completa de la imagen
          alt={product.name}
        />
      </div>
      <CardContent>
        <Typography variant="h5" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          €{product.price}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Cart;
