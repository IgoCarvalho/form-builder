import "server-only";

import { auth } from "@/auth";
import { User } from "next-auth";

class UserNotFoundError extends Error {}

export async function currentUser() {
  const session = await auth();

  const { user } = session ?? {};

  if (!user || !user.id) {
    throw new UserNotFoundError();
  }

  return user as User & { id: string };
}
