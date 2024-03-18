export enum UserType {
    Teacher, 
    Student
}

export interface User{
    id?: number;
    name?: string;
    email?: string,
    password?: string;

    userType?: UserType;
}