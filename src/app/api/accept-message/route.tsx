/* eslint-disable @typescript-eslint/no-unused-vars */
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/userModel";
import { User } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect(); // Connecting to database

  // Getting user from session
  const session = await getServerSession(authOptions);
  const user = session?.user;
  if (!session || session.user) {
    return NextResponse.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  const userId = user?._id;
  const { acceptMessages } = await request.json();
  try {
    // Updating user message acceptence
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Unable to find user updated message aceptence status",
        },
        { status: 401 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Message aceptence status successfully updated",
      },
      { status: 500 }
    );
  } catch (error) {
    console.error("Error in updating message aceptence status:", error);
    return NextResponse.json(
      { success: false, message: "Updaing message aceptence status is faild" },
      { status: 500 }
    );
  }
}
