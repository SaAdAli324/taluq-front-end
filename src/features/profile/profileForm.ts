import{ z }from 'zod'

export const profileSchema = z.object({
    name:z.string().min(3,{message:"name must be at least 3 characters long"}),
    biography:z.string().max(100,{message:"biography must be at most 100 characters long"}),
    profilePics:z.any().optional()




    
})
export type ProfileSchema = z.infer <typeof profileSchema>