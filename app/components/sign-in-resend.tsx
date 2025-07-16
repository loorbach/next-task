import { signIn } from "@/auth";

export function SignInResend() {
  return (
    <form
      action={async (formData) => {
        "use server";
        await signIn("resend", formData);
      }}
    >
      <input
        type="text"
        name="email"
        placeholder="Email"
        className="border rounded px-2"
      />
      <button className="text-black bg-white p-2 rounded" type="submit">
        Signin with Resend
      </button>
    </form>
  );
}
