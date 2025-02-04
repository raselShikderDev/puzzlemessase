import { Message } from "@/models/userModel";

export interface apiResponse{
    success: boolean,
    message: string,
    isAcceptingMessage?:boolean,
    messages: Array<Message>
}

