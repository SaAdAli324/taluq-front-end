import zod from "zod";

export const logInSchema = zod.object({
    email: zod.string().email("Invalid email address"),
    password: zod.string().min(6,"Password must be at least 6 characters long").max(100,"Password must be less than 100 characters long"),
})

export type LoginSchema = zod.infer<typeof logInSchema>;