import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
// import {  Minus } from "lucide-react";

interface SidebarNavItemProps {
  to: string;
  label: string;
  icon?: ReactNode;
  exact?: boolean;
  className?: string;
}

export const SidebarNavItem = ({ to, label,  exact = false, className }: SidebarNavItemProps) => {
  const location = useLocation();
  const isActive = exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-2 px-4 py-2 text-sm font-medium w-full hover:bg-muted rounded transition",
        isActive && "bg-muted text-primary",
        className
      )}
    >
      {/* {icon} */}
      {/* <Minus /> */}
      <span>{label}</span>
    </Link>
  );
};
