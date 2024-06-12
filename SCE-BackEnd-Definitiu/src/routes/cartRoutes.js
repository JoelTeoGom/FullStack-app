const express = require('express');
const {
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getCart,
} = require('../controllers/cartController');

const authenticateToken = require('../middlewares/authMiddleware'); // Importa el middleware de autenticación
const router = express.Router();

router.use(authenticateToken); // Aplica el middleware a todas las rutas

router.post('/add', addToCart); // Añadir producto al carrito
router.delete('/remove/:productId', removeFromCart); // Eliminar producto del carrito
router.put('/update', updateCartItemQuantity); // Actualizar cantidad del producto en el carrito
router.get('/', getCart); // Obtener el carrito

module.exports = router;
