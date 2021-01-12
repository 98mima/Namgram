import { IUser } from "./user";

export interface IMessage {
    myMessage: boolean,
    date: Date,
    body: string
}

export interface IChat {
    chatter: IUser,
    messages: IMessage[]
}