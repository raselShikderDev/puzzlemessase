/* eslint-disable @typescript-eslint/no-unused-vars */
import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/userModel";
import { usernameValidation } from "@/schemas/signupSchema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const deCodedUsername = decodeURIComponent(username);
    const user = await userModel.findOne({ username: deCodedUsername });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Username is not found" },
        { status: 500 }
      );
    }

    //    const verifiedCode = user.verify

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifiedCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      // Updating user status if everything is fine
      user.isVerified = true;
      user.save();
      return NextResponse.json(
        { success: true, message: "Account Verified Successfully" },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return NextResponse.json(
        {
          success: true,
          message: "Verification code expired! Please signup again",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Incorrect verification code" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in verifying user:", error);
    return NextResponse.json(
      { success: false, message: "Username verifying is faild" },
      { status: 500 }
    );
  }
}
