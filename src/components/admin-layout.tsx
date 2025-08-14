
"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { Bell, Home, Users, Settings, LogOut, Shield, FileText, PenSquare, Building, BookUser, Car, Fingerprint, GraduationCap, HeartPulse, CreditCard, UserCircle, ReceiptText, ClipboardList, Menu, FileQuestion, LifeBuoy, BarChart3 } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { User } from "@/lib/types";
import { SriLankaTime } from "./sri-lanka-time";

const adminNavItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: Home },
  { title: "Applications", href: "/admin/applications", icon: FileText },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  workerMode?: boolean;
}

export function AdminLayout({ children, workerMode = false }: AdminLayoutProps) {
  const pathname = usePathname();
  const [worker, setWorker] = useState<User | null>(null);
  const [workerId, setWorkerId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchWorkerData = async () => {
      const idFromStorage = localStorage.getItem("workerId");
      setWorkerId(idFromStorage);

      if (workerMode) {
        if (idFromStorage) {
            const userDoc = await getDoc(doc(db, "users", idFromStorage));
            if (userDoc.exists()) {
              const userData = { id: userDoc.id, ...userDoc.data() } as User;
              setWorker(userData);
            }
        }
      } else { // Admin Mode
        const adminAvatar = localStorage.getItem('adminAvatar');
        setWorker({
          id: 'super-admin-01',
          name: 'Admin User',
          email: 'admin@gov.lk',
          role: 'Super Admin',
          status: 'Active',
          joined: new Date().toISOString(),
          nic: '',
          photoURL: adminAvatar || undefined
        });
      }
    };
    
    fetchWorkerData();
  }, [workerMode, pathname]);

  const getProfileHref = () => {
      if (!workerMode) return "/admin/profile";
      if(workerId) return `/worker/profile/${workerId}`;
      return '/admin/login';
  }

  const profileHref = getProfileHref();
  const logoText = workerMode ? "Worker Portal" : "Admin Panel";
  const LogoIcon = workerMode ? PenSquare : Shield;
  
  const fallbackInitial = worker ? worker.name?.charAt(0).toUpperCase() : (workerMode ? 'W' : 'A');

  const LogoComponent = () => {
    if (workerMode) {
      return (
        <div className="flex items-center gap-2 font-semibold">
          <LogoIcon className="h-6 w-6 text-primary" />
          <span>{logoText}</span>
        </div>
      );
    }
    return (
      <Link href="/admin/dashboard" className="flex items-center gap-2 font-semibold">
        <LogoIcon className="h-6 w-6 text-primary" />
        <span>{logoText}</span>
      </Link>
    );
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <LogoComponent />
          </div>
          <div className="flex-1">
             <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {!workerMode && adminNavItems.map((item) => (
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
            <SheetContent side="left" className="flex flex-col p-0">
               <nav className="grid gap-4 text-base font-medium">
                <div className="flex items-center gap-2 font-semibold mb-4 h-14 border-b px-6">
                    <LogoComponent />
                </div>
                {!workerMode && adminNavItems.map((item) => (
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
           <SriLankaTime />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                       <AvatarImage src={worker?.photoURL} alt={worker?.name} />
                       <AvatarFallback>{fallbackInitial}</AvatarFallback>
                    </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{worker?.name || "My Account"}</DropdownMenuLabel>
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
