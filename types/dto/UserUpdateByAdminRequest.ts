import z from "zod";

const UserUpdateByAdminRequestSchema = z.object(
    {
        email : z.email().optional(),
        firstName : z.string().max(20).optional(),
        lastName : z.string().max(20).optional(),
        password : z.never().optional(),
    }
)

export type UserUpdateByAdminRequest = z.infer<typeof UserUpdateByAdminRequestSchema>

export {UserUpdateByAdminRequestSchema}