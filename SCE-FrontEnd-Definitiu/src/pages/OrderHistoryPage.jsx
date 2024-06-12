import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';
import '../styles/OrderHistoryPage.css'; // Asegúrate de tener el archivo CSS para estilos
import Navbar from '../components/Navbar'; // Importa el component Navbar
import { useNavigate } from 'react-router-dom';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/shopping-cart/history', {
          withCredentials: true, // Aquí estamos configurando axios para enviar las cookies
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  if (loading) {
    return <div>Carregant...</div>;
  }

  if (error) {
    return <div>Error carregant l'historial: {error.message}</div>;
  }

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
    <div>
      <Navbar />
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <div className="order-history-page">
        <h1>Historial de comandes</h1>
        {orders.length === 0 ? (
          <p>No s'han trobat comandes</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-card">
              <h2>ID de la comanda: {order.id}</h2>
              <p>Data de la comanda: {new Date(order.createdAt).toLocaleDateString()}</p>
              <h3>Productes:</h3>
              <div className="products-list">
                {order.products.map((product) => (
                  <Card key={product.productId} className="product-card">
                    <div className="image-container">
                      <CardMedia
                        component="img"
                        image={`/images/${product.imageUrl}`} // Construir la ruta completa de la imagen
                        alt={product.productName}
                      />
                    </div>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {product.productName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Quantitat: {product.quantity}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Preu: €{product.price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Subtotal: €{(product.price * product.quantity).toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <h3>Total: €{order.total.toFixed(2)}</h3>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
