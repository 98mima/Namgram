import { IAuth } from "../../models/auth"
import { IUser } from "../../models/user"
import { ChatActionTypes, SET_CHAT_HEADS, CLEAR_CHAT_HEADS } from "./actions"


export interface ChatState{
    chatHeads: IUser[]
}

const initialState: ChatState = {
    chatHeads: []
}

export default (state = initialState, action: ChatActionTypes) => {
    switch(action.type){
        case SET_CHAT_HEADS:
            return {...state, chatHeads: action.payload}
        case CLEAR_CHAT_HEADS:
            return {...state, chatHeads: []}
        default:
            return {...state}
    }
}