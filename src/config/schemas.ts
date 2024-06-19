import { object, string } from 'zod'

import type { NewPassword } from '@/store/api/passwords/passwords.types'

export const loginSchema = object({
    email: string().min(1, 'Email is required').email(),
    password: string()
        .min(1, 'Password is required')
        .min(8, 'Password must contain at least 8 characters')
})

export const commentSchema = object({
    text: string()
})

export const stageSchema = object({
    name: string().min(1, 'Stage name is required'),
    description: string().optional()
})

export const flowSchema = object({
    name: string().min(1, 'Flow name is required')
})

export const capacitySchema = object({
    per_day: string().min(1, 'Per day is required')
})

const newPasswordSchema = object({
    new_password1: string()
        .min(1, 'Password is required')
        .min(8, 'Password must contain at least 8 characters'),
    new_password2: string().min(1, 'New password confirmation is required')
})

export const changePasswordSchema = object({
    old_password: string()
        .min(1, 'Password is required')
        .min(8, 'Password must contain at least 8 characters'),
    ...newPasswordSchema.shape
}).refine((data: NewPassword) => data.new_password1 === data.new_password2, {
    message: "Passwords don't match",
    path: ['new_password2']
})

export const passwordResetConfirmSchema = object({
    ...newPasswordSchema.shape
}).refine((data: NewPassword) => data.new_password1 === data.new_password2, {
    message: "Passwords don't match",
    path: ['new_password2']
})

export const userPatchSchema = object({
    first_name: string().min(1, 'First name is required'),
    last_name: string().min(1, 'Last name is required'),
    email: string().min(1, 'Email is required').email()
})

export const emailSchema = object({
    email: string().min(1, 'Email is required').email()
})

export const userSchema = object({
    ...userPatchSchema.shape,
    role: string({
        required_error: 'Please select an role'
    })
})
