export interface IUser {
    _id: string;
    email: string;
    password: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
    createdAt: Date;
  }
  
  export enum UserRole {
    CLIENT = 'client',
    CHEF = 'chef',
    LIVREUR = 'livreur'
  }
  
  export interface IUserInput {
    email: string;
    password: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    phone?: string;
    address?: string;
  }