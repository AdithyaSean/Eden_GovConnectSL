"use client";

import type React from "react";
import { SearchBar } from "@/components/search-bar";
import { UserNav } from "@/components/user-nav";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { Bell, Landmark, Menu } from "lucide-react";
import { navItems } from "@/lib/data";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Landmark className="h-7 w-7 text-primary" />
              <span className="inline-block font-bold text-xl">e-Citizen</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="hidden md:flex flex-1 justify-center max-w-md">
                <SearchBar />
            </div>
            <nav className="hidden md:flex items-center space-x-2">
              <LanguageSwitcher />
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Button>
              <UserNav />
            </nav>
          </div>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                className="md:hidden"
                size="icon"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center text-lg font-medium transition-colors hover:text-primary",
                       pathname === item.href ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    <item.icon className="mr-3 h-6 w-6" />
                    {item.title}
                  </Link>
                ))}
                <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 mb-4">
                        <LanguageSwitcher />
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <Bell className="h-5 w-5" />
                            <span className="sr-only">Notifications</span>
                        </Button>
                        <UserNav />
                    </div>
                    <SearchBar />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <main className="flex-1">{children}</main>
       <footer className="border-t">
        <div className="container py-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} e-Citizen Platform. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}
