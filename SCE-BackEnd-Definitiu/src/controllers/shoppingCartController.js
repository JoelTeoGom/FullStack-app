const AppDataSource = require('../data-source');
const Order = require('../models/Order');
const OrderProduct = require('../models/OrderProduct');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// Crear un nuevo pedido
const createOrder = async (req, res) => {
    const { productIds, quantities } = req.body;
    const userId = req.user.id;

    if (!productIds || !quantities || productIds.length !== quantities.length) {
        return res.status(400).json({ message: 'Invalid product IDs or quantities' });
    }

    const orderRepository = AppDataSource.getRepository(Order);
    const orderProductRepository = AppDataSource.getRepository(OrderProduct);
    const productRepository = AppDataSource.getRepository(Product);
    const cartRepository = AppDataSource.getRepository(Cart);
    
    try {
        // Crear el pedido
        const order = orderRepository.create({ userId });
        await orderRepository.save(order);

        // Asocia los productos con el pedido
        for (let i = 0; i < productIds.length; i++) {
            const product = await productRepository.findOne({ where: { id: productIds[i] } });
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${productIds[i]} not found` });
            }

            const orderProduct = orderProductRepository.create({
                orderId: order.id,
                productId: product.id,
                quantity: quantities[i],
            });
            await orderProductRepository.save(orderProduct);

            // Actualiza el stock del producto
            product.stock -= quantities[i];
            await productRepository.save(product);
        }

        // Eliminar todos los artículos del carrito del usuario
        await cartRepository.delete({ userId });

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Obtener el historial de compras del usuario
const getUserPurchaseHistory = async (req, res) => {
    const userId = req.user.id;
    const orderRepository = AppDataSource.getRepository(Order);
    const orderProductRepository = AppDataSource.getRepository(OrderProduct);

    try {
        console.log('userId', userId);

        // Paso 1: Buscar todas las órdenes del usuario
        const orders = await orderRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' }  // Ordenar por fecha de creación descendente
        });

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this user' });
        }

        // Paso 2: Para cada orden, buscar los productos asociados y su cantidad
        const orderDetails = await Promise.all(orders.map(async (order) => {
            const orderProducts = await orderProductRepository.find({
                where: { orderId: order.id },
                relations: ['product']
            });

            return {
                ...order,
                products: orderProducts.map(op => ({
                    productId: op.product.id,
                    productName: op.product.name, 
                    imageUrl: op.product.image, 
                    price: op.product.price, // Añadir el precio del producto
                    quantity: op.quantity,
                })),
                total: orderProducts.reduce((acc, op) => acc + (op.product.price * op.quantity), 0) // Calcular el total de la orden
            };
        }));

        res.json(orderDetails);
        console.log(orderDetails);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};





// Obtener un pedido por ID
const getOrderById = async (req, res) => {
    const { id } = req.params;
    const orderRepository = AppDataSource.getRepository(Order);

    try {
        const order = await orderRepository.findOne({ where: { id }, relations: ['products'] });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createOrder,
    getUserPurchaseHistory,
    getOrderById,
};
