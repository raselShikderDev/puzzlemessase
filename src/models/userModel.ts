import mongoose, {Schema, Document} from 'mongoose'

// Interface for Message Models
export interface Message extends Document{
    content: string,
    createdAt: Date,
}

// Schema of Message Models
export const MessageSchema: Schema<Message> = new Schema({
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

// Interface for user Models
export interface User extends Document{
    username:string,
    email:string,
    password:string,
    verifyCode:string,
    verifiedCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMessage:boolean,
    message:Message[],
}

// Schema of user Model
export const UserSchema:Schema<User> = new Schema({
    username:{
        type:String,
        required:[true, "Username is required"],
        trim:true,
        unique:true,
    },
    email:{
        type:String,
        required:[true, "Email is required"],
        unique:true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please add a valid email address"]
    },
    password:{
        type:String,
        required:[true, "Password code is Required"]
    },
    verifyCode:{
        type:String,
        required:[true, "Verify code is Required"]
    },
    verifiedCodeExpiry:{
        type:Date,
        required:[true, "Verify code is Required"],
        default:Date.now(),
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    isAcceptingMessage:{
        type:Boolean,
        default:true,
    },
    message:[MessageSchema],

})

const userModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default userModel