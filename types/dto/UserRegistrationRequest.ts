import {z} from "zod"

const UserRegistrationRequestSchema = z.object(
    {
    email : z.email(),
    firstName : z.string().max(20),
    lastName : z.string().max(20),
    password : z.string(),
    Privileges : z.never(),
    phone : z.string().optional()
}
)

type UserRegistrationRequest = z.infer<typeof UserRegistrationRequestSchema>

export {UserRegistrationRequestSchema}