import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="py-16 sm:py-20">
      <Container className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="w-full max-w-md">{children}</div>
      </Container>
    </main>
  );
}
