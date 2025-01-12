import { AllowNull, Column, DataType, Length, NotEmpty, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";

@Table({
    tableName: 'restaurant_tablel',
    timestamps: true,
    indexes: [
        {
            fields: ['id'],
            name: 'restaurantId_index'
        }
    ]
})
export class Restaurant extends BaseModel {
    @NotEmpty
    @Length({ max: 64 })
    @Column(DataType.STRING)
    name: string;

    @AllowNull
    @Column(DataType.STRING)
    phoneNumber?: string;

    @AllowNull
    @Column(DataType.STRING)
    picturePath?: string

    @AllowNull
    @Column(DataType.STRING)
    adress?: string;
}
