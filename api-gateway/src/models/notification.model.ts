import { Column, DataType, ForeignKey, Length, NotEmpty, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { User } from "./user.model";

@Table({
    tableName: 'notification_tablel',
    timestamps: true,
    indexes: [
        {
            fields: ['id'],
            name: 'notificationId_index'
        }
    ]
})
export class Notification extends BaseModel {
     @ForeignKey(() => User)
    @Column(DataType.UUID)
    userId: string;

    @NotEmpty
    @Length({ max: 30 })
    @Column(DataType.STRING)
    title: string;

    @NotEmpty
    @Column(DataType.STRING)
    desciption: string;
}
