import { RootState } from "..";
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
export const CLEAR_CHAT = "CLEAR_CHAT"

export interface SetChatHeadsActions {
    type: typeof SET_CHAT_HEADS,
    payload: IUser[]
}

export interface ClearChatHeads {
    type: typeof CLEAR_CHAT_HEADS
}

export interface NewMessageAction {
    type: typeof NEW_MESSAGE
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

export interface ClearChatAction {
    type: typeof CLEAR_CHAT
}

export type ChatActionTypes = SetChatHeadsActions | ClearChatHeads | NewMessageAction | ClearNewMessages | MessageSentAction | LoadChatAction | ClearChatAction

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

  export const loadChat = (username: string, username2: string) => async (dispatch: any) => {
      //@ts-ignore
    const messages: {sender: string, message: string, date: string}[] = await loadUserMessages(username, username2);
    const msgs: IMessage[] = messages.map(value => {
        const msg: IMessage = {myMessage: username === value.sender, body: value.message, date: value.date};
        return msg;
    })
    const user: IUser = await getProfileByUsername(username2);
    
    dispatch({type: LOAD_CHAT, payload: {messages: msgs, chatter: user}})
  }

  export const sendMessage = (from: string, to: string, content: string) => (dispatch: any) => {
    sendToUser(from, to, content).then(res => {
        const msg: IMessage = {body: content, myMessage: true, date: new Date().toUTCString()};
        dispatch({type: MESSAGE_SENT, payload: msg});
    })
  }

  export const messageReceived = (from: string, to: string, body: string) => (dispatch: any, getState: any) => {
      const state: RootState = getState();
      const {chatter} = state.chat;
      const msg: IMessage = {body, myMessage: false, date: new Date().toUTCString()}
      dispatch({type: MESSAGE_SENT, payload: msg})
      dispatch({type: NEW_MESSAGE});
  }