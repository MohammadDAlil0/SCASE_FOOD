import { AllowNull, BelongsTo, Column, DataType, Default, ForeignKey, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { User } from "./user.model";
import { Status } from "src/constants/enums";

@Table({
    tableName: 'contributor_table',
    timestamps: true,
    indexes: [
        {
            fields: ['id'],
            name: 'contributorId_index'
        }
    ]

})
export class Contributor extends BaseModel {
    @ForeignKey(() => User)
    @Column(DataType.UUID)
    contributorId: string;

    @BelongsTo(() => User, { foreignKey: 'contributorId', as: 'contributor' } )
    contributor: User;


    // orders: Order

    @AllowNull(true)
    @Column(DataType.INTEGER)
    totalPrice: number;

    @Column(DataType.DATE)
    dataToCall: Date;

    @Default(Status.ONGOING)
    @Column(DataType.ENUM(...Object.values(Status)))
    status: Status;
}