"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { UserButton, useAuth } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { ROUTES, STOREFRONT_NAV_LINKS } from "@/constants/routes";
import { useNotificationSummary } from "@/hooks/use-notification-summary";
import { useUserRole } from "@/hooks/use-user-role";
import { useAppSelector } from "@/hooks/use-redux";
import { isAdminRole } from "@/lib/auth/roles";
import { getNotificationActionHref } from "@/lib/notifications/notification-links";
import { selectCartTotalQuantity } from "@/store/features/cart/cart-slice";

function CartIcon() {
  return (
    <svg aria-hidden="true" className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none">
      <path
        d="M4 6h2l2.2 9.5a1 1 0 0 0 1 .8h7.9a1 1 0 0 0 1-.8L20 9H8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <circle cx="10" cy="19" r="1.25" fill="currentColor" />
      <circle cx="17" cy="19" r="1.25" fill="currentColor" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg aria-hidden="true" className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.25" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M5.5 18.5c1.6-2.8 3.9-4.2 6.5-4.2s4.9 1.4 6.5 4.2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function NotificationIcon() {
  return (
    <svg aria-hidden="true" className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="none">
      <path
        d="M8.5 17.5h7m-6.25-8a3.75 3.75 0 1 1 7.5 0V12c0 .9.3 1.8.86 2.5l.66.83a1 1 0 0 1-.78 1.62H7.5a1 1 0 0 1-.78-1.62l.66-.83A4 4 0 0 0 8.25 12V9.5Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M10.5 17.5a1.5 1.5 0 0 0 3 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16M4 12h11M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function BrandMark() {
  return <span aria-hidden="true" className="storefront-brand-mark shrink-0" />;
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

function HeaderIconButton({
  ariaLabel,
  children,
  href,
  onClick,
}: {
  ariaLabel: string;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const className =
    "inline-flex h-12 w-12 items-center justify-center rounded-full border border-foreground bg-white text-foreground";

  if (href) {
    return (
      <Link aria-label={ariaLabel} className={className} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button aria-label={ariaLabel} className={className} onClick={onClick} type="button">
      {children}
    </button>
  );
}

export function StorefrontHeader({
  announcementText,
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
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/92 backdrop-blur-xl">
      <Container className="space-y-3 py-4">
        <div className="hidden items-center justify-between text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground lg:flex">
          <p>{announcementText}</p>
          <p>{topbarDetail || tagline}</p>
        </div>

        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <div className="flex items-center gap-3">
            <button
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-transparent text-foreground lg:hidden"
              onClick={() => setMobileMenuOpen((open) => !open)}
              type="button"
            >
              <MenuIcon />
            </button>

            <nav className="hidden items-center gap-8 lg:flex">
              {STOREFRONT_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  className="text-sm font-medium tracking-[0.16em] text-foreground/78 uppercase hover:text-foreground"
                  href={link.href}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                className="text-sm font-medium tracking-[0.16em] text-foreground/78 uppercase hover:text-foreground"
                href={ROUTES.storefront.shop}
              >
                New
              </Link>
            </nav>
          </div>

          <Link
            className="mx-auto flex items-center gap-3 text-center"
            href={ROUTES.storefront.home}
          >
            <BrandMark />
            <div className="hidden min-w-0 sm:block">
              <span className="font-display block text-lg font-bold uppercase tracking-[0.18em]">
                {storeName}
              </span>
            </div>
          </Link>

          <div className="flex items-center justify-end gap-2.5">
            {isLoaded && isSignedIn ? (
              <div className="relative hidden md:block" ref={notificationPanelRef}>
                <HeaderIconButton
                  ariaLabel="Open notifications"
                  onClick={() => setNotificationsOpen((open) => !open)}
                >
                  <NotificationIcon />
                </HeaderIconButton>
                {notificationSummary.unreadCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1b33d6] px-1 text-[10px] font-semibold text-white">
                    {notificationSummary.unreadCount}
                  </span>
                ) : null}

                {notificationsOpen ? (
                  <div className="absolute right-0 top-[calc(100%+0.9rem)] z-50 w-[22rem] rounded-[1.6rem] border border-border bg-[rgba(255,255,255,0.95)] p-4 shadow-[0_28px_80px_rgba(17,17,17,0.14)]">
                    <div className="flex items-start justify-between gap-3 border-b border-border/80 pb-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                          Latest activity
                        </p>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {notificationSummary.unreadCount} unread notification
                          {notificationSummary.unreadCount === 1 ? "" : "s"}
                        </p>
                      </div>
                      <Link
                        className="text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground"
                        href={ROUTES.storefront.accountNotifications}
                        onClick={() => setNotificationsOpen(false)}
                      >
                        View all
                      </Link>
                    </div>

                    <div className="mt-3 space-y-2">
                      {isNotificationsLoading ? (
                        <div className="rounded-[1.2rem] border border-border bg-muted/55 px-4 py-5 text-sm text-muted-foreground">
                          Loading notifications...
                        </div>
                      ) : null}

                      {!isNotificationsLoading && notificationError ? (
                        <div className="rounded-[1.2rem] border border-danger/25 bg-danger/5 px-4 py-5 text-sm text-danger">
                          {notificationError}
                        </div>
                      ) : null}

                      {!isNotificationsLoading &&
                      !notificationError &&
                      latestNotifications.length === 0 ? (
                        <div className="rounded-[1.2rem] border border-border bg-muted/55 px-4 py-5 text-sm text-muted-foreground">
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
                                className="block rounded-[1.2rem] border border-border bg-white/80 px-4 py-3 hover:bg-white"
                                href={actionHref}
                                onClick={() => setNotificationsOpen(false)}
                              >
                                <div className="flex items-start gap-3">
                                  <span
                                    className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                                      isRead ? "bg-border" : "bg-[#1b33d6]"
                                    }`}
                                  />
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-start justify-between gap-3">
                                      <p className="truncate text-sm font-semibold text-foreground">
                                        {notification.title}
                                      </p>
                                      <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
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
              className="relative inline-flex h-12 min-w-12 items-center justify-center gap-2 rounded-full border border-foreground bg-foreground px-5 text-sm font-medium tracking-[0.16em] text-primary-foreground uppercase"
              href={ROUTES.storefront.cart}
            >
              <span className="hidden sm:inline">Cart</span>
              <span className="sm:hidden">
                <CartIcon />
              </span>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary-foreground/30 bg-primary-foreground text-[11px] font-semibold text-foreground">
                {totalCartQuantity}
              </span>
            </Link>

            {!isLoaded ? <div className="hidden h-12 w-12 rounded-full bg-muted md:block" /> : null}

            {isLoaded && !isSignedIn ? (
              <>
                <Link
                  className={buttonVariants({
                    className: "hidden md:inline-flex rounded-full",
                    variant: "outline",
                  })}
                  href={ROUTES.auth.signIn}
                >
                  Sign in
                </Link>
                <Link
                  className="hidden h-12 w-12 items-center justify-center rounded-full border border-foreground bg-white text-foreground md:inline-flex"
                  href={ROUTES.auth.signUp}
                >
                  <AccountIcon />
                </Link>
              </>
            ) : null}

            {isLoaded && isSignedIn ? (
              <>
                <Link
                  aria-label="Account"
                  className="hidden h-12 w-12 items-center justify-center rounded-full border border-foreground bg-white text-foreground md:inline-flex"
                  href={ROUTES.storefront.account}
                >
                  <AccountIcon />
                </Link>
                {showAdminLink ? (
                  <Link
                    className={buttonVariants({
                      className: "hidden xl:inline-flex rounded-full",
                      variant: "outline",
                    })}
                    href={ROUTES.admin.dashboard}
                  >
                    Admin
                  </Link>
                ) : null}
                <div className="hidden md:flex h-12 items-center rounded-full border border-foreground bg-white px-1.5">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-8 w-8",
                      },
                    }}
                  />
                </div>
              </>
            ) : null}
          </div>
        </div>

        {mobileMenuOpen ? (
          <div className="rounded-[1.6rem] border border-border bg-[rgba(255,255,255,0.9)] p-5 lg:hidden">
            <div className="grid gap-3">
              {STOREFRONT_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  className="rounded-[1rem] border border-border bg-white/70 px-4 py-3 text-sm font-medium uppercase tracking-[0.16em] text-foreground"
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                className="rounded-[1rem] border border-border bg-white/70 px-4 py-3 text-sm font-medium uppercase tracking-[0.16em] text-foreground"
                href={ROUTES.storefront.shop}
                onClick={() => setMobileMenuOpen(false)}
              >
                New
              </Link>

              {isLoaded && isSignedIn ? (
                <>
                  <Link
                    className={buttonVariants({ className: "w-full", variant: "outline" })}
                    href={ROUTES.storefront.account}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Account
                  </Link>
                  <Link
                    className={buttonVariants({ className: "w-full", variant: "outline" })}
                    href={ROUTES.storefront.accountNotifications}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Notifications
                    {notificationSummary.unreadCount > 0
                      ? ` (${notificationSummary.unreadCount})`
                      : ""}
                  </Link>
                  {showAdminLink ? (
                    <Link
                      className={buttonVariants({ className: "w-full", variant: "outline" })}
                      href={ROUTES.admin.dashboard}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  ) : null}
                </>
              ) : null}

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
                    className={buttonVariants({ className: "w-full" })}
                    href={ROUTES.auth.signUp}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create account
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        ) : null}
      </Container>
    </header>
  );
}
