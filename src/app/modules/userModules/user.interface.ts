import { Model } from 'mongoose'

export interface User {
    id: string;
    name: string;
    email: string;
    imageUrl?: string;
    password: string;
    role?: 'admin' | 'editor' | 'author'
}

// methods interface
export interface IUserModel extends Model<User> {
    isUserExists(id: string): Promise<User | null>
}


export default User
