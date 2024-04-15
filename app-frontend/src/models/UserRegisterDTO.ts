import { UserType } from "./User";

export interface UserRegisterDTO{
    // common fields to all user types
    name: string;
    email: string,
    password: string;

    userType: UserType;

    // student fields
    nickname?: string;
    uniqueIdentificationCode?: string;
}