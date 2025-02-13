/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/userModel";
import { User } from "next-auth";
import { NextResponse } from "next/server";
import mongoose, { Aggregate } from "mongoose";
import { Message } from "postcss";

export async function DELETE(
  request: Request,
  { params }: { params: { messageId: string } }
) {
  await dbConnect();
  const messageId = params.messageId;
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  try {
    const updatedResult = await userModel.updateOne(
      { _id: user._id },
      { $pull: { message: { _id: messageId } } }
    );

    if (updatedResult.modifiedCount == 0) {
      return NextResponse.json(
        { success: false, message: "Message not found or already deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { success: false, message: "Message deleting faild" },
      { status: 500 }
    );
  }
}
