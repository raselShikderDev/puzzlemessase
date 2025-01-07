import mongoose, {Schema, Document} from 'mongoose'

export interface Message extends Document{
    content: string,
    createdAt: Date,
}

export const MessageSchema: Schema<message> = new Schema({
    content:{
        type:String,
        requried:true,
    },
    createdAt:{
        type:Date,
        requried:true,
        default:Date.now()
    },

})