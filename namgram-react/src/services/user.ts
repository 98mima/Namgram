import axios from 'axios'
import { IUser } from '../models/user';

export async function getUserById(id: string){
    return axios.get<{message: string, Data: IUser}>(`person/byId/${id}`).then(d => d.data);
}