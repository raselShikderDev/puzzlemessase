import z from 'zod'

export const verifySchema = z.object({
    identifire:z.string(),
    password:z.string()
})
