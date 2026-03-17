"use client";

import Link from "next/link";
import { useState } from "react";
import { UserButton, useAuth } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { APP_NAME } from "@/constants/app";
import { ROUTES, STOREFRONT_NAV_LINKS } from "@/constants/routes";
import { STORE_TAGLINE } from "@/constants/storefront";
import { useUserRole } from "@/hooks/use-user-role";
import { useAppSelector } from "@/hooks/use-redux";
import { isAdminRole } from "@/lib/auth/roles";
import { selectCartTotalQuantity } from "@/store/features/cart/cart-slice";

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m20 20-3.5-3.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
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
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
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
        strokeLinecap="round"
        strokeWidth="1.8"
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
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function StorefrontHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoaded, userId } = useAuth();
  const { isLoading: isRoleLoading, role } = useUserRole();
  const totalCartQuantity = useAppSelector(selectCartTotalQuantity);
  const isSignedIn = Boolean(userId);
  const showAdminLink = isSignedIn && !isRoleLoading && isAdminRole(role);

  return (
    <header className="sticky top-0 z-30 px-2 pt-3 sm:px-3">
      <Container className="space-y-3">
        <div className="editorial-panel hidden items-center justify-between gap-6 px-6 py-3 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground lg:flex">
          <p>Soft luxury essentials for everyday carry.</p>
          <p>Free signature delivery on orders above $75</p>
        </div>

        <div className="editorial-panel px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <Link className="flex min-w-0 items-center gap-3" href="/">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.35rem] bg-foreground text-sm font-semibold text-white shadow-[0_12px_30px_rgba(20,21,26,0.22)]">
                AS
              </span>
              <div className="min-w-0">
                <span className="font-display block truncate text-lg font-semibold tracking-[-0.05em]">
                  {APP_NAME}
                </span>
                <span className="hidden truncate text-xs uppercase tracking-[0.24em] text-muted-foreground sm:block">
                  {STORE_TAGLINE}
                </span>
              </div>
            </Link>

            <nav className="hidden flex-1 items-center justify-center gap-2 lg:flex">
              {STOREFRONT_NAV_LINKS.map((link) => (
                <Link key={link.href} className="chip-link" href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden max-w-sm flex-1 items-center gap-3 xl:flex">
              <form action={ROUTES.storefront.shop} className="relative flex-1">
                <Input
                  aria-label="Search storefront"
                  className="pl-11 pr-11"
                  name="q"
                  placeholder="Search the collection"
                />
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <SearchIcon />
                </span>
              </form>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              <Link
                aria-label="Open cart"
                className={buttonVariants({
                  className: "relative h-11 w-11 rounded-full px-0",
                  variant: "outline",
                })}
                href={ROUTES.storefront.cart}
              >
                <CartIcon />
                {totalCartQuantity > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[11px] font-semibold text-white">
                    {totalCartQuantity}
                  </span>
                ) : null}
              </Link>

              {!isLoaded ? <div className="h-11 w-24 rounded-full bg-muted" /> : null}

              {isLoaded && !isSignedIn ? (
                <>
                  <Link
                    className={buttonVariants({
                      className: "hidden lg:inline-flex",
                      variant: "outline",
                    })}
                    href={ROUTES.auth.signIn}
                  >
                    Sign in
                  </Link>
                  <Link
                    className={buttonVariants({ variant: "secondary" })}
                    href={ROUTES.auth.signUp}
                  >
                    Sign up
                  </Link>
                </>
              ) : null}

              {isLoaded && isSignedIn ? (
                <>
                  <Link
                    className={buttonVariants({
                      className: "hidden lg:inline-flex",
                      variant: "outline",
                    })}
                    href={ROUTES.storefront.account}
                  >
                    <AccountIcon />
                    Account
                  </Link>
                  {showAdminLink ? (
                    <Link
                      className={buttonVariants({
                        className: "hidden xl:inline-flex",
                        variant: "outline",
                      })}
                      href={ROUTES.admin.dashboard}
                    >
                      Admin
                    </Link>
                  ) : null}
                  <div className="flex h-11 items-center rounded-full border border-white/70 bg-white/80 px-1.5 shadow-[0_10px_24px_rgba(20,21,26,0.06)]">
                    <UserButton
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

          <div className="mt-4 lg:hidden">
            <form action={ROUTES.storefront.shop} className="relative">
              <Input
                aria-label="Search storefront"
                className="pl-11 pr-11"
                name="q"
                placeholder="Search the storefront"
              />
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <SearchIcon />
              </span>
            </form>
          </div>
        </div>

        {mobileMenuOpen ? (
          <div className="editorial-panel space-y-4 p-4 md:hidden">
            <nav className="grid grid-cols-2 gap-2">
              {STOREFRONT_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  className="rounded-[1.2rem] border border-white/75 bg-white/70 px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-white hover:text-foreground"
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="grid gap-2">
              <Link
                className={buttonVariants({ className: "w-full", variant: "outline" })}
                href={ROUTES.storefront.cart}
                onClick={() => setMobileMenuOpen(false)}
              >
                <CartIcon />
                Cart
                {totalCartQuantity > 0 ? ` (${totalCartQuantity})` : ""}
              </Link>

              {!isLoaded ? <div className="h-11 rounded-full bg-muted" /> : null}

              {isLoaded && !isSignedIn ? (
                <>
                  <Link
                    className={buttonVariants({ className: "w-full", variant: "outline" })}
                    href={ROUTES.auth.signIn}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    className={buttonVariants({ className: "w-full", variant: "secondary" })}
                    href={ROUTES.auth.signUp}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create account
                  </Link>
                </>
              ) : null}

              {isLoaded && isSignedIn ? (
                <>
                  <Link
                    className={buttonVariants({ className: "w-full", variant: "outline" })}
                    href={ROUTES.storefront.account}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Account center
                  </Link>
                  {showAdminLink ? (
                    <Link
                      className={buttonVariants({ className: "w-full", variant: "outline" })}
                      href={ROUTES.admin.dashboard}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin dashboard
                    </Link>
                  ) : null}
                  <div className="flex items-center justify-center rounded-[1.2rem] border border-white/80 bg-white/80 px-4 py-3">
                    <UserButton />
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
