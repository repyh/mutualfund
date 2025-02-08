import Role from '../enums/Role';

export default interface User {
    id: string;
    origin: string;
    username: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}