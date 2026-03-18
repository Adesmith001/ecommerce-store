"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { UserButton, useAuth } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { ROUTES, STOREFRONT_NAV_LINKS } from "@/constants/routes";
import { useNotificationSummary } from "@/hooks/use-notification-summary";
import { useUserRole } from "@/hooks/use-user-role";
import { useAppSelector } from "@/hooks/use-redux";
import { isAdminRole } from "@/lib/auth/roles";
import { getNotificationActionHref } from "@/lib/notifications/notification-links";
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

function NotificationIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 18h8m-7-8.5a3 3 0 1 1 6 0V12c0 .9.3 1.8.9 2.5l.8.9a1 1 0 0 1-.8 1.6H8.1a1 1 0 0 1-.8-1.6l.8-.9c.6-.7.9-1.6.9-2.5V9.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M10.5 18a1.5 1.5 0 0 0 3 0"
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

function formatNotificationDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
  });
}

type StorefrontHeaderProps = {
  announcementText: string;
  logoAlt?: string;
  logoUrl?: string | null;
  storeName: string;
  tagline: string;
  topbarDetail?: string;
};

export function StorefrontHeader({
  announcementText,
  logoAlt,
  logoUrl,
  storeName,
  tagline,
  topbarDetail,
}: StorefrontHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationPanelRef = useRef<HTMLDivElement | null>(null);
  const { isLoaded, userId } = useAuth();
  const { isLoading: isRoleLoading, role } = useUserRole();
  const totalCartQuantity = useAppSelector(selectCartTotalQuantity);
  const isSignedIn = Boolean(userId);
  const {
    error: notificationError,
    isLoading: isNotificationsLoading,
    summary: notificationSummary,
  } = useNotificationSummary("user", isSignedIn);
  const showAdminLink = isSignedIn && !isRoleLoading && isAdminRole(role);
  const latestNotifications = notificationSummary.notifications.slice(0, 3);

  useEffect(() => {
    if (!notificationsOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (
        notificationPanelRef.current &&
        !notificationPanelRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [notificationsOpen]);

  return (
    <header className="sticky top-0 z-30 px-2 pt-3 sm:px-3">
      <Container className="space-y-3">
        <div className="editorial-panel hidden items-center justify-between gap-6 px-6 py-3 text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground lg:flex">
          <p>{announcementText}</p>
          <p>{topbarDetail || tagline}</p>
        </div>

        <div className="editorial-panel px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <Link className="flex min-w-0 items-center gap-3" href="/">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={logoAlt || storeName}
                  className="h-11 w-11 shrink-0 rounded-[1.35rem] object-cover shadow-[0_12px_30px_rgba(20,21,26,0.18)]"
                  src={logoUrl}
                />
              ) : (
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[1.35rem] bg-foreground text-sm font-semibold text-white shadow-[0_12px_30px_rgba(20,21,26,0.22)]">
                  {storeName.slice(0, 2).toUpperCase()}
                </span>
              )}
              <div className="min-w-0">
                <span className="font-display block truncate text-lg font-semibold tracking-[-0.05em]">
                  {storeName}
                </span>
                <span className="hidden truncate text-xs uppercase tracking-[0.24em] text-muted-foreground sm:block">
                  {tagline}
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
              {isLoaded && isSignedIn ? (
                <div className="relative" ref={notificationPanelRef}>
                  <button
                    aria-expanded={notificationsOpen}
                    aria-haspopup="dialog"
                    aria-label="Open notifications preview"
                    className={buttonVariants({
                      className: "relative h-11 w-11 rounded-full px-0",
                      variant: "outline",
                    })}
                    onClick={() => setNotificationsOpen((open) => !open)}
                    type="button"
                  >
                    <NotificationIcon />
                    {notificationSummary.unreadCount > 0 ? (
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-white">
                        {notificationSummary.unreadCount}
                      </span>
                    ) : null}
                  </button>

                  {notificationsOpen ? (
                    <div className="absolute right-0 top-[calc(100%+0.85rem)] z-40 w-88 rounded-[1.8rem] border border-white/80 bg-white/92 p-4 shadow-[0_28px_70px_rgba(20,21,26,0.16)] backdrop-blur-xl">
                      <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-3">
                        <div>
                          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
                            Latest Activity
                          </p>
                          <p className="mt-2 text-sm text-muted-foreground">
                            {notificationSummary.unreadCount} unread notification
                            {notificationSummary.unreadCount === 1 ? "" : "s"}
                          </p>
                        </div>
                        <Link
                          className="text-xs font-semibold uppercase tracking-[0.18em] text-primary"
                          href={ROUTES.storefront.accountNotifications}
                          onClick={() => setNotificationsOpen(false)}
                        >
                          View all
                        </Link>
                      </div>

                      <div className="mt-3 space-y-2">
                        {isNotificationsLoading ? (
                          <div className="rounded-[1.4rem] border border-white/75 bg-white/72 px-4 py-5 text-sm text-muted-foreground">
                            Loading notifications...
                          </div>
                        ) : null}

                        {!isNotificationsLoading && notificationError ? (
                          <div className="rounded-[1.4rem] border border-danger/15 bg-danger/5 px-4 py-5 text-sm text-danger">
                            {notificationError}
                          </div>
                        ) : null}

                        {!isNotificationsLoading &&
                        !notificationError &&
                        latestNotifications.length === 0 ? (
                          <div className="rounded-[1.4rem] border border-white/75 bg-white/72 px-4 py-5 text-sm text-muted-foreground">
                            No recent notifications yet.
                          </div>
                        ) : null}

                        {!isNotificationsLoading && !notificationError
                          ? latestNotifications.map((notification) => {
                              const actionHref =
                                getNotificationActionHref(notification) ??
                                ROUTES.storefront.accountNotifications;
                              const isRead =
                                userId &&
                                notification.readByClerkIds.includes(userId);

                              return (
                                <Link
                                  key={notification.id}
                                  className="block rounded-[1.4rem] border border-white/75 bg-white/76 px-4 py-3 transition hover:bg-white"
                                  href={actionHref}
                                  onClick={() => setNotificationsOpen(false)}
                                >
                                  <div className="flex items-start gap-3">
                                    <span
                                      className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                                        isRead ? "bg-border" : "bg-primary"
                                      }`}
                                    />
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-start justify-between gap-3">
                                        <p className="truncate text-sm font-semibold text-foreground">
                                          {notification.title}
                                        </p>
                                        <span className="shrink-0 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                                          {formatNotificationDate(notification.createdAt)}
                                        </span>
                                      </div>
                                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                                        {notification.message}
                                      </p>
                                    </div>
                                  </div>
                                </Link>
                              );
                            })
                          : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}

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
              {isLoaded && isSignedIn ? (
                <Link
                  className={buttonVariants({ className: "w-full", variant: "outline" })}
                  href={ROUTES.storefront.accountNotifications}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <NotificationIcon />
                  Notifications
                  {notificationSummary.unreadCount > 0
                    ? ` (${notificationSummary.unreadCount})`
                    : ""}
                </Link>
              ) : null}

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
