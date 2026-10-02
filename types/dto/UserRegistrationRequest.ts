import {z} from "zod"

const UserRegistrationRequestSchema = z.object(
    {
    email : z.email(),
    firstName : z.string().max(20),
    lastName : z.string().max(20),
    password : z.string(),
<<<<<<< HEAD
    Privileges : z.never().optional(),
=======
    Privileges : z.never(),
>>>>>>> c86fbe9c3b862555ec5ed17a005f9cf7f277c199
    phone : z.string().optional()
}
)

type UserRegistrationRequest = z.infer<typeof UserRegistrationRequestSchema>

export {UserRegistrationRequestSchema}