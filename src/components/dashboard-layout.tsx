"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Home, Briefcase, User, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/data";


export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 pb-24">
        {children}
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-card border-t z-50">
        <nav className="container flex justify-around items-center h-16">
          {navItems.map((item) => (
            <Link key={item.title} href={item.href} className={cn(
              "flex flex-col items-center justify-center gap-1 transition-colors w-full h-full",
              pathname === item.href 
                ? "text-primary font-semibold" 
                : "text-muted-foreground hover:text-primary"
            )}>
              <item.icon className="h-6 w-6" />
              <span className="text-xs">{item.title}</span>
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}
