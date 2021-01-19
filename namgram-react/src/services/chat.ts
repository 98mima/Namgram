import axios from "axios";

export async function sendToUser(from: string, to: string, content: string) {
  return axios
    .post(`chat/send`, {
      usernameSender: from,
      usernameReceiver: to,
      message: content,
    })
    .then((res) => res.data);
}

export async function loadUserMessages(username: string, username2: string) {
  return axios
    .get<{ sender: string; message: string; date: string }[]>(
      `chat/getMessages/${username}/${username2}`
    )
    .then((res) => res.data);
}
