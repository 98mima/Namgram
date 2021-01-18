import { IMessage } from "../../models/chat";
import { IUser } from "../../models/user";
import { loadUserMessages, sendToUser } from "../../services/chat";
import { getFollowers, getProfileByUsername } from "../../services/profile";
import { SET_ERROR, START_LOADING, STOP_LOADING } from "../ui/actions";


export const SET_CHAT_HEADS = "SET_CHAT_HEADS"
export const CLEAR_CHAT_HEADS = "CLEAR_CHAT_HEADS"

export const NEW_MESSAGE = "NEW_MESSAGE"
export const CLEAR_NEW_MESSAGES = "CLEAR_NEW_MESSAGES"

export const LOAD_CHAT = "LOAD_CHAT"
export const MESSAGE_SENT = "MESSAGE_SENT"

export interface SetChatHeadsActions {
    type: typeof SET_CHAT_HEADS,
    payload: IUser[]
}

export interface ClearChatHeads {
    type: typeof CLEAR_CHAT_HEADS
}

export interface NewMessageAction {
    type: typeof NEW_MESSAGE,
    payload: IMessage
}

export interface ClearNewMessages {
    type: typeof CLEAR_NEW_MESSAGES
}

export interface LoadChatAction {
    type: typeof LOAD_CHAT,
    payload: {messages: IMessage[], chatter: IUser}
}

export interface MessageSentAction {
    type: typeof MESSAGE_SENT,
    payload: IMessage
}

export type ChatActionTypes = SetChatHeadsActions | ClearChatHeads | NewMessageAction | ClearNewMessages | MessageSentAction | LoadChatAction

export const loadChatHeads = (username: string) => (dispatch: any) => {
    dispatch({type: START_LOADING});
    getFollowers(username).then(users => {
        dispatch({type: SET_CHAT_HEADS, payload: users});
        dispatch({type: STOP_LOADING});
    }).catch(err => {
        dispatch({type: STOP_LOADING});
        dispatch({type: SET_ERROR, payload: err})
    })
  };

  export const loadChat = (username: string, username2: string) => (dispatch: any) => {
    loadUserMessages(username, username2).then((messages: {sender: string, message: string, date: Date}[]) => {
        console.log(messages)
        const msgs: IMessage[] = messages.map(value => {
            const msg: IMessage = {myMessage: username === value.sender, body: value.message, date: value.date};
            return msg;
        })
        getProfileByUsername(username2).then(user => {
            dispatch({type: LOAD_CHAT, payload: {messages: msgs, chatter: user}})
        })
    }).catch(err => console.log(err))
  }

  export const sendMessage = (from: string, to: string, content: string) => (dispatch: any) => {
    sendToUser(from, to, content).then(res => {
        const msg: IMessage = {body: content, myMessage: true, date: new Date()}
        dispatch({type: MESSAGE_SENT, payload: msg})
    })
  }