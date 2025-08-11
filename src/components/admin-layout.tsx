

"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Bell, Home, Users, Settings, LogOut, Shield, FileText, PenSquare, Building, BookUser, Car, Fingerprint, GraduationCap, HeartPulse, CreditCard, UserCircle, ReceiptText, ClipboardList, Menu, FileQuestion, LifeBuoy } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useEffect, useState } from "react";

const adminNavItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: Home },
  { title: "Applications", href: "/admin/applications", icon: FileText },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

const allWorkerNavItems = [
    { title: "Transport", href: "/worker/transport/dashboard", icon: Car, role: "transport" },
    { title: "Immigration", href: "/worker/immigration/dashboard", icon: BookUser, role: "immigration" },
    { title: "Identity", href: "/worker/identity/dashboard", icon: Fingerprint, role: "identity" },
    { title: "Missing Documents", href: "/worker/missingdocuments/dashboard", icon: FileQuestion, role: "missingdocuments" },
    { title: "Health", href: "/worker/health/dashboard", icon: HeartPulse, role: "health" },
    { title: "Tax", href: "/worker/tax/dashboard", icon: CreditCard, role: "tax" },
    { title: "Pensions", href: "/worker/pension/dashboard", icon: Users, role: "pension" },
    { title: "Land Registry", href: "/worker/landregistry/dashboard", icon: Building, role: "landregistry" },
    { title: "Exams", href: "/worker/exams/dashboard", icon: GraduationCap, role: "exams" },
    { title: "Fine Payment", href: "/worker/fine-payment/dashboard", icon: ReceiptText, role: "finepayment" },
    { title: "Registered Vehicles", href: "/worker/registered-vehicles/dashboard", icon: ClipboardList, role: "registeredvehicles" },
    { title: "Support", href: "/worker/support/dashboard", icon: LifeBuoy, role: "support" },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  workerMode?: boolean;
}

export function AdminLayout({ children, workerMode = false }: AdminLayoutProps) {
  const pathname = usePathname();
  const [workerRole, setWorkerRole] = useState<string | null>(null);

  useEffect(() => {
    // This effect runs on the client-side, so localStorage is available.
    if (workerMode) {
      const roleFromPath = pathname.split('/')[2];
      const roleFromStorage = localStorage.getItem("workerRole");
      const activeRole = roleFromPath && allWorkerNavItems.some(item => item.role === roleFromPath) ? roleFromPath : roleFromStorage;
      
      setWorkerRole(activeRole);
      
      // If the role from the path is different from storage, update storage.
      // This keeps the session consistent when navigating between worker dashboards (if that were possible).
      if (activeRole && activeRole !== roleFromStorage) {
        localStorage.setItem("workerRole", activeRole);
      }
    }
  }, [pathname, workerMode]);

  const getWorkerNavItems = () => {
    if (workerRole) {
      const navItem = allWorkerNavItems.find(item => item.role === workerRole);
      return navItem ? [
          {...navItem, title: "Dashboard", href: navItem.href}
      ] : [];
    }
    return [];
  };

  const navItems = workerMode ? getWorkerNavItems() : adminNavItems;
  const logoHref = workerMode ? (workerRole ? `/worker/${workerRole}/dashboard` : '/admin/login') : "/admin/dashboard";
  const profileHref = workerMode ? (workerRole ? `/worker/${workerRole}/profile` : '/admin/login') : "/admin/profile";
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
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-4 text-base font-medium">
                <Link href={logoHref} className="flex items-center gap-2 font-semibold mb-4">
                  <LogoIcon className="h-6 w-6 text-primary" />
                  <span>{logoText}</span>
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                      pathname.startsWith(item.href) && "bg-muted text-primary"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <div className="w-full flex-1">
             {/* Can add a global search here if needed */}
          </div>
           <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                       <AvatarFallback>{workerMode ? 'W' : 'A'}</AvatarFallback>
                    </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={profileHref}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                 <DropdownMenuItem asChild>
                   <Link href="/login">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                   </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

        </header>
        <main className="flex flex-1 flex-col gap-4 bg-muted/40">
           {children}
        </main>
      </div>
    </div>
  );
}
