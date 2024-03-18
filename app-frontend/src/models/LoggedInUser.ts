import { User } from "./User";

export interface LoggedInUser{
    user: User;
    token: string;
}