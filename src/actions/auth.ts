"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";

import { signIn } from "@/auth";
import { RegisterFormData, RegisterSchema } from "@/schemas/auth";
import { hashSync } from "bcrypt-ts";
import { CredentialsSignin } from "next-auth";

export async function register(formData: RegisterFormData) {
  const parsedUser = RegisterSchema.safeParse(formData);

  if (!parsedUser.success) {
    return {
      errors: z.treeifyError(parsedUser.error).properties,
      success: false,
      message: "Form field error!",
    };
  }

  const { name, password, fullname } = parsedUser.data;

  try {
    const userExists = await prisma.user.findUnique({ where: { name } });

    if (userExists)
      return {
        success: false,
        message: "User already exists!",
      };

    const hashedPassword = hashSync(password);

    const userData = {
      name,
      fullname,
      password: hashedPassword,
    };

    const createdUser = await prisma.user.create({
      data: userData,
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
    };
  }
}

const UserLoginSchema = z.object({
  name: z.string().min(3),
  password: z.string().min(6),
});

type LoginCredentials = z.infer<typeof UserLoginSchema>;

export async function login(credentials: LoginCredentials) {
  const parsedCredentials = UserLoginSchema.safeParse(credentials);

  if (!parsedCredentials.success) {
    return {
      errors: z.treeifyError(parsedCredentials.error).properties,
      success: false,
      message: "Form field error!",
    };
  }

  try {
    return await signIn("credentials", { ...parsedCredentials.data });
  } catch (error) {
    if (error instanceof CredentialsSignin) {
      return {
        success: false,
        message: "Invalid credentials!",
      };
    }

    throw error;
  }
}
