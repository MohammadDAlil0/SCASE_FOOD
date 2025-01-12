import { BelongsTo, Column, DataType, ForeignKey, HasMany, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { Food } from "./food.model";
import { Order } from "./order.model";

@Table({
    tableName: 'foodOrder_table',
    timestamps: true
})
export class foodOrder extends BaseModel {
    @ForeignKey(() => Food)
    @Column(DataType.UUID)
    foodId: string;

    @ForeignKey(() => Order)
    @Column(DataType.UUID)
    orderId: string;

    @BelongsTo(() => Food, {foreignKey: 'foodId', targetKey: 'id'}) 
    food: Food;

    @Column(DataType.INTEGER)
    number: number;

    @Column(DataType.INTEGER)
    price: number;
}
