import {z} from "zod";

export const signUpSchema = z.object({
    name: z.string().min(3,"Name must be at least 3 characters long").max(50,"Name must be less than 50 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6,"Password must be at least 6 characters long").max(100,"Password must be less than 100 characters long"),
})

export type SignUpSchema = z.infer<typeof signUpSchema>;