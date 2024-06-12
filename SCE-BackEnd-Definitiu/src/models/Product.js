const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Product',
    tableName: 'products',
    columns: {
        id: {
            primary: true,
            type: 'uuid',
            generated: 'uuid',
        },
        name: {
            type: 'varchar',
            nullable: false,
        },
        description: {
            type: 'text',
            nullable: true,
        },
        image: {
            type: 'varchar',
            nullable: true,
        },
        price: {
            type: 'decimal',
            nullable: false,
        },
        brand: {
            type: 'varchar',
            nullable: false,
        },
        type: {
            type: 'varchar',
            nullable: false,
        },
        stock: {
            type: 'int',
            nullable: false,
        },
        stripePriceId: {
            type: 'varchar',
            nullable: false,
        }
    }
});
