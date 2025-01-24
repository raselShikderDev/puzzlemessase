import z from 'zod'

export const usernameValidation = z
.string()
.min(3, "Username must be contain at least Three Character")
.max(20, "Username must be less than 20 or equal to 20")
.regex(/^[a-zA-Z0-9_]+$/, "username must not contain special Character")

export const signupValidation = z.object({
    username: usernameValidation,
    email: z.string().email({message:"Please provide a valid email address"}),
    password: z.string().min(6, "Password must be contain at leat 6 Chararecter")
})