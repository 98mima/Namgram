import axios from "axios";
import { IPost, IPostUpload } from "../models/post";

export async function getPosts(userId: string) {
    return axios.get<{message: string, Data: IPost[]}>(`post/byId/${userId}`).then(res => {
        return res.data.Data;
    })
}

export async function uploadPost(uploadForm: IPostUpload){
    const formData = new FormData();
    formData.append("image", uploadForm.image);
    formData.append("personId", uploadForm.personId);
    formData.append("caption", uploadForm.caption);
    return axios({
        method: 'post',
        url: 'image/add',
        data: formData,
        headers: {'Content-Type': 'multipart/form-data' }
        });
}