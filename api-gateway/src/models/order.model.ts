import { Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";

@Table({
    tableName: 'order_table',
    timestamps: true,
    indexes: [
        {
            fields: ['orderId_index'],
            name: 'orderId_index'
        }
    ]
})
export class Order extends BaseModel {
    
}