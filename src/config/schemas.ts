import { object, string } from 'zod'

export const loginSchema = object({
    email: string().min(1, 'Email is required').email(),
    password: string()
        .min(1, 'Password is required')
        .min(8, 'Password must contain at least 8 characters')
})
