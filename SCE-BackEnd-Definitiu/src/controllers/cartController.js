const AppDataSource = require('../data-source');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    
    const cartRepository = AppDataSource.getRepository(Cart);
    const productRepository = AppDataSource.getRepository(Product);

    console.log('productId', productId);
    console.log('quantity', quantity);
    console.log('userId', userId);

    try {
        const product = await productRepository.findOne({ where: { id: productId } });
        console.log('product', product.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cartItem = await cartRepository.findOne({ where: { userId, productId } });
       
        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            console.log('creating cart item')
            console.log('userId', userId);
            cartItem = cartRepository.create({ userId, productId, quantity });
        }
        console.log('cartItem', cartItem.id);
        await cartRepository.save(cartItem);

        res.status(200).json({ message: 'Product added to cart' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const removeFromCart = async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    const cartRepository = AppDataSource.getRepository(Cart);

    try {
        const cartItem = await cartRepository.findOne({ where: { userId, productId } });
        if (!cartItem) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        await cartRepository.remove(cartItem);
        res.status(200).json({ message: 'Product removed from cart' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateCartItemQuantity = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    const cartRepository = AppDataSource.getRepository(Cart);

    try {
        let cartItem = await cartRepository.findOne({ where: { userId, productId } });
        if (!cartItem) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        cartItem.quantity = Math.max(cartItem.quantity + quantity, 1);
        await cartRepository.save(cartItem);

        res.status(200).json({ message: 'Cart item quantity updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getCart = async (req, res) => {
    const userId = req.user.id;

    const cartRepository = AppDataSource.getRepository(Cart);

    try {
        const cartItems = await cartRepository.find({ where: { userId }, relations: ['product'] });
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getCart,
};
