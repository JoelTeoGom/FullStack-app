const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Cart',
    tableName: 'cart',
    columns: {
        id: {
            primary: true,
            type: 'uuid',
            generated: 'uuid',
        },
        userId: {
            type: 'uuid',
            nullable: false,
        },
        productId: {
            type: 'uuid',
            nullable: false,
        },
        quantity: {
            type: 'int',
            nullable: false,
        },
    },
    relations: {
        product: {
            target: 'Product',
            type: 'many-to-one',
            joinColumn: { name: 'productId' },
        },
        user: {
            target: 'User',
            type: 'many-to-one',
            joinColumn: { name: 'userId' },
        },
    },
});
