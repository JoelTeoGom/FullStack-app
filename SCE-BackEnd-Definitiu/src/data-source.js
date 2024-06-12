const { DataSource } = require('typeorm');
require('dotenv').config();  // Cargar variables de entorno desde .env

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [
        'src/models/**/*.js'
    ],
    migrations: [
        'src/migration/**/*.js'
    ],
    subscribers: [
        'src/subscriber/**/*.js'
    ],
});

module.exports = AppDataSource;
