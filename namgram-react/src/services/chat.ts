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
    .post<{ messages: { sender: string; message: string; date: string }[] | any[] }>(
      `chat/join`, {username, username2}
    )
    .then((res) => {
      if(res.data.messages)
        return res.data.messages;
      else
        return res.data;
    });
}
