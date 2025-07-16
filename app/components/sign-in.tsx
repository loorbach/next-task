import { signIn } from "@/auth";

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <button className="text-black bg-white p-2 rounded" type="submit">
        Signin with Google
      </button>
    </form>
  );
}
