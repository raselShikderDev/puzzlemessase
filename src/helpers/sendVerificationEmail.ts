import { resend } from "@/lib/resendEmail";
import VerificationEmail from "../../emails/verificationEmail";
import apiResponse from "@/types/appResponse";
import { string } from "zod";

export async function sendEmailVerificationEmail(
  email:string,
  username:string,
  verifyCode:string,
):Promise<apiResponse>{
  try {
    await resend.emails.send({
      from: 'puzzlemessage <@puzzlemessage.dev>',
      to: email,
      subject: 'Verify your email',
      react: VerificationEmail({username, otp: verifyCode}),
    });
    return {
      success:true,
      message: "Email successfully send"
    }
  } catch (emailError) {
    console.error(`Sending email is faild ${emailError}`)
    return {
      success:false,
      message: "Faild to send Email"
    }
  }
}

