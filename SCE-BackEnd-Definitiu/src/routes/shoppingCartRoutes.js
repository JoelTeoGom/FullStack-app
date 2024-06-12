const express = require('express');
const {
    createOrder,
    getUserPurchaseHistory,
    getOrderById,

} = require('../controllers/shoppingCartController');

const authenticateToken = require('../middlewares/authMiddleware'); // Importa el middleware de autenticación
const router = express.Router();

router.use(authenticateToken); // Aplica el middleware a todas las rutas

router.post('/create', createOrder); // Crear un nuevo pedido
router.get('/history', getUserPurchaseHistory); // Obtener el historial de compras
router.get('/:id', getOrderById); // Obtener un pedido por ID

module.exports = router;
