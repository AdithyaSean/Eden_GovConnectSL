
"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { ServiceCard } from "@/components/service-card";
import { services } from "@/lib/data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Settings, Search, LifeBuoy, ArrowRight, UserSquare, Car, BookUser } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { collection, query, where, getDocs, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, type CarouselApi } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from 'next/image';

export default function DashboardPage() {
  const [stats, setStats] = useState({ documents: 0, activeServices: 0, notifications: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const [api, setApi] = useState<CarouselApi>();

  const carouselSlides = [
    { src: '/images/cmb2.jpg', alt: 'Lotus Tower in Colombo', hint: 'colombo architecture', titleLine1: 'Driving Digital Change', titleLine2: 'Shaping Sri Lanka’s Future' },
    { src: '/images/cmb10.jpg', alt: 'Colombo Skyscraper 3', hint: 'colombo architecture', titleLine1: 'Connect with Your Government', titleLine2: 'Anywhere, Anytime' },
    { src: '/images/cmb8.jpg', alt: 'Colombo Skyscraper at night', hint: 'colombo skyline night', titleLine1: 'All Government Services', titleLine2: 'Now At Your Fingertips' },
    { src: '/images/cmb5.jpg', alt: 'Colombo Skyscraper 3', hint: 'colombo architecture', titleLine1: 'Faster & More Secure', titleLine2: 'Your Safety, Our Priority' },
  ];

  const autoplayPlugin = useRef(Autoplay({ delay: 6000, stopOnInteraction: true }));

  const scrollPrev = useCallback(() => { api?.scrollPrev() }, [api]);
  const scrollNext = useCallback(() => { api?.scrollNext() }, [api]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const baseQuery = collection(db, "applications");
        const userAppsQuery = query(baseQuery, where("userId", "==", user.id));

        const activeServicesQuery = query(userAppsQuery, where("status", "in", ["Pending", "In Progress", "In Review"]));
        const documentsQuery = query(userAppsQuery, where("status", "in", ["Approved", "Completed"]));
        const notificationsQuery = query(collection(db, "notifications"), where("userId", "==", user.id), where("read", "==", false));

        const [
            activeServicesSnapshot,
            documentsSnapshot,
            notificationsSnapshot
        ] = await Promise.all([
            getCountFromServer(activeServicesQuery),
            getCountFromServer(documentsQuery),
            getCountFromServer(notificationsQuery),
        ]);

        setStats({
          documents: documentsSnapshot.data().count,
          activeServices: activeServicesSnapshot.data().count,
          notifications: notificationsSnapshot.data().count,
        });

      } catch (error) {
        console.error("Error fetching dashboard data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [user]);

  const filteredServices = useMemo(() => {
    if (!searchQuery) {
      return services;
    }
    return services.filter(service =>
      service.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);


  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        </div>
        {/* Carousel */}
        <div className="relative">
          <Carousel setApi={setApi} plugins={[autoplayPlugin.current]} opts={{ loop: true }}>
            <CarouselContent>
              {carouselSlides.map((slide, index) => (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden border-0">
                    <CardContent className="p-0 relative h-[500px]">
                      <Image src={slide.src} alt={slide.alt} fill className="object-cover" data-ai-hint={slide.hint} priority={index === 0} />
                      <div className="absolute inset-0 bg-black/50" />
                      <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16 text-white">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter leading-tight max-w-3xl">
                          <span className="block mb-4">{slide.titleLine1}</span>
                          <span className="block">{slide.titleLine2}</span>
                        </h2>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="absolute bottom-8 right-16 flex gap-0.05">
              <CarouselPrevious onClick={scrollPrev} />
              <CarouselNext onClick={scrollNext} />
            </div>
          </Carousel>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  My Digital Documents
                </CardTitle>
                 <UserSquare className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats.documents}</div>}
                <p className="text-xs text-muted-foreground">
                  Available for use
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Services
                </CardTitle>
                <BookUser className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats.activeServices}</div>}
                 <p className="text-xs text-muted-foreground">
                  Currently in-progress
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                <Bell className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-8 w-1/2" /> : <div className="text-2xl font-bold">{stats.notifications}</div>}
                <p className="text-xs text-muted-foreground">
                  Unread messages
                </p>
              </CardContent>
            </Card>
        </div>

        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold tracking-tight">Services</h2>
               <div className="relative w-full sm:w-auto sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder="Search services..." 
                    className="pl-10 h-11"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredServices.map((service) => (
                <ServiceCard key={service.title} service={service} />
              ))}
            </div>
        </div>

        <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex-shrink-0 flex items-center justify-center">
                    <LifeBuoy className="w-7 h-7" />
                  </div>
                  <div>
                    <CardTitle className="text-xl md:text-2xl">Help & Support</CardTitle>
                    <p className="text-sm opacity-80 mt-1">Get help with our services, or contact our team.</p>
                  </div>
                </div>
                <Button asChild variant="secondary" size="lg" className="w-full md:w-auto mt-4 md:mt-0">
                  <Link href="/support">
                    Contact Support <ArrowRight className="ml-2" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
        </Card>

      </div>
    </DashboardLayout>
  );
}
