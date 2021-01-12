import { IAuth } from "../../models/auth"
import { IChat, IMessage } from "../../models/chat"
import { IUser } from "../../models/user"
import { ChatActionTypes, SET_CHAT_HEADS, CLEAR_CHAT_HEADS, NEW_MESSAGE, CLEAR_NEW_MESSAGES } from "./actions"


export interface ChatState{
    chatHeads: IUser[],
    chat: IChat | undefined,
    chatNotifications: number
}

const initialState: ChatState = {
    chatHeads: [],
    chat: undefined,
     chatNotifications: 0
}

export default (state = initialState, action: ChatActionTypes) => {
    switch(action.type){
        case SET_CHAT_HEADS:
            return {...state, chatHeads: action.payload}
        case CLEAR_CHAT_HEADS:
            return {...state, chatHeads: []}
        case NEW_MESSAGE:
            return {...state, chatNotifications: state.chatNotifications + 1, 
                chat: {chatter: (state.chat as IChat).chatter, 
                    messages: [...(state.chat as IChat).messages, action.payload]}}
        case CLEAR_NEW_MESSAGES:
            return {...state, chatNotifications: 0}
        default:
            return {...state}
    }
}