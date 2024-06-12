// src/components/Navbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import fotoLogo from '../images/foto.webp';
import carrito from '../images/carrito.png';
import historial from '../images/historial.png';
import '../styles/Navbar.css'; // Importa el fitxer CSS

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Link to="/products">
          <img src={fotoLogo} alt="Logo de la botiga" className="navbar-logo" />
        </Link>
        <Typography variant="h4" className="navbar-title">
          Tenda de boxa
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Link to="/order-history">
          <img src={historial} alt="Historial" className="navbar-history" />
        </Link>
        <Link to="/cart">
          <img src={carrito} alt="Carrito" className="navbar-cart" />
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;