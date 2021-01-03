import axios from "axios";
import { IPost } from "../models/post";

export async function getPosts(userId: string) {
    return axios.get<{message: string, Data: IPost[]}>(`post/byId/${userId}`).then(res => {
        return res.data.Data;
    })
}