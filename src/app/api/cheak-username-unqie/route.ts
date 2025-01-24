import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/userModel";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";
import { NextResponse } from "next/server";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
    
    await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = searchParams.get("username");
    //Cheaing username availablelity
    const usernameResult = usernameQuerySchema.safeParse({ username: queryParams });
    console.log(usernameResult);

    if (!usernameResult.success) {
      const errorMessages = usernameResult.error.errors.map(err => err.message);
      return NextResponse.json(
        {
          success: false,
          message: errorMessages.join(", "),
        },
        { status: 400 }
      );
    }
    

    const { username } = usernameResult.data;
    console.log(usernameResult.data);
    const existingUsername = await userModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUsername) {
      return NextResponse.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Username is uniqe",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in cheaking username:", error);
    return NextResponse.json(
      { success: false, message: "Username Cheaking is faild" },
      { status: 500 }
    );
  }
}
