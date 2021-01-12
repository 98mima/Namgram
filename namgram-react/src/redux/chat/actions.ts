import { IMessage } from "../../models/chat";
import { IUser } from "../../models/user";
import { getFollowers } from "../../services/profile";
import { SET_ERROR, START_LOADING, STOP_LOADING } from "../ui/actions";


export const SET_CHAT_HEADS = "SET_CHAT_HEADS"
export const CLEAR_CHAT_HEADS = "CLEAR_CHAT_HEADS"

export const NEW_MESSAGE = "NEW_MESSAGE"
export const CLEAR_NEW_MESSAGES = "CLEAR_NEW_MESSAGES"

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

export type ChatActionTypes = SetChatHeadsActions | ClearChatHeads | NewMessageAction | ClearNewMessages

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
