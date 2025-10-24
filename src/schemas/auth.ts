import * as z from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(3, "Username must be at least 3 characters long"),
  fullname: z.string().min(3, "Name must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type RegisterFormData = z.infer<typeof RegisterSchema>;
