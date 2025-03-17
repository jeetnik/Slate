import { z } from "zod";

const emailSchema = z.string().email({ message: "Invalid email format" });

const nameSchema = z.string()
    .min(3, { message: "Name must be at least 3 characters" })
    .max(15, { message: "Name must be less than 15 characters" });

const photoSchema = z.string().url({ message: "Invalid URL" }).optional();

const passwordSchema = z.string()
    .min(6, { message: "Password must contain at least 6 characters" })
    .max(30, { message: "Password cannot exceed 30 characters" })
    .refine((value) => /[0-9]/.test(value), { message: "Password must contain at least one digit" })
    .refine((value) => /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value), { message: "Password must contain at least one special character" });

export const UserSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
    name: nameSchema,
    photo: photoSchema, 
});

export const SignSchema = z.object({
    email: emailSchema,
    password: passwordSchema,
});

export const CreateRoomSchema = z.object({
    name: z.string()
        .min(2, { message: "Room name must contain at least 2 characters" })
        .max(10, { message: "Room name cannot exceed 10 characters" }),
});


export const JWT_CODE = process.env.JWT_CODE||"";
