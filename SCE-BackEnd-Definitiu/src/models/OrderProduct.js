const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'OrderProduct',
    tableName: 'order_products',
    columns: {
        orderId: {
            primary: true,
            type: 'uuid',
        },
        productId: {
            primary: true,
            type: 'uuid',
        },
        quantity: {
            type: 'int',
            nullable: false,
        },
    },
    relations: {
        order: {
            target: 'Order',
            type: 'many-to-one',
            joinColumn: { name: 'orderId' },
            onDelete: 'CASCADE',
        },
        product: {
            target: 'Product',
            type: 'many-to-one',
            joinColumn: { name: 'productId' },
            onDelete: 'CASCADE',
        },
    }
});
