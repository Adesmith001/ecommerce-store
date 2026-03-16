import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default async function SignUpPage() {
  const { userId } = await auth();

  if (userId) {
    redirect(ROUTES.storefront.home);
  }

  return (
    <SignUp
      path={ROUTES.auth.signUp}
      routing="path"
      signInUrl={ROUTES.auth.signIn}
    />
  );
}
