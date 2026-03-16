import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default async function SignInPage() {
  const { userId } = await auth();

  if (userId) {
    redirect(ROUTES.storefront.home);
  }

  return (
    <SignIn
      path={ROUTES.auth.signIn}
      routing="path"
      signUpUrl={ROUTES.auth.signUp}
    />
  );
}
