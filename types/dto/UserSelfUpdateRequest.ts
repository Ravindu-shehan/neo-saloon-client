import z from "zod"

export const UserSelfUpdateRequestSchema = z.object(
    {
        email : z.email().optional(),
        firstName : z.string().max(20).optional(),
        lastName : z.string().max(20).optional(),
        password : z.never().optional(),
    }
)