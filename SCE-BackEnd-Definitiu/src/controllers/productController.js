const AppDataSource = require('../data-source');
const Product = require('../models/Product');

// Obtener todos los productos con filtrado opcional por brand, type y price range
const getAllProducts = async (req, res) => {
    const productRepository = AppDataSource.getRepository(Product);
    const { brand, type, minPrice, maxPrice } = req.query;  // Obtiene brand, type y rango de precios de la query

    try {
        let query = productRepository.createQueryBuilder('product');

        if (brand) {
            query = query.andWhere('product.brand = :brand', { brand });
        }

        if (type) {
            query = query.andWhere('product.type = :type', { type });
        }

        if (minPrice && maxPrice) {
            query = query.andWhere('product.price BETWEEN :minPrice AND :maxPrice', { minPrice, maxPrice });
        } else if (minPrice) {
            query = query.andWhere('product.price >= :minPrice', { minPrice });
        } else if (maxPrice) {
            query = query.andWhere('product.price <= :maxPrice', { maxPrice });
        }

        const products = await query.getMany();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Obtener producto por ID
const getProductById = async (req, res) => {
    const { id } = req.params;
    const productRepository = AppDataSource.getRepository(Product);

    try {
        const product = await productRepository.findOne({ where: { id } });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Crear nuevo producto
const createProduct = async (req, res) => {
    const { name, description, image, price, brand, type, stock } = req.body;
    const productRepository = AppDataSource.getRepository(Product);

    try {
        const product = productRepository.create({
            name,
            description,
            image,
            price,
            brand,
            type,
            stock,
        });
        await productRepository.save(product);

        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Actualizar producto por ID
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, image, price, brand, type, stock } = req.body;
    const productRepository = AppDataSource.getRepository(Product);

    try {
        const product = await productRepository.findOne({ where: { id } });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.image = image || product.image;
        product.price = price || product.price;
        product.brand = brand || product.brand;
        product.type = type || product.type;
        product.stock = stock || product.stock;

        await productRepository.save(product);

        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Eliminar producto por ID
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const productRepository = AppDataSource.getRepository(Product);

    try {
        const product = await productRepository.findOne({ where: { id } });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await productRepository.remove(product);

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Buscar productos por nombre
const searchProductsByName = async (req, res) => {
    const { name } = req.query; // Obtiene el parámetro de búsqueda 'name'
    const productRepository = AppDataSource.getRepository(Product);
    console.log(name);
    try {
        const products = await productRepository.createQueryBuilder('product')
            .where('product.name ILIKE :name', { name: `%${name}%` })
            .getMany();

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Obtener historial de compras del usuario
const getUserPurchaseHistory = async (req, res) => {
    const { id } = req.user;  // Obtiene el ID del usuario autenticado
    const orderRepository = AppDataSource.getRepository(Order);

    try {
        const orders = await orderRepository.find({ where: { userId: id }, relations: ['product'] });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProductsByName,
    getUserPurchaseHistory,
};
