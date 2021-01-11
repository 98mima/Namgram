import axios from "axios";
import { IBasicPost, IImage, IPost, IPostUpload } from "../models/post";

export async function getPosts(userId: string) {
  return axios
    .get<{ message: string; Data1: IImage[] }>(`image/byId/${userId}`)
    .then((res) => {
      return res.data.Data1;
    });
}

export async function likePost(userId: string, imageId: string) {
    return axios.post<{imageId: string, personId: string}>(`image/like`, {
        imageId, personId: userId
    }).then(res => {
        return res.data;
    })
}

export async function dislikePost(userId: string, imageId: string) {
    return axios.post<{imageId: string, personId: string}>(`image/dislike`, {
        imageId, personId: userId
    }).then(res => {
        return res.data;
    })
}

export async function getFollowerPosts(userId: string) {
  return axios
    .get<{ message: string; Data: IImage[] }>(`image/byFollowings/${userId}`)
    .then((res) => res.data.Data);
}

export async function uploadPost(uploadForm: IPostUpload) {
  const formData = new FormData();
  formData.append("image", uploadForm.image);
  formData.append("personId", uploadForm.personId);
  formData.append("caption", uploadForm.caption);
  return axios({
    method: "post",
    url: "image/add",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function uploadBasicPost(uploadForm: IBasicPost) {
  return axios
    .post<{ content: string; personId: string }>("post/add", {
      content: uploadForm.content,
      personId: uploadForm.personId,
    })
    .then((res) => {
      return res.data;
    });
}
export async function like(personId: string, postId: string) {
  return axios
    .post<{ personId: string; postId: string }>("post/like", {
      personId: personId,
      postId: postId,
    })
    .then((res) => {
      return res.data;
    });
}
export async function dislike(personId: string, postId: string) {
  return axios
    .post<{ personId: string; postId: string }>("post/dislike", {
      personId: personId,
      postId: postId,
    })
    .then((res) => {
      return res.data;
    });
}
