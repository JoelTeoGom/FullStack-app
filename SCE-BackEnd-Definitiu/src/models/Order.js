const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
    name: 'Order',
    tableName: 'orders',
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
        createdAt: {
            type: 'timestamp',
            createDate: true,
        },
    },
    relations: {
        user: {
            target: 'User',
            type: 'many-to-one',
            joinColumn: { name: 'userId' },
            onDelete: 'CASCADE',
        },
        products: {
            target: 'Product',
            type: 'many-to-many',
            joinTable: {
                name: 'order_products',
                joinColumn: {
                    name: 'orderId',
                    referencedColumnName: 'id',
                },
                inverseJoinColumn: {
                    name: 'productId',
                    referencedColumnName: 'id',
                },
            },
            cascade: true,
        },
    }
});
