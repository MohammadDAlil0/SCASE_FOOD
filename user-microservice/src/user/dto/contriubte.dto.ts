import { Status } from "nats";
import { User } from "src/models/user.model";

export class changeStatusDto {
    curUser: User;
    dateToCall: Date;
    status: any;
}