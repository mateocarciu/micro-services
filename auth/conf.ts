import * as dotenv from 'dotenv';
dotenv.config();

interface Env {
    MONGODB_USER: string;
    MONGODB_PWD: string; 
    MONGODB_CLUSTER: string; 
    MONGODB_DATABASE?: string; 
}


export const myEnv: Env = {
    MONGODB_USER: process.env.MONGODB_USER || '',
    MONGODB_PWD : process.env.MONGODB_PWD  || '',
    MONGODB_CLUSTER : process.env.MONGODB_CLUSTER  || '',
    MONGODB_DATABASE : process.env.MONGODB_DATABASE  || '',
}