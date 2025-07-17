import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db/client";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google,
    Resend({
      from: "contact@loorbach.dev",
    }),
    Credentials({}),
  ],
});
