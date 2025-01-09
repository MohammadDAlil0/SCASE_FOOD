import { BelongsTo, Column, DataType, ForeignKey, Length, Min, NotEmpty, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { Restaurant } from "./restaurant.mode";

@Table({
    tableName: 'food_table',
    timestamps: true,
    indexes: [
        {
            fields: ['id'],
            name: 'foodId_index'
        }
    ]
})
export class Food extends BaseModel {
    @NotEmpty
    @Length({ max: 64 })
    @Column(DataType.STRING)
    name: string;

    @NotEmpty
    @Min(0)
    @Column(DataType.INTEGER)
    price: number;

    @ForeignKey(() => Restaurant)
    @Column(DataType.UUID)
    restaurantId: string;

    @BelongsTo(() => Restaurant, { foreignKey: 'roleChangedBy', as: 'roleChangedByUser' })
    restaurant: Restaurant;
}