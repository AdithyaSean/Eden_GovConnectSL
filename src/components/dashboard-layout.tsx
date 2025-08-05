"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/data";
import { Bell, MessageCircle, Search, UserSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
             <UserSquare className="h-7 w-7 text-primary" />
            <span>e-Services</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" className="rounded-full">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
             <Link href="/chat">
              <Button variant="ghost" size="icon" className="rounded-full">
                  <MessageCircle className="h-5 w-5" />
                  <span className="sr-only">AI Assistant</span>
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="https://placehold.co/100x100" alt="@shadcn" data-ai-hint="avatar user" />
                  <AvatarFallback>SL</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="container mx-auto">
        {children}
      </main>
      <footer className="border-t">
        <div className="container mx-auto py-6 text-center text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} e-Services Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
