const AppDataSource = require('../data-source');

const connectDB = async () => {
    try {
        await AppDataSource.initialize();
        console.log('PostgreSQL connected');
    } catch (error) {
        console.error('Error connecting to the database', error);
        process.exit(1);
    }
};

module.exports = connectDB;
