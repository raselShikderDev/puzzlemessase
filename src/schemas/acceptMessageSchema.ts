import z from 'zod'

export const messageAcceptValidation = z.object({
    acceptMessage: z.boolean()
})