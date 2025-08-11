
"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/data";
import { Bell, Menu, MessageCircle, Search, UserSquare, CheckCircle, CreditCard, Calendar, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";

const notifications = [
    {
        title: "Application Approved",
        description: "Your Driving License renewal is complete.",
        time: "2 hours ago",
        href: "/my-applications",
        icon: CheckCircle,
    },
    {
        title: "Payment Received",
        description: "Payment for National ID application was successful.",
        time: "1 day ago",
        href: "/payments",
        icon: CreditCard,
    },
    {
        title: "Appointment Reminder",
        description: "Biometrics for NIC on Aug 28, 2024.",
        time: "/services/national-id-services",
        icon: Calendar,
    }
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
      localStorage.removeItem("loggedInNic");
      router.push('/login');
  }

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-card shadow-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-0">
                <div className="p-6">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-lg font-semibold mb-4"
                  >
                    <UserSquare className="h-6 w-6 text-primary" />
                    <span>GovConnect SL</span>
                  </Link>
                </div>
                <ScrollArea className="flex-grow">
                  <nav className="grid gap-2 text-base font-medium p-4 pt-0">
                    {navItems.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                         className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                          pathname === item.href && "text-primary bg-muted"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.title}
                      </Link>
                    ))}
                  </nav>
                </ScrollArea>
              </SheetContent>
            </Sheet>
            <Link href="/dashboard" className="hidden md:flex items-center gap-2 font-bold text-lg">
              <UserSquare className="h-7 w-7 text-primary" />
              <span>GovConnect SL</span>
            </Link>
          </div>

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
          
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
            </Button>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full relative">
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Notifications</span>
                        <Badge className="absolute top-1 right-1 h-4 w-4 shrink-0 justify-center rounded-full p-0 text-xs">{notifications.length}</Badge>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel className="px-3 py-2">Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <ScrollArea className="h-72">
                    {notifications.map((notification, index) => (
                        <DropdownMenuItem key={index} asChild className="p-0">
                           <Link href={notification.href} className="flex items-start gap-3 p-3 w-full">
                                <notification.icon className="h-5 w-5 mt-1 text-primary flex-shrink-0" />
                                <div className="flex flex-col gap-1">
                                    <p className="font-medium leading-tight">{notification.title}</p>
                                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                                    <p className="text-xs text-muted-foreground/70">{notification.time}</p>
                               </div>
                           </Link>
                        </DropdownMenuItem>
                    ))}
                    </ScrollArea>
                </DropdownMenuContent>
             </DropdownMenu>
             <Link href="/chat">
              <Button variant="ghost" size="icon" className="rounded-full">
                  <MessageCircle className="h-5 w-5" />
                  <span className="sr-only">AI Assistant</span>
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer h-9 w-9">
                  <AvatarImage src="https://placehold.co/100x100" alt={user?.name} data-ai-hint="avatar user" />
                  <AvatarFallback>{user?.name ? user.name.charAt(0) : 'U'}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.name || "Citizen"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link href="/profile">Profile</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/payments">Payments</Link></DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="container mx-auto">
        {children}
      </main>
      <footer className="border-t">
        <div className="container mx-auto py-6 text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} GovConnect SL. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
