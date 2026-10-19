"use client";

import {
  BadgePercent,
  ChartNoAxesColumn,
  GitBranch,
  Home,
  HomeIcon,
  LayoutDashboard,
  LogOut,
  LogOutIcon,
  Package,
  Settings,
  ShoppingCart,
  Tags,
  X,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../share/Logo";

const navigation = [
  { title: "overview", url: "/dashboard", icon: HomeIcon },
  { title: "products", url: "/dashboard/products", icon: Package },
  { title: "categories", url: "/dashboard/categories", icon: LayoutDashboard },
  { title: "branches", url: "/dashboard/branches", icon: GitBranch },
  { title: "promotions", url: "/dashboard/promotions", icon: BadgePercent },
  { title: "orders", url: "/dashboard/orders", icon: ShoppingCart },
  { title: "reports", url: "/dashboard/reports", icon: ChartNoAxesColumn },
  { title: "settings", url: "/dashboard/settings", icon: Settings },
];

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const t = useTranslations("navigation");
  const locale = useLocale();
  const pathname = usePathname();

  const currentPath = pathname.replace(`/${locale}`, "") || "/";

  const isActiveLink = (url: string) =>
    url === "/dashboard"
      ? currentPath === url
      : currentPath === url || currentPath.startsWith(`${url}/`);

  const handleLogout = () => {};

  return (
    <>
      <button
        type="button"
        aria-label="Close sidebar"
        aria-hidden={!isOpen}
        tabIndex={isOpen ? 0 : -1}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        id="dashboard-sidebar"
        aria-label="Dashboard navigation"
        aria-hidden={!isOpen}
        className={`fixed inset-y-0 start-0 z-50 flex w-72 flex-col gap-8 overflow-y-auto border-e border-border bg-background py-6 shadow-xl transition-transform duration-300 ease-in-out md:inset-y-8 md:start-8 md:w-64 md:rounded-2xl md:border md:shadow-sm ${
          isOpen
            ? "translate-x-0"
            : "md:translate-x-0! -translate-x-full rtl:translate-x-full"
        } md:translate-x-0`}
      >
        <header className="flex items-center justify-between px-4">
          <Logo />
        </header>

        <nav className="space-y-2 px-3 flex-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActiveLink(item.url);

            return (
              <Link
                key={item.url}
                href={`/${locale}${item.url}`}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={` duration-200 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-accent-wash font-medium text-primary"
                    : "text-muted-ink hover:bg-accent-wash hover:text-primary"
                }`}
              >
                <Icon size={18} strokeWidth={1.8} />
                <span>{t(item.title)}</span>
              </Link>
            );
          })}
        </nav>
        <footer className=" px-3 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-ink transition-colors hover:bg-destructive/10 hover:text-destructive duration-200 cursor-pointer"
          >
            <LogOut size={18} strokeWidth={1.8} />
            <span>{t("logout")}</span>
          </button>
        </footer>
      </aside>
    </>
  );
};

export default Sidebar;
