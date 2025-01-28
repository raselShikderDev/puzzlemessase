import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/userModel";
import { Message } from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();

  try {
    const user = await userModel.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessage) {
        return NextResponse.json(
            { success: false, message: "User not accepting message" },
            { status: 403 }
          );
    }

    const newMessage = {content, createdAt: new Date()}
    user.message.push(newMessage as Message)
    await user.save
    return NextResponse.json(
        { success: true, message: "Message sent Successfully" },
        { status: 404 }
      );
  } catch (error) {
    console.error('Sending messages faild', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}
