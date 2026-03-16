"use client";

import Link from "next/link";
import { useState } from "react";
import {
  UserButton,
  useAuth,
  useUser,
} from "@clerk/nextjs";
import { APP_NAME } from "@/constants/app";
import { ROUTES, STOREFRONT_NAV_LINKS } from "@/constants/routes";
import { STORE_TAGLINE } from "@/constants/storefront";
import { getRoleFromMetadata, isAdminRole } from "@/lib/auth/roles";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m20 20-3.5-3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 4h2l2.3 10.1a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="19" r="1.2" fill="currentColor" />
      <circle cx="17" cy="19" r="1.2" fill="currentColor" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 19c1.5-3 4-4.5 7-4.5s5.5 1.5 7 4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StorefrontHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const role = getRoleFromMetadata(user?.publicMetadata?.role);
  const isSignedIn = Boolean(userId);
  const showAdminLink = isAdminRole(role);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-white/85 backdrop-blur">
      <Container className="space-y-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link className="flex items-center gap-3 text-lg font-semibold tracking-tight" href="/">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground">
              AS
            </span>
            <div>
              <span className="block">{APP_NAME}</span>
              <span className="hidden text-xs font-normal text-muted-foreground sm:block">
                {STORE_TAGLINE}
              </span>
            </div>
          </Link>

          <div className="hidden max-w-xl flex-1 items-center gap-3 lg:flex">
            <div className="relative flex-1">
              <Input
                aria-label="Search storefront"
                className="pl-10"
                placeholder="Search products, categories, and collections"
              />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <SearchIcon />
              </span>
            </div>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button
              aria-label="Open cart"
              className={buttonVariants({
                className: "h-11 w-11 rounded-full px-0",
                variant: "outline",
              })}
              type="button"
            >
              <CartIcon />
            </button>
            {!isLoaded ? (
              <div className="h-11 w-24 rounded-full bg-muted" />
            ) : null}
            {isLoaded && !isSignedIn ? (
              <>
                <Link
                  className={buttonVariants({ variant: "outline" })}
                  href={ROUTES.auth.signIn}
                >
                  Sign in
                </Link>
                <Link className={buttonVariants({})} href={ROUTES.auth.signUp}>
                  Sign up
                </Link>
              </>
            ) : null}
            {isLoaded && isSignedIn ? (
              <>
                {showAdminLink ? (
                  <Link
                    className={buttonVariants({ variant: "outline" })}
                    href={ROUTES.admin.dashboard}
                  >
                    Admin
                  </Link>
                ) : null}
                <div className="flex h-11 items-center rounded-full border border-border bg-white px-1.5">
                  <UserButton
                    afterSignOutUrl={ROUTES.storefront.home}
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8",
                        userButtonPopoverActionButtonIcon: "text-primary",
                      },
                    }}
                  />
                </div>
              </>
            ) : null}
          </div>

          <button
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile menu"
            className={buttonVariants({
              className: "h-11 w-11 rounded-full px-0 md:hidden",
              variant: "outline",
            })}
            onClick={() => setMobileMenuOpen((open) => !open)}
            type="button"
          >
            <MenuIcon />
          </button>
        </div>

        <div className="hidden items-center justify-between gap-6 md:flex">
          <nav className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
            {STOREFRONT_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                className="font-medium hover:text-foreground"
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-sm text-muted-foreground">Free shipping on orders over $75</p>
        </div>

        <div className="lg:hidden">
          <div className="relative">
            <Input
              aria-label="Search storefront"
              className="pl-10"
              placeholder="Search the storefront"
            />
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              <SearchIcon />
            </span>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div className="card-shell space-y-4 p-4 md:hidden">
            <nav className="flex flex-col gap-2">
              {STOREFRONT_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-surface hover:text-foreground"
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex gap-3">
              <button
                className={buttonVariants({ className: "flex-1", variant: "outline" })}
                type="button"
              >
                <CartIcon />
                Cart
              </button>
              {!isLoaded ? (
                <div className="h-11 flex-1 rounded-full bg-muted" />
              ) : null}
              {isLoaded && !isSignedIn ? (
                <>
                  <Link
                    className={buttonVariants({ className: "flex-1", variant: "primary" })}
                    href={ROUTES.auth.signIn}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <AccountIcon />
                    Sign in
                  </Link>
                </>
              ) : null}
              {isLoaded && isSignedIn ? (
                <>
                  {showAdminLink ? (
                    <Link
                      className={buttonVariants({ className: "flex-1", variant: "outline" })}
                      href={ROUTES.admin.dashboard}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  ) : null}
                  <div className="flex flex-1 items-center justify-center rounded-full border border-border bg-white px-4 py-2">
                    <UserButton afterSignOutUrl={ROUTES.storefront.home} />
                  </div>
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </Container>
    </header>
  );
}
