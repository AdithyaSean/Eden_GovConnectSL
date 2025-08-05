"use client";

import type React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { SearchBar } from "@/components/search-bar";
import { UserNav } from "@/components/user-nav";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Button } from "@/components/ui/button";
import { Bell, Landmark } from "lucide-react";
import { navItems } from "@/lib/data";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sidebar-accent rounded-lg">
              <Landmark className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-semibold font-headline text-sidebar-foreground">
              e-Citizen
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={{
                    children: item.title,
                    className: "bg-primary text-primary-foreground",
                  }}
                  isActive={item.href === "/"}
                >
                  <a href={item.href}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            {/* Can add footer items here later */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex items-center h-16 px-4 bg-background/80 backdrop-blur-sm border-b shrink-0">
          <div className="md:hidden">
            <SidebarTrigger />
          </div>
          <div className="flex-1 flex justify-center md:px-4">
            <SearchBar />
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <UserNav />
          </div>
        </header>
        <main className="overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
