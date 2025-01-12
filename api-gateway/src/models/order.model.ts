import { BelongsTo, BelongsToMany, Column, DataType, Default, ForeignKey, HasMany, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { User } from "./user.model";
import { Food } from "./food.model";
import { foodOrder } from "./food-order.model";
import { StatusOfOrder } from "src/core/constants/enums";

@Table({
    tableName: 'order_table',
    timestamps: true,
    indexes: [
        {
            fields: ['id'],
            name: 'orderId_index'
        }
    ]
})
export class Order extends BaseModel {
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    createdBy: string;

    @BelongsTo(() => User, { foreignKey: 'createdBy', as: 'creator' })
    creator: User;

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    contributorId: string;

    @BelongsTo(() => User, { foreignKey: 'contributorId', as: 'contributor' } )
    contributor: User;

    @Column(DataType.INTEGER)
    numberOfContribution: number;

    @BelongsToMany(() => Food, () => foodOrder)
    foods: Food[];

    @Column(DataType.INTEGER)
    totalPrice: number;

    @Default(StatusOfOrder.ONGOING)
    @Column(DataType.ENUM(...Object.values(StatusOfOrder)))
    statusOfOrder: StatusOfOrder;
}