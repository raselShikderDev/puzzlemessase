import z from 'zod'

export const messageValidation = z.object({
    content: z
        .string()
        .min(10, "Message must be contain minimum 10 Character")
        .max(300, "Message not be longer than 300 character")
})