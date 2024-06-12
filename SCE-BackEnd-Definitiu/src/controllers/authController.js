const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const AppDataSource = require('../data-source');
const User = require('../models/User');

const register = async (req, res) => {
    const { name, email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    try {
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = userRepository.create({ name, email, password: hashedPassword });
        await userRepository.save(user);

        res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    try {
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generar el token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Configurar la cookie
        const serializedCookie = cookie.serialize('token', token, {
            httpOnly: true,      // Solo accesible desde HTTP, no desde JavaScript
            secure: process.env.NODE_ENV === 'production', // Solo en HTTPS en producción
            sameSite: 'strict',  // Protección contra CSRF
            maxAge: 3600,        // 1 hora
            path: '/',           // Ruta en la que la cookie es válida
        });

        // Establecer la cookie en la respuesta
        res.setHeader('Set-Cookie', serializedCookie);

        // Responder con éxito
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const logout = (req, res) => {
    // Eliminar la cookie JWT
    const serializedCookie = cookie.serialize('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0, // Expira inmediatamente
        path: '/',
    });

    res.setHeader('Set-Cookie', serializedCookie);
    res.status(200).json({ message: 'Logout successful' });
};


const validateToken = (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(200).json({ message: 'Token is valid' });
    });
};



module.exports = {
    register,
    login,
    logout,
    validateToken,
};
