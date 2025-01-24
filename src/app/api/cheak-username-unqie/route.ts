import dbConnect from "@/lib/dbConnect";
import userModel from "@/models/userModel";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";
import { NextRequest, NextResponse } from "next/server";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

export default async function CheakUserName(request: NextRequest) {
    if (request.method !== 'GET') {
        return NextResponse.json(
          {
            success: false,
            message: `Requested ${request.method} is not available`,
          },
          { status: 500 }
        );
    }
    await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = searchParams.get("username");
    //Cheaing username availablelity
    const usernameResult = usernameQuerySchema.safeParse(queryParams);
    console.log(usernameResult);

    if (!usernameResult.success) {
      const usernameError =
        usernameResult.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            usernameError?.length > 0
              ? usernameError.join(",")
              : "Invalid query parameters",
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
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Username is already taken",
      },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error in cheaking username:", error);
    return NextResponse.json(
      { success: false, message: "Username Cheaking is faild" },
      { status: 500 }
    );
  }
}
