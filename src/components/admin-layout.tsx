
"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Bell, Home, Users, Settings, LogOut, Shield, FileText, PenSquare, Building, BookUser, Car, Fingerprint, GraduationCap, HeartPulse, CreditCard } from "lucide-react";
import { Button } from "./ui/button";

const adminNavItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: Home },
  { title: "Applications", href: "/admin/applications", icon: FileText },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

const workerNavItems = [
    { title: "Transport", href: "/worker/transport/dashboard", icon: Car },
    { title: "Immigration", href: "/worker/immigration/dashboard", icon: BookUser },
    { title: "Identity", href: "/worker/identity/dashboard", icon: Fingerprint },
    { title: "Health", href: "/worker/health/dashboard", icon: HeartPulse },
    { title: "Tax", href: "/worker/tax/dashboard", icon: CreditCard },
    { title: "Pensions", href: "/worker/pension/dashboard", icon: Users },
    { title: "Land Registry", href: "/worker/landregistry/dashboard", icon: Building },
    { title: "Exams", href: "/worker/exams/dashboard", icon: GraduationCap },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  workerMode?: boolean;
}

export function AdminLayout({ children, workerMode = false }: AdminLayoutProps) {
  const pathname = usePathname();
  const navItems = workerMode ? workerNavItems : adminNavItems;
  const logoHref = workerMode ? "/worker/transport/dashboard" : "/admin/dashboard";
  const logoText = workerMode ? "Worker Portal" : "Admin Panel";
  const LogoIcon = workerMode ? PenSquare : Shield;


  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href={logoHref} className="flex items-center gap-2 font-semibold">
              <LogoIcon className="h-6 w-6 text-primary" />
              <span>{logoText}</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    pathname.startsWith(item.href) && "bg-muted text-primary"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <div className="w-full flex-1">
             {/* Can add a global search here if needed */}
          </div>
           <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
           <Button asChild variant="outline">
               <Link href="/login">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
               </Link>
            </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 bg-muted/40">
           {children}
        </main>
      </div>
    </div>
  );
}
