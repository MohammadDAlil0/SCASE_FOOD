import { Column, DataType, ForeignKey, HasMany, Table } from "sequelize-typescript";
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

    @HasMany(() => Food, {foreignKey: 'foodId', as: 'foods'})
    foods: Food[];

    @Column(DataType.INTEGER)
    number: number;

    @Column(DataType.INTEGER)
    price: number;
}